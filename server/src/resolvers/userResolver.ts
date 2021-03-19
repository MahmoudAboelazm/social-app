import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  InputType,
  Field,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { v4 } from "uuid";
import { FORGET_PASSOWORD } from "../constants";
import { sendEmail } from "../utils/sendMail";
import { getConnection } from "typeorm";

@InputType()
class userInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => String)
  email(@Ctx() { req }: MyContext, @Root() user: User) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext,
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSOWORD + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3,
    );
    console.log(token);
    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">set your password<a/>`,
    );
    return true;
  }
  @Mutation(() => UserResponse)
  async resetPassord(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { redis }: MyContext,
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        error: [
          { field: "newPassword", message: "password must be at least 3 char" },
        ],
      };
    }

    const key = FORGET_PASSOWORD + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        error: [{ field: "newPassword", message: "token expired" }],
      };
    }
    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        error: [{ field: "newPassword", message: "username no longer exist" }],
      };
    }

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) },
    );
    await redis.del(key);
    return { user };
  }
  @Query(() => [User])
  async users() {
    return await User.find({});
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: userInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        error: [
          {
            field: "username",
            message: "username must be at least 3 char",
          },
        ],
      };
    }
    if (options.username.includes("@")) {
      return {
        error: [
          {
            field: "username",
            message: "username must not include @",
          },
        ],
      };
    }

    if (options.email.length <= 2) {
      return {
        error: [
          {
            field: "email",
            message: "email must be at least 3 char",
          },
        ],
      };
    }
    if (!options.email.includes("@")) {
      return {
        error: [
          {
            field: "email",
            message: "email must include @",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        error: [
          {
            field: "password",
            message: "password must be at least 3 char",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);

    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if ((err.code = "23505")) {
        return {
          error: [
            {
              field: "username",
              message: "username already exist",
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } },
    );
    if (!user) {
      return {
        error: [
          {
            field: "usernameOrEmail",
            message: "usernameOrEmail doesn't exist",
          },
        ],
      };
    }
    const validate = await argon2.verify(user.password, password);
    if (!validate) {
      return {
        error: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          return resolve(false);
        }
        return resolve(true);
      }),
    );
  }
}
