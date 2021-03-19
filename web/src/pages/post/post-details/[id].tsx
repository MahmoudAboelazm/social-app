import { Box, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import EditDeletePost from "../../../components/EditDeletePost";
import { Wrapper } from "../../../components/Wrapper";
import { PostsQuery, usePostQuery } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

interface PostProps {
  id: number;
}

const PostInfo: NextPage<PostProps> = ({ id }) => {
  const [{ data, fetching }] = usePostQuery({
    variables: {
      id,
    },
  });

  return (
    <Wrapper>
      {fetching ? (
        <div>Loading...</div>
      ) : !data ? (
        "no posts found"
      ) : (
        <Box>
          <Heading>{data.post!.title}</Heading>
          <Text>{data.post!.text}</Text>
          <EditDeletePost
            post={data.post! as PostsQuery["posts"]["posts"][0]}
          />
        </Box>
      )}
    </Wrapper>
  );
};

PostInfo.getInitialProps = ({ query }) => {
  return {
    id: parseInt(query.id as any),
  };
};
export default withUrqlClient(createUrqlClient, { ssr: true })(PostInfo as any);
