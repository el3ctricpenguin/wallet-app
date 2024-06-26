import { Heading } from "@chakra-ui/react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

import { WalletWrapper, Chain, Account, ETHBalance } from "@/components/common";
import { BackToTopLink, SendForm, TxResult } from "@/components/send";
import { sendTx } from "@/functions";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function SendETH({ nativeToken, bgColor }: { nativeToken: string; bgColor: string }): JSX.Element {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { locale } = router;

    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { data: ethHash, isPending: isEthPending, sendTransaction } = useSendTransaction();
    const { isLoading: isEthConfirming, isSuccess: isEthConfirmed } = useWaitForTransactionReceipt({
        hash: ethHash,
    });
    const { data: balance } = useBalance({ address });
    const ethBalance = balance != null ? formatUnits(balance.value, balance.decimals) : "-";
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
                <Account isConnected={isConnected} connectors={connectors} address={address} connect={connect} disconnect={disconnect} />
                <Heading size="lg" mt={2} mb={1}>
                    {locale === "en" ? `Send ${nativeToken}:` : `${nativeToken}の送信:`}
                </Heading>
                <ETHBalance address={address} isHoverEffectEnabled={false} />
                <SendForm
                    sendTxFunc={(e) => {
                        sendTx(e, undefined, sendTransaction);
                    }}
                    tokenName={nativeToken}
                    accountBalance={ethBalance}
                    bgColor={bgColor}
                />
                <TxResult
                    isPending={isEthPending}
                    isConfirming={isEthConfirming}
                    isConfirmed={isEthConfirmed}
                    hash={ethHash}
                    explorerUrl={chain?.blockExplorers?.default.url}
                />
                <BackToTopLink />
            </WalletWrapper>
        </>
    );
}
