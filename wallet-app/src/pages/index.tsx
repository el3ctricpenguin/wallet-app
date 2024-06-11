import Head from "next/head";
import NextLink from "next/link";
import { Config, useAccount, useConnect, useDisconnect } from "wagmi";
import { Decimal } from "decimal.js";
import { SEPOLIA_USDT } from "@/constants";
import { Box, Center, Heading, Link } from "@chakra-ui/react";

import Account from "../components/Account";
import Balance from "../components/Balance";
import Chain from "../components/Chain";
import { useState } from "react";

export default function WalletApp() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor, setBgColor] = useState("gray.400");
    if (isConnected) {
        return (
            <>
                <Head>
                    <title>wallet-app</title>
                </Head>
                <Center w="100%" h="100%" bgColor={bgColor} position="fixed" top={0} left={0}>
                    <Box as="main" w={1000}>
                        <Heading as="h2" size="2xl">
                            wallet-app
                        </Heading>
                        <Heading as="h3" size="lg">
                            Account:
                        </Heading>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                        <Heading as="h3" size="lg">
                            Chain:
                        </Heading>
                        <Chain chain={chain} />
                        <Heading as="h3" size="lg">
                            Balances:
                        </Heading>
                        <Balance address={address} tokenAddress={undefined} />
                        <Balance address={address} tokenAddress={SEPOLIA_USDT} />
                    </Box>
                </Center>
            </>
        );
    } else {
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
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                    </Box>
                </Center>
            </>
        );
    }
}
