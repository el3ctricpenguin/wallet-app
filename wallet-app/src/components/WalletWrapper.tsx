import { Box, Center, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function WalletWrapper({ bgColor, children }: { bgColor: string; children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>wallet-app</title>
            </Head>
            <Center w="100%" h="100%" bgColor={bgColor} position="fixed" top={0} left={0}>
                <Box as="main" w={1000}>
                    <Heading as="h2" size="2xl" fontFamily={"monospace"}>
                        wallet-app v1.0
                    </Heading>
                    {children}
                </Box>
            </Center>
        </>
    );
}
