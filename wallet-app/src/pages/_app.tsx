import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { WagmiProvider } from "wagmi";
import { config } from "../wagmi";
import { theme } from "@/components/theme";
import type { ReactElement } from "react";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): ReactElement {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
