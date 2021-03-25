import React from "react";

import { Box } from "@chakra-ui/react";
import NavBar from "./NavBar";

interface WrapperProps {
  variant?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <>
      <NavBar />

      <Box
        mt="100px"
        mx="auto"
        w="100%"
        maxW={variant === "regular" ? "800px" : "400px"}
      >
        {children}
      </Box>
    </>
  );
};
