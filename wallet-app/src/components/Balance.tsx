import { useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { type ReactElement } from "react";
export default function Balance({
    address,
    tokenAddress = undefined,
}: {
    address: `0x${string}` | undefined;
    tokenAddress: `0x${string}` | undefined;
}): ReactElement {
    if (tokenAddress != null) {
        const { data, isError, isLoading } = useBalance({ address, token: tokenAddress });

        const name = useReadContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "name",
        });
        const tokenName = name.data;
        const tokenSymbol = data?.symbol;
        const tokenBalance = data != null ? formatUnits(data.value, data.decimals) : "-";
        return (
            <div>
                {tokenName}: {tokenBalance} {tokenSymbol}
            </div>
        );
    } else {
        const { data, isError, isLoading } = useBalance({ address });
        const tokenSymbol = data?.symbol;
        const tokenName = tokenSymbol === "MNT" ? "Mantle" : "Ethereum";
        const tokenBalance = data != null ? formatUnits(data.value, data.decimals) : "-";
        return (
            <div>
                {tokenName}: {tokenBalance.toString()} {tokenSymbol}
            </div>
        );
    }
}
