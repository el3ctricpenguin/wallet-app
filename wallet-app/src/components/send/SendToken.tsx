import { Heading } from "@chakra-ui/react";
import { isAddress, formatUnits, erc20Abi, type Address } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { WalletWrapper, Chain, Account, TokenBalance } from "@/components/common";
import { BackToTopLink, SendForm, TxResult, ErrorCard } from "@/components/send";
import { type TokenInfo } from "@/types";
import { sendTx } from "@/functions";
import { useTranslation } from "next-i18next";

export default function SendToken({ routerQuery, bgColor }: { routerQuery: string | string[] | undefined; bgColor: string }): JSX.Element {
    const { t } = useTranslation("common");

    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { data: tokenHash, isPending: isTokenPending, writeContract } = useWriteContract();
    const { isLoading: isTokenConfirming, isSuccess: isTokenConfirmed } = useWaitForTransactionReceipt({
        hash: tokenHash,
    });

    const tokenAddress = routerQuery as Address;
    if (isAddress(tokenAddress)) {
        const { data: balance } = useBalance({ address, token: tokenAddress });
        const tokenSymbol = balance?.symbol;
        const tokenBalance = balance != null ? formatUnits(balance.value, balance.decimals) : "-";
        const decimals = Number(
            useReadContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "decimals",
            }).data
        );
        const tokenInfo: TokenInfo = {
            address: tokenAddress,
            decimals,
        };
        return (
            <>
                <WalletWrapper bgColor={bgColor}>
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
                    <Heading size="lg" mt={2} mb={1}>
                        {/* {t.LOCALE === "en" ? `Send ${tokenSymbol}:` : `${tokenSymbol}の送信:`} */}
                    </Heading>
                    <TokenBalance address={address} tokenAddress={tokenAddress} isHoverEffectEnabled={false} />
                    <SendForm
                        sendTxFunc={(e) => {
                            sendTx(e, writeContract, undefined, tokenInfo);
                        }}
                        tokenName={tokenSymbol}
                        accountBalance={tokenBalance}
                        bgColor={bgColor}
                    />
                    <TxResult
                        isPending={isTokenPending}
                        isConfirming={isTokenConfirming}
                        isConfirmed={isTokenConfirmed}
                        hash={tokenHash}
                        explorerUrl={chain?.blockExplorers?.default.url}
                    />
                    <BackToTopLink />
                </WalletWrapper>
            </>
        );
    } else {
        const errorContent = `Invalid Token Address Format: ${routerQuery?.toString()}`;
        return (
            <WalletWrapper bgColor={bgColor}>
                <ErrorCard>{errorContent}</ErrorCard>
                <BackToTopLink />
            </WalletWrapper>
        );
    }
}
