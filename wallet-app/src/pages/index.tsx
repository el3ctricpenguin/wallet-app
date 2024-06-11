import Head from "next/head";
import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Decimal } from "decimal.js";
import { SEPOLIA_USDT } from "@/constants";
import { Box, Center, Heading, Text } from "@chakra-ui/react";

import Account from "../components/Account";
import Balance from "../components/Balance";
import Chain from "../components/Chain";
import { useState } from "react";
import WalletWrapper from "@/components/WalletWrapper";

export default function WalletApp() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor, setBgColor] = useState("gray.400");
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                {isConnected ? (
                    <Box as="main" w={1000}>
                        <Heading as="h2" size="2xl">
                            wallet-app
                        </Heading>
                        <Text size="xl" mt={2}>
                            Network:
                        </Text>
                        <Chain chain={chain} />
                        <Text size="xl" mt={2}>
                            Account:
                        </Text>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                        <Text size="xl" mt={2}>
                            Balances:
                        </Text>
                        <NextLink href="/send">
                            <Balance address={address} tokenAddress={undefined} />
                        </NextLink>
                        <NextLink href={"/send/" + SEPOLIA_USDT}>
                            <Balance address={address} tokenAddress={SEPOLIA_USDT} />
                        </NextLink>
                    </Box>
                ) : (
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
                )}
            </WalletWrapper>
        </>
    );
}
