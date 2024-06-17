import NextLink from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { type ReactElement, useState } from "react";
import { Divider, Heading } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Account, Chain, ETHBalance, TokenBalance, WalletWrapper } from "@/components/common";
import { getNativeTokenName, getUSDTAddress } from "@/constants";

export async function getStaticProps({ locale }: { locale: string }): Promise<any> {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            // Will be passed to the page component as props
        },
    };
}

export default function WalletApp(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [bgColor] = useState("gray.400");
    const nativeToken = getNativeTokenName(chain?.name);
    const USDTAddress = getUSDTAddress(chain?.name);

    const { t } = useTranslation("common");
    return (
        <>
            <WalletWrapper bgColor={bgColor}>
                {isConnected ? (
                    <>
                        <Heading size="lg" mt={2}>
                            {t("NETWORK")}:
                        </Heading>
                        <Chain chain={chain} />
                        <Heading size="lg" mt={2}>
                            {t("ACCOUNT")}:
                        </Heading>
                        <Account
                            isConnected={isConnected}
                            connectors={connectors}
                            address={address}
                            connect={connect}
                            disconnect={disconnect}
                        />
                        <Heading size="lg" mt={2}>
                            {t("BALANCE")}:
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
