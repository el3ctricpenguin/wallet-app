import { extendTheme } from "@chakra-ui/react";
import { defineStyleConfig } from "@chakra-ui/react";

const heading = defineStyleConfig({
    baseStyle: { fontFamily: "monospace" },
});

export const theme = extendTheme({
    styles: {
        global: {
            body: { color: "white", fontFamily: "monospace", fontSize: "xl" },
        },
        components: {
            Heading: heading,
        },
    },
});
