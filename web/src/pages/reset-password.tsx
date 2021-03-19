import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface resetProps {}

const resetPassword: React.FC<resetProps> = () => {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      {emailSent ? (
        <div>If this email exist we have sent a link to reset the Password</div>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await forgotPassword(values);
            if (response) {
              setEmailSent(true);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />

              <Button
                mt={4}
                type="submit"
                colorScheme="teal"
                isLoading={isSubmitting}
              >
                Send Email
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(resetPassword);
