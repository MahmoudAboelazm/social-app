import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import LoginByGoogle from "../components/LoginByGoogle";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation, useSendCookieQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { userIsAuth } from "../utils/userIsAuth";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  userIsAuth();
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);

          if (response.data?.login.error) {
            setErrors(toErrorMap(response.data.login.error));
          } else {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
              //console.log(router);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="usernameOrEmail"
              label="Username Or Email"
            />

            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex>
              <Box mt={2} ml={"auto"}>
                <Link href="/reset-password"> forgot password ?</Link>
              </Box>
            </Flex>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
      <LoginByGoogle />
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
