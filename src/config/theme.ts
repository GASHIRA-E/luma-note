import { defineConfig, createSystem } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        background: {
          value: "light-dark(#f6f6f6, #2f2f2f)",
          description: "背景色"
        },
      },
    },
  },
});

export default createSystem(config);
