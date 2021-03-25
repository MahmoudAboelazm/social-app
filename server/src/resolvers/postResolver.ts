import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}
@ObjectType()
class FieldPostError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldPostError], { nullable: true })
  error?: FieldPostError[];

  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext,
  ): Promise<PostResponse> {
    if (input.title.length < 1) {
      return {
        error: [
          { field: "title", message: "title must be at least 1 charcters" },
        ],
      };
    }

    if (input.text.length < 1) {
      return {
        error: [
          { field: "text", message: "text must be at least 1 charcters" },
        ],
      };
    }
    const post: Post = await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();

    return { post };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  deletePost(@Arg("postId", () => Int) postId: number) {
    Post.delete({ id: postId });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("value", () => Int) value: number,
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext,
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } });

    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
       update updoot 
       set value = ${realValue}
       where "postId" = ${postId} and "userId" = ${userId};
        `);

        await tm.query(`
       update post 
       set points = points + ${realValue * 2}
       where id = ${postId}
        `);
      });
    } else if (updoot && updoot.value === realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        delete from updoot where "postId" = ${postId} and "userId" = ${userId}
        `);

        await tm.query(`
       update post 
       set points = points - ${realValue}
       where id = ${postId}
        `);
      });
    } else {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `insert into updoot("userId", "postId", value)
          values (${userId}, ${postId}, ${realValue});
          
          `,
        );
        await tm.query(
          `
          update post 
          set points = points + ${realValue}
          where post.id = ${postId};
     `,
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext,
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any = [realLimitPlusOne];

    if (req.session.userId) {
      replacements.push(req.session.userId);
    }

    let cursorIndx;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIndx = replacements.length;
    }

    const posts = await getConnection().query(
      `
      select p.*,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
      ) creator
      ${
        req.session.userId
          ? ',(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"'
          : ',null as "voteStatus"'
      }
      from post p
      
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? `where p."createdAt" < $${cursorIndx}` : ""}
      order by p."createdAt" DESC
      limit $1

      `,
      replacements,
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .orderBy('"createdAt"', "DESC") ///
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    // }
    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length > realLimit,
    };
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext,
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) {
      return undefined;
    }
    const vote = await Updoot.findOne({
      postId: id,
      userId: req.session.userId,
    });
    if (vote) post.voteStatus = vote.value;
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Ctx() { req }: MyContext,
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (post.creatorId == req.session.userId) {
      if (typeof title !== undefined && typeof text !== undefined) {
        post.title = title;
        await Post.update({ id }, { title, text });
        post.text = text;
        post.title = title;
      }
    }
    const vote = await Updoot.findOne({
      postId: id,
      userId: req.session.userId,
    });
    if (vote) post.voteStatus = vote.value;
    return post;
  }
}
