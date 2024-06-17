import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { type ReactElement, useContext, useState } from "react";
import { Divider, Heading } from "@chakra-ui/react";

import { Account, Chain, ETHBalance, TokenBalance, WalletWrapper } from "@/components/common";
import { tContext } from "@/functions/useLocale";
import { getNativeTokenName, getUSDTAddress } from "@/constants";

export default function WalletApp(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor] = useState("gray.400");
    const nativeToken = getNativeTokenName(chain?.name);
    const USDTAddress = getUSDTAddress(chain?.name);
    const t = useContext(tContext);
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                {isConnected ? (
                    <>
                        <Heading size="lg" mt={2}>
                            {t.NETWORK}:
                        </Heading>
                        <Chain chain={chain} />
                        <Heading size="lg" mt={2}>
                            {t.ACCOUNT}:
                        </Heading>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                        <Heading size="lg" mt={2}>
                            {t.BALANCE}:
                        </Heading>
                        <NextLink href={"/send/" + nativeToken}>
                            <ETHBalance address={address} isHoverEffectEnabled={true} />
                        </NextLink>
                        <Divider borderColor={bgColor} borderWidth={4} />
                        <NextLink href={"/send/" + USDTAddress}>
                            <TokenBalance address={address} tokenAddress={USDTAddress} isHoverEffectEnabled={true} />
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
