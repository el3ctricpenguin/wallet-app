import { tContext } from "@/functions/useLocale";
import { Heading } from "@chakra-ui/react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

import { WalletWrapper, Chain, Account, Balance } from "../common";
import BackToTopLink from "./BackToTopLink";
import SendForm from "./SendForm";
import TxResult from "./TxResult";
import { useContext } from "react";
import { sendTx } from "@/functions";

export default function SendETH({ nativeToken, bgColor }: { nativeToken: string; bgColor: string }): JSX.Element {
    const t = useContext(tContext);

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
                <tContext.Provider value={t}>
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
                    <Heading size="lg" mt={2} mb={1}>
                        {t.LOCALE === "en" ? `Send ${nativeToken}:` : `${nativeToken}の送信:`}
                    </Heading>
                    <Balance address={address} tokenAddress={undefined} isHoverEffectEnabled={false} />
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
                </tContext.Provider>
            </WalletWrapper>
        </>
    );
}
