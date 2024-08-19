// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";

import * as button from "./button";
import textStyles from "./textStyles";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  button,
  textStyles,
  colors: {
    brand: {
      bg: "#252528",
      active: "#2b3341",
    },
  },
});
