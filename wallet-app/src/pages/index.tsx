import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { SEPOLIA_USDT, getNativeTokenName } from "@/constants";
import { Divider, Heading, Text } from "@chakra-ui/react";

import Account from "@/components/Account";
import Balance from "@/components/Balance";
import Chain from "../components/Chain";
import { type ReactElement, useState } from "react";
import WalletWrapper from "@/components/WalletWrapper";

export default function WalletApp(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor, setBgColor] = useState("gray.400");
    const nativeToken = getNativeTokenName(chain?.name);
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                {isConnected ? (
                    <>
                        <Heading size="lg" mt={2}>
                            Network:
                        </Heading>
                        <Chain chain={chain} />
                        <Heading size="lg" mt={2}>
                            Account:
                        </Heading>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                        <Heading size="lg" mt={2}>
                            Balances:
                        </Heading>
                        <NextLink href={"/send/" + nativeToken}>
                            <Balance address={address} tokenAddress={undefined} isHoverEffectEnabled={true} />
                        </NextLink>
                        <Divider borderColor={bgColor} borderWidth={2} />
                        <NextLink href={"/send/" + SEPOLIA_USDT}>
                            <Balance address={address} tokenAddress={SEPOLIA_USDT} isHoverEffectEnabled={true} />
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
