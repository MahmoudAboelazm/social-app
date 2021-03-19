import { Box, Button, Flex } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useResetPasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import Link from "next/link";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, resetPassword] = useResetPasswordMutation();
  const [tokenExpired, settokenExpired] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await resetPassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.resetPassord.error) {
            if (
              response.data.resetPassord.error[0].message.includes("expired")
            ) {
              return settokenExpired(true);
            }
            setErrors(toErrorMap(response.data.resetPassord.error));
          } else if (response.data?.resetPassord.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenExpired && (
              <Flex>
                <Box style={{ color: "red" }} mr={4}>
                  Token expired
                </Box>
                <Link href="/reset-password">get a new one</Link>
              </Flex>
            )}

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Reset the password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);
