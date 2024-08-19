import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const md = defineStyle({
  fontSize: "xs",
});

export const buttonTheme = defineStyleConfig({
  sizes: { md },
});
