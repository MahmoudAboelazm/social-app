import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import isServer from "../utils/isServer";

interface editProps {
  post: PostsQuery["posts"]["posts"][0];
}

const EditDeletePost: React.FC<editProps> = ({ post }) => {
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });

  const [, deletePost] = useDeletePostMutation();
  const router = useRouter();
  const handleDelete = async () => {
    const { data } = await deletePost({ postId: post.id });
    data?.deletePost ? router.push("/") : "";
  };

  return (
    <>
      {data?.me?.id == post.creatorId ? (
        <Flex justifyContent="flex-end">
          <Link>
            <NextLink
              href="/post/post-edit/[id]"
              as={"/post/post-edit/" + post.id}
            >
              <IconButton
                size="sm"
                icon={<EditIcon />}
                aria-label="edit-icon"
              />
            </NextLink>
          </Link>
          <IconButton
            size="sm"
            icon={<DeleteIcon />}
            aria-label="delete-icon"
            onClick={handleDelete}
            ml={2}
          />
        </Flex>
      ) : (
        ""
      )}
    </>
  );
};

export default EditDeletePost;
