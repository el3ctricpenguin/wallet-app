import { useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
export default function Balance({
    address,
    tokenAddress = undefined,
}: {
    address: `0x${string}` | undefined;
    tokenAddress: `0x${string}` | undefined;
}) {
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
