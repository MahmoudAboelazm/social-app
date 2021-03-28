import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostsQuery, useVoteMutation } from "../generated/graphql";
import { userIsAuth } from "../utils/userIsAuth";

interface VoteSectionProps {
  post: PostsQuery["posts"]["posts"][0];
}
const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  const [loadingStatus, setLoadingStatus] = useState<
    "updootLoading" | "downdootLoading" | "notLoading"
  >("notLoading");

  const [{ stale, operation }, vote] = useVoteMutation();
  return (
    <>
      <Box mr={4} textAlign="center">
        <IconButton
          colorScheme={post.voteStatus === 1 ? "green" : undefined}
          aria-label="updoot"
          icon={<ChevronUpIcon />}
          onClick={async () => {
            setLoadingStatus("updootLoading");
            await vote({ postId: post.id, value: 1 });
            setLoadingStatus("notLoading");
          }}
          isLoading={loadingStatus == "updootLoading"}
        />
        <Text>{post.points}</Text>
        <IconButton
          colorScheme={post.voteStatus === -1 ? "red" : undefined}
          aria-label="downdoot"
          icon={<ChevronDownIcon />}
          onClick={async () => {
            setLoadingStatus("downdootLoading");
            await vote({ postId: post.id, value: -1 });
            setLoadingStatus("notLoading");
          }}
          isLoading={loadingStatus == "downdootLoading"}
        />
      </Box>
    </>
  );
};

export default VoteSection;
