import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import EditDeletePost from "../components/EditDeletePost";
import LoginByGoogle from "../components/LoginByGoogle";
import VoteSection from "../components/VoteSection";
import { Wrapper } from "../components/Wrapper";
import {
  PostsQuery,
  usePostsQuery,
  useSendCookieQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import isServer from "../utils/isServer";
import cookieToURL from "../utils/sendCookie";

const Index = () => {
  const [variables, setvariables] = useState({
    limit: 4,
    cursor: null as null | string,
  });

  // Assign cookie to another URL if you aren't on the server domain
  const [{ data: cookiedata }] = useSendCookieQuery({
    pause: isServer(),
  });
  cookieToURL(cookiedata);

  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });

  return (
    <>
      <Wrapper>
        {fetching && !data ? (
          "Loading..."
        ) : !data && !fetching ? (
          "There an error in the server"
        ) : (
          <>
            <Stack spacing={8}>
              {data!.posts.posts.map((post) => {
                return !post ? null : (
                  <Box p={5} shadow="md" borderWidth="1px" key={post.id}>
                    <Flex wordBreak="break-all">
                      <VoteSection post={post} />
                      <Box width="100%">
                        <Heading fontSize="xl">
                          <Link>
                            <NextLink
                              href="/post/post-details/[id]"
                              as={"/post/post-details/" + post.id}
                            >
                              {post.title}
                            </NextLink>
                          </Link>
                        </Heading>
                        <Text>
                          Posted By:{" "}
                          <Link>
                            <NextLink
                              href="/user/[userName]"
                              as={"/user/" + post.creator.username}
                            >
                              {post.creator.username}
                            </NextLink>
                          </Link>
                        </Text>
                        <Text mt={4}>{post.textSnippet}</Text>
                        <EditDeletePost post={post} />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>
            {data?.posts.hasMore && (
              <Flex>
                <Button
                  onClick={() => {
                    setvariables({
                      limit: variables.limit,
                      cursor: data!.posts.posts[data!.posts.posts.length - 1]
                        .createdAt,
                    });
                  }}
                  m="auto"
                  my={8}
                  isLoading={stale}
                >
                  Load more
                </Button>
              </Flex>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
