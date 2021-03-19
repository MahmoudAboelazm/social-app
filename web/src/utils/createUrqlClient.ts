import {
  Cache,
  cacheExchange,
  QueryInput,
  Resolver,
} from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";

import { filter, pipe, tap } from "wonka";
import { Exchange } from "urql";
import Router from "next/router";
import isServer from "./isServer";
import { gql } from "@urql/core";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    }),
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCach = cache.resolve(entityKey, fieldKey);
    info.partial = !isItInTheCach;

    const result: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      result.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: result,
    };
  };
};

function updateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query,
) {
  cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie: any;
  if (isServer()) {
    if (ctx) cookie = ctx.req.headers.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: { cookie },
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;

              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    voteStatus
                    points
                  }
                `,
                { id: postId },
              );

              if (data) {
                const newVoteStatus = data.voteStatus === value ? null : value;
                const newPoints =
                  data.voteStatus === null
                    ? value + data.points
                    : data.voteStatus === value
                    ? data.points - value
                    : 2 * value + data.points;

                cache.writeFragment(
                  gql`
                    fragment _ on Post {
                      id
                      points
                      voteStatus
                    }
                  `,
                  {
                    id: postId,
                    points: newPoints,
                    voteStatus: newVoteStatus,
                  },
                );
              }
            },
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).postId,
              });
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts",
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });
            },

            login: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts",
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });
              updateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.error) {
                    return query;
                  } else {
                    return { me: result.login.user };
                  }
                },
              );
            },

            register: (_result, args, cache, info) => {
              updateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.error) {
                    return query;
                  } else {
                    return { me: result.register.user };
                  }
                },
              );
            },
            logout: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts",
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });

              updateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => {
                  return { me: null };
                },
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
