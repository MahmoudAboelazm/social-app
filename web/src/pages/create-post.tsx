import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import {
  FieldError,
  useCreatePostMutation,
  useMeQuery,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { userIsAuth } from "../utils/userIsAuth";

interface creatPostProps {}

const CreatePost: React.FC<creatPostProps> = ({}) => {
  userIsAuth();
  const router = useRouter();

  const [, createPost] = useCreatePostMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({ input: values });
          if (response.data?.createPost.post) {
            router.replace("/");
          } else {
            setErrors(
              toErrorMap(response.data?.createPost.error as [FieldError]),
            );
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />

            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
