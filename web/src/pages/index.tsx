import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import EditDeletePost from "../components/EditDeletePost";
import VoteSection from "../components/VoteSection";
import { Wrapper } from "../components/Wrapper";
import { PostsQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setvariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });

  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });
  return (
    <>
      <Wrapper>
        <Link>
          <NextLink href="/create-post">Create Post</NextLink>
        </Link>
        <br />
        {fetching && !data ? (
          "Loading..."
        ) : !data && !fetching ? (
          "There an error in the server"
        ) : (
          <>
            <Stack spacing={8}>
              {data!.posts.posts.map((post) => {
                return !post ? null : (
                  <Box p={5} shadow="md" borderWidth="1px">
                    <Flex>
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
                        <Text> Posted By: {post.creator.username}</Text>
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
