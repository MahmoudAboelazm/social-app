import {
  ChevronDownIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import {
  useMeQuery,
  useLogoutMutation,
  useSendCookieQuery,
} from "../generated/graphql";
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
        <Menu>
          <MenuButton
            colorScheme="blue"
            as={IconButton}
            aria-label="Options"
            icon={<ChevronDownIcon />}
          />
          <MenuList>
            <MenuItem>{data.me.username}</MenuItem>
            <NextLink href="/create-post">
              <MenuItem>Create Post</MenuItem>
            </NextLink>

            <MenuItem>
              <Button onClick={() => logout()}>Logout</Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    );
  }
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      bg={"#161b22"}
      p={4}
      position="fixed"
      top="0"
      width="100%"
      zIndex={2}
      h={16}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <HStack spacing={8} alignItems={"center"}>
        <Box>
          <NextLink href="/">
            <Heading cursor="pointer" as="h2" size="lg" color="white">
              SocialApp
            </Heading>
          </NextLink>
        </Box>
      </HStack>
      <Box ml={"auto"}>
        <IconButton
          aria-label="color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          mr={4}
          onClick={toggleColorMode}
        />
        {body}
      </Box>
    </Flex>
  );
};

export default NavBar;
