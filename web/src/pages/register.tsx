import React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { userIsAuth } from "../utils/userIsAuth";
import LoginByGoogle from "../components/LoginByGoogle";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  userIsAuth();
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.error) {
            setErrors(toErrorMap(response.data.register.error));
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <LoginByGoogle />
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
