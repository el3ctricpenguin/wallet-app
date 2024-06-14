import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { SEPOLIA_USDT, getNativeTokenName } from "@/constants";
import { Divider, Heading } from "@chakra-ui/react";

import Account from "@/components/Account";
import Balance from "@/components/Balance";
import Chain from "../components/Chain";
import { type ReactElement, useContext, useState } from "react";
import WalletWrapper from "@/components/WalletWrapper";
import { tContext } from "@/hooks/useLocale";

export default function WalletApp(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor] = useState("gray.400");
    const nativeToken = getNativeTokenName(chain?.name);
    const t = useContext(tContext);
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                {isConnected ? (
                    <>
                        <Heading size="lg" mt={2}>
                            {t.NETWORK}:
                        </Heading>
                        <Chain chain={chain} t={t} />
                        <Heading size="lg" mt={2}>
                            {t.ACCOUNT}:
                        </Heading>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                            t={t}
                        />
                        <Heading size="lg" mt={2}>
                            {t.BALANCE}:
                        </Heading>
                        <NextLink href={"/send/" + nativeToken}>
                            <Balance address={address} tokenAddress={undefined} isHoverEffectEnabled={true} />
                        </NextLink>
                        <Divider borderColor={bgColor} borderWidth={4} />
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
                            t={t}
                        />
                    </>
                )}
            </WalletWrapper>
        </>
    );
}
