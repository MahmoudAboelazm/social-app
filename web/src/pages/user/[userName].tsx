import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditDeletePost from "../../components/EditDeletePost";
import VoteSection from "../../components/VoteSection";
import { Wrapper } from "../../components/Wrapper";
import {
  useSendCookieQuery,
  useUserProfileQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import isServer from "../../utils/isServer";
import NextLink from "next/link";
import cookieToURL from "../../utils/sendCookie";

interface PostProps {
  userName: string;
}

const UserProfile: NextPage<PostProps> = ({ userName }) => {
  const [{ data }] = useUserProfileQuery({
    variables: {
      username: userName,
    },
  });

  return (
    <Wrapper>
      {!data ? (
        "no user found "
      ) : (
        <div>
          <Heading as="h3" size="lg" textAlign="center" mb={4}>
            Posts By: {data.userProfile.user?.username}
          </Heading>
          {!data.userProfile.posts || data.userProfile.posts.length === 0 ? (
            "no posts yet"
          ) : (
            <Stack spacing={4}>
              {data.userProfile.posts.map((post) => (
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

                      <Text mt={4}>{post.textSnippet}</Text>
                      <EditDeletePost post={post} />
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}
        </div>
      )}
    </Wrapper>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return {
    userName: query.userName as any,
  };
};
export default withUrqlClient(createUrqlClient, { ssr: true })(
  UserProfile as any,
);
