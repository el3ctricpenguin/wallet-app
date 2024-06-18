import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";

import { WagmiProvider } from "wagmi";
import { config } from "@/wagmi";
import { theme } from "@/theme";

const queryClient = new QueryClient();

export const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default appWithTranslation(App);
