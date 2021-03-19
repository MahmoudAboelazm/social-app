import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import isServer from "../utils/isServer";
interface navProps {}
const NavBar: React.FC<navProps> = ({}) => {
  const [, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body;
  if (fetching) {
    body = "Loading...";
  } else if (!data?.me) {
    body = (
      <>
        <Link mr={4}>
          <NextLink href="/login">Login</NextLink>
        </Link>
        <Link>
          <NextLink href="/register">Register</NextLink>
        </Link>
      </>
    );
  } else {
    body = (
      <>
        {data.me.username} <Button onClick={() => logout()}>Logout</Button>
      </>
    );
  }
  return (
    <Flex bg="tomato" p={4} position="fixed" top="0" width="100%" zIndex={2}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default NavBar;
