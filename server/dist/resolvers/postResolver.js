"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_1 = require("../entities/Post");
const Updoot_1 = require("../entities/Updoot");
const isAuth_1 = require("../middleware/isAuth");
let PostInput = class PostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    type_graphql_1.InputType()
], PostInput);
let FieldPostError = class FieldPostError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldPostError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldPostError.prototype, "message", void 0);
FieldPostError = __decorate([
    type_graphql_1.ObjectType()
], FieldPostError);
let PostResponse = class PostResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldPostError], { nullable: true }),
    __metadata("design:type", Array)
], PostResponse.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    type_graphql_1.ObjectType()
], PostResponse);
let PaginatedPosts = class PaginatedPosts {
};
__decorate([
    type_graphql_1.Field(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPosts.prototype, "posts", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedPosts.prototype, "hasMore", void 0);
PaginatedPosts = __decorate([
    type_graphql_1.ObjectType()
], PaginatedPosts);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 50);
    }
    createPost(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const post = yield Post_1.Post.create(Object.assign(Object.assign({}, input), { creatorId: req.session.userId })).save();
            return { post };
        });
    }
    deletePost(postId) {
        Post_1.Post.delete({ id: postId });
        return true;
    }
    vote(value, postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdoot = value !== -1;
            const realValue = isUpdoot ? 1 : -1;
            const { userId } = req.session;
            const updoot = yield Updoot_1.Updoot.findOne({ where: { postId, userId } });
            if (updoot && updoot.value !== realValue) {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
       update updoot 
       set value = ${realValue}
       where "postId" = ${postId} and "userId" = ${userId};
        `);
                    yield tm.query(`
       update post 
       set points = points + ${realValue * 2}
       where id = ${postId}
        `);
                }));
            }
            else if (updoot && updoot.value === realValue) {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`
        delete from updoot where "postId" = ${postId} and "userId" = ${userId}
        `);
                    yield tm.query(`
       update post 
       set points = points - ${realValue}
       where id = ${postId}
        `);
                }));
            }
            else {
                yield typeorm_1.getConnection().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`insert into updoot("userId", "postId", value)
          values (${userId}, ${postId}, ${realValue});
          
          `);
                    yield tm.query(`
          update post 
          set points = points + ${realValue}
          where post.id = ${postId};
     `);
                }));
            }
            return true;
        });
    }
    posts(limit, cursor, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const realLimit = Math.min(50, limit);
            const realLimitPlusOne = realLimit + 1;
            const replacements = [realLimitPlusOne];
            if (req.session.userId) {
                replacements.push(req.session.userId);
            }
            let cursorIndx;
            if (cursor) {
                replacements.push(new Date(parseInt(cursor)));
                cursorIndx = replacements.length;
            }
            const posts = yield typeorm_1.getConnection().query(`
      select p.*,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
      ) creator
      ${req.session.userId
                ? ',(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"'
                : ',null as "voteStatus"'}
      from post p
      
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? `where p."createdAt" < $${cursorIndx}` : ""}
      order by p."createdAt" DESC
      limit $1

      `, replacements);
            return {
                posts: posts.slice(0, realLimit),
                hasMore: posts.length > realLimit,
            };
        });
    }
    post(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return undefined;
            }
            const vote = yield Updoot_1.Updoot.findOne({
                postId: id,
                userId: req.session.userId,
            });
            if (vote)
                post.voteStatus = vote.value;
            return post;
        });
    }
    updatePost(id, title, text, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return null;
            }
            if (post.creatorId == req.session.userId) {
                if (typeof title !== undefined && typeof text !== undefined) {
                    post.title = title;
                    yield Post_1.Post.update({ id }, { title, text });
                    post.text = text;
                    post.title = title;
                }
            }
            const vote = yield Updoot_1.Updoot.findOne({
                postId: id,
                userId: req.session.userId,
            });
            if (vote)
                post.voteStatus = vote.value;
            return post;
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    type_graphql_1.Mutation(() => PostResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "deletePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("value", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("postId", () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    type_graphql_1.Query(() => PaginatedPosts),
    __param(0, type_graphql_1.Arg("limit", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("cursor", () => String, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("title", () => String)),
    __param(2, type_graphql_1.Arg("text", () => String)),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String,
        String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=postResolver.js.map