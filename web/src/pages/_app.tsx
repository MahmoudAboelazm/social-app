import { ColorModeProvider } from "@chakra-ui/color-mode";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";
import isServer from "../utils/isServer";

function MyApp({ Component, pageProps }: any) {
  let mode: any;
  if (!isServer()) {
    mode = localStorage.getItem("chakra-ui-color-mode");
  }
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: mode || "dark",
          useSystemColorMode: false,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
