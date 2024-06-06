import Head from "next/head";
import { useAccount, useBalance, useConnect, useDisconnect, useReadContract } from "wagmi";
import { Decimal } from "decimal.js";
import { erc20Abi, formatUnits } from "viem";
import { SEPOLIA_USDT } from "@/constants";

function Balance({ address, tokenAddress = undefined }: { address: `0x${string}` | undefined; tokenAddress: `0x${string}` | undefined }) {
    if (tokenAddress) {
        const { data, isError, isLoading } = useBalance({ address: address, token: tokenAddress });

        const name = useReadContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "name",
        });
        console.log(data);
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
        const tokenName = tokenSymbol == "ETH" ? "Ethereum" : "Mantle";
        const tokenBalance = data ? formatUnits(data.value, data.decimals) : "-";
        console.log(data);
        return (
            <div>
                {tokenName}: {tokenBalance.toString()} {tokenSymbol}
            </div>
        );
    }
}

export default function WalletApp() {
    const { isConnected, address } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    return (
        <>
            <Head>
                <title>wallet-app</title>
            </Head>
            <main>
                <h1>wallet-app</h1>
                <Balance address={address} tokenAddress={undefined} />
                <Balance address={address} tokenAddress={SEPOLIA_USDT} />
            </main>
        </>
    );
}
