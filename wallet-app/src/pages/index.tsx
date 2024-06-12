import Head from "next/head";
import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Decimal } from "decimal.js";
import { SEPOLIA_USDT, getNativeTokenName } from "@/constants";
import { Box, Center, Heading, Text } from "@chakra-ui/react";

import Account from "@/components/Account";
import Balance from "@/components/Balance";
import Chain from "../components/Chain";
import { useState } from "react";
import WalletWrapper from "@/components/WalletWrapper";

export default function WalletApp() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor, setBgColor] = useState("gray.400");
    const nativeToken = getNativeTokenName(chain?.name);
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                <Heading>0aaa</Heading>
                {isConnected ? (
                    <>
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
                        <NextLink href={"/send/" + nativeToken}>
                            <Balance address={address} tokenAddress={undefined} />
                        </NextLink>
                        <NextLink href={"/send/" + SEPOLIA_USDT}>
                            <Balance address={address} tokenAddress={SEPOLIA_USDT} />
                        </NextLink>
                    </>
                ) : (
                    <>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                    </>
                )}
            </WalletWrapper>
        </>
    );
}
