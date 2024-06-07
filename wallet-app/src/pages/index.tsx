import Head from "next/head";
import { Config, Connector, useAccount, useBalance, useConnect, useDisconnect, useReadContract, useSwitchChain } from "wagmi";
import { Decimal } from "decimal.js";
import { erc20Abi, formatUnits } from "viem";
import { SEPOLIA_USDT } from "@/constants";
import { useMemo } from "react";

function Account({
    isConnected,
    connectors,
    address,
    connect,
    disconnect,
}: {
    isConnected: boolean;
    connectors: readonly Connector[];
    address: `0x${string}` | undefined;
    connect: any;
    disconnect: any;
}) {
    if (isConnected) {
        return (
            <>
                {address} (
                <a href="#" onClick={disconnect}>
                    Disconnect
                </a>
                )
            </>
        );
    } else {
        return (
            <>
                <a href="#" onClick={() => connect({ connector: connectors[0] })}>
                    Connect wallet
                </a>
            </>
        );
    }
}

function ChainSwitcher({ chain }: { chain: any }) {
    const { chains, data, status, switchChain } = useSwitchChain();

    if (status == "pending") {
        return (
            <select>
                <option>pending</option>
            </select>
        );
    } else {
        return (
            <select name="" id="" value={chain ? chain.id : ""} onChange={(e) => switchChain({ chainId: Number(e.target.value) })}>
                {chain ? null : (
                    <option disabled value="">
                        Unsupported Network
                    </option>
                )}
                {chains.map((chain) => (
                    <option value={chain.id}>{chain.name}</option>
                ))}
            </select>
        );
    }
}

function Chain({ chain }: { chain: any }) {
    return (
        <>
            Chain Name: {chain ? chain.name : "-"}
            <br />
            Chain Id: {chain ? chain.id : "-"}
            <br />
            <ChainSwitcher chain={chain} />
        </>
    );
}

function Balance({ address, tokenAddress = undefined }: { address: `0x${string}` | undefined; tokenAddress: `0x${string}` | undefined }) {
    if (tokenAddress) {
        const { data, isError, isLoading } = useBalance({ address: address, token: tokenAddress });

        const name = useReadContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "name",
        });
        const tokenName = name.data;
        const tokenSymbol = data?.symbol;
        const tokenBalance = data ? formatUnits(data.value, data.decimals) : "-";
        return (
            <div>
                {tokenName}: {tokenBalance} {tokenSymbol}
            </div>
        );
    } else {
        const { data, isError, isLoading } = useBalance({ address: address });
        const tokenSymbol = data?.symbol;
        const tokenName = tokenSymbol == "MNT" ? "Mantle" : "Ethereum";
        const tokenBalance = data ? formatUnits(data.value, data.decimals) : "-";
        return (
            <div>
                {tokenName}: {tokenBalance.toString()} {tokenSymbol}
            </div>
        );
    }
}

export default function WalletApp() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    return (
        <>
            <Head>
                <title>wallet-app</title>
            </Head>
            <main>
                <h1>wallet-app</h1>
                <h3>Account:</h3>
                <Account isConnected={isConnected} connectors={connectors} address={address} connect={connect} disconnect={disconnect} />
                <h3>Chain:</h3>
                <Chain chain={chain} />
                <h3>Balances:</h3>
                <Balance address={address} tokenAddress={undefined} />
                <Balance address={address} tokenAddress={SEPOLIA_USDT} />
            </main>
        </>
    );
}
