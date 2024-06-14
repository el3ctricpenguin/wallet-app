import { Box, Center, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function WalletWrapper({ bgColor, children }: { bgColor: string; children: React.ReactNode }): JSX.Element {
    return (
        <>
            <Head>
                <title>&lt;WalletApp&gt;</title>
            </Head>
            <Center w="100%" h="100%" bgColor={bgColor} position="fixed" top={0} left={0}>
                <Box as="main" w={800}>
                    <Heading as="h2" size="2xl" fontFamily={"monospace"}>
                        &lt;WalletApp&gt;
                    </Heading>
                    {children}
                </Box>
            </Center>
        </>
    );
}
