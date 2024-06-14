import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    styles: {
        global: {
            body: { color: "white", fontFamily: "monospace", fontSize: "xl" },
        },
        config: {
            initialColorMode: "dark",
            useSystemColorMode: false,
        },
    },
    components: {
        Heading: { baseStyle: { fontFamily: "monospace" } },
        Input: {
            baseStyle: { borderColor: "white", borderWidth: 4, borderRadius: 0, _placeholder: { color: "whiteAlpha.500" } },
        },
    },
});
