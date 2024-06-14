import { useRouter } from "next/router";
import { type ReactElement, useContext, useState } from "react";
import {
    type Config,
    useAccount,
    useBalance,
    useConnect,
    useDisconnect,
    useReadContract,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { erc20Abi, formatUnits, getAddress, isAddress, parseEther } from "viem";
import { Heading } from "@chakra-ui/react";
import { type SendTransactionMutate, type WriteContractMutate } from "wagmi/query";

import { getNativeTokenName } from "@/constants";
import { Account, Balance, Chain, WalletWrapper } from "@/components/common";
import { BackToTopLink, ErrorCard, SendForm, TxResult } from "@/components/send";
import { tContext } from "@/hooks/useLocale";
import { type FormSchemaType, type TokenInfo } from "@/types";

function sendTx(
    data: FormSchemaType,
    writeContract: WriteContractMutate<Config, unknown>,
    sendTransaction: SendTransactionMutate<Config, unknown>,
    tokenInfo: TokenInfo | undefined = undefined
): void {
    const to = data.address as `0x${string}`;
    const amount = data.amount;
    if (tokenInfo !== undefined) {
        writeContract({
            address: tokenInfo.address,
            abi: erc20Abi,
            functionName: "transfer",
            args: [to, BigInt(amount) * BigInt(10 ** tokenInfo.decimals)],
        });
    } else {
        sendTransaction({ to, value: parseEther(amount.toString()) });
    }
}

export default function Send(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { data: ethHash, isPending: isEthPending, sendTransaction } = useSendTransaction();
    const { isLoading: isEthConfirming, isSuccess: isEthConfirmed } = useWaitForTransactionReceipt({
        hash: ethHash,
    });

    const { data: tokenHash, isPending: isTokenPending, writeContract } = useWriteContract();
    const { isLoading: isTokenConfirming, isSuccess: isTokenConfirmed } = useWaitForTransactionReceipt({
        hash: tokenHash,
    });

    const [bgColor] = useState("red.400");
    const t = useContext(tContext);

    const router = useRouter();
    const routerQuery = router.query.tokenAddress;
    const nativeToken = getNativeTokenName(chain?.name);
    const isETH = routerQuery === nativeToken;
    let tokenAddress: `0x${string}` | null;

    if (isETH) {
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
                                sendTx(e, writeContract, sendTransaction);
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
    } else {
        let errorContent: string;
        if (typeof routerQuery === "string") {
            if (isAddress(routerQuery)) {
                tokenAddress = getAddress(routerQuery);
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
                                    {t.LOCALE === "en" ? `Send ${tokenSymbol}:` : `${tokenSymbol}の送信:`}
                                </Heading>
                                <Balance address={address} tokenAddress={tokenAddress} isHoverEffectEnabled={false} />
                                <SendForm
                                    sendTxFunc={(e) => {
                                        sendTx(e, writeContract, sendTransaction, tokenInfo);
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
                            </tContext.Provider>
                        </WalletWrapper>
                    </>
                );
            } else {
                errorContent = `Invalid Token Address Format: ${routerQuery}`;
            }
        } else {
            errorContent = `Invalid Query Type: ${routerQuery?.toString()} (${typeof routerQuery})`;
        }
        return (
            <WalletWrapper bgColor={bgColor}>
                <ErrorCard>{errorContent}</ErrorCard>
                <BackToTopLink />
            </WalletWrapper>
        );
    }
}
