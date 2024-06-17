import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import { WagmiProvider } from "wagmi";
import { config } from "@/wagmi";
import { theme } from "@/theme";
import { type ReactElement } from "react";
import useLocale, { tContext } from "@/functions/useLocale";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps): ReactElement {
    const { t } = useLocale();
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider theme={theme}>
                    <tContext.Provider value={t}>
                        <Component {...pageProps} />
                    </tContext.Provider>
                </ChakraProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
