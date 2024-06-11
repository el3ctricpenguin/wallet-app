import Head from "next/head";
import NextLink from "next/link";
import { Config, useAccount, useConnect, useDisconnect } from "wagmi";
import { Decimal } from "decimal.js";
import { SEPOLIA_USDT } from "@/constants";
import { Box, extendTheme, Heading, Link } from "@chakra-ui/react";

import Account from "../components/Account";
import Balance from "../components/Balance";
import Chain from "../components/Chain";

export default function WalletApp() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const theme = extendTheme({
        // background: blue,
    });
    return (
        <Box bgColor="gray.400" color="white">
            <Head>
                <title>wallet-app</title>
            </Head>
            <main>
                <Heading as="h2" size="2xl">
                    wallet-app
                </Heading>
                <Heading as="h3" size="lg">
                    Account:
                </Heading>
                <Account isConnected={isConnected} connectors={connectors} address={address} connect={connect} disconnect={disconnect} />
                <Heading as="h3" size="lg">
                    Chain:
                </Heading>
                <Chain chain={chain} />
                <Heading as="h3" size="lg">
                    Balances:
                </Heading>
                <Balance address={address} tokenAddress={undefined} />
                <Balance address={address} tokenAddress={SEPOLIA_USDT} />
            </main>
        </Box>
    );
}
