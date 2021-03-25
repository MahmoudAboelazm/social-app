import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { route } from "next/dist/next-server/server/router";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Wrapper } from "../../../components/Wrapper";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";

interface PostProps {
  id: number;
}

const PostEdit: NextPage<PostProps> = ({ id }) => {
  const [{ data, fetching }] = usePostQuery({
    variables: {
      id,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      {fetching ? (
        <div>Loading...</div>
      ) : (
        <Formik
          initialValues={{
            title: data?.post?.title as string,
            text: data?.post?.text as string,
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await updatePost({
              id,
              title: values.title,
              text: values.text,
            });
            if (data?.updatePost) {
              router.push("/");
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
                  label="Text"
                />
              </Box>

              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Update
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

PostEdit.getInitialProps = ({ query }) => {
  return {
    id: parseInt(query.id as any),
  };
};
export default withUrqlClient(createUrqlClient, { ssr: false })(
  PostEdit as any,
);
