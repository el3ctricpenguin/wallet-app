import { useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { type ReactElement } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
export default function Balance({
    address,
    tokenAddress = undefined,
    isHoverEffectEnabled = false,
}: {
    address: `0x${string}` | undefined;
    tokenAddress: `0x${string}` | undefined;
    isHoverEffectEnabled: boolean;
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
            <>
                <Flex
                    padding={3}
                    bgColor={isHoverEffectEnabled ? "whiteAlpha.300" : ""}
                    _hover={isHoverEffectEnabled ? { bgColor: "whiteAlpha.500" } : ""}
                >
                    <Image boxSize="60px" objectFit="contain" src="/img/token_tether.svg" alt="USDT"></Image>
                    <Box ml={4}>
                        {tokenName}
                        <br />
                        {tokenBalance} {tokenSymbol}
                    </Box>
                </Flex>
            </>
        );
    } else {
        const { data, isError, isLoading } = useBalance({ address });
        const tokenSymbol = data?.symbol;
        const tokenName = tokenSymbol === "MNT" ? "Mantle" : "Ethereum";
        const tokenBalance = data != null ? formatUnits(data.value, data.decimals) : "-";
        return (
            <>
                <Flex
                    padding={3}
                    bgColor={isHoverEffectEnabled ? "whiteAlpha.300" : ""}
                    _hover={isHoverEffectEnabled ? { bgColor: "whiteAlpha.500" } : ""}
                >
                    {tokenSymbol == "ETH" ? (
                        <Image boxSize="60px" objectFit="contain" src="/img/token_ethereum.svg" alt="ETH"></Image>
                    ) : (
                        <Image boxSize="60px" objectFit="contain" src="/img/token_mantle.svg" alt="MNT"></Image>
                    )}
                    <Box ml={4}>
                        {tokenName}
                        <br />
                        {tokenBalance} {tokenSymbol}
                    </Box>
                </Flex>
            </>
        );
    }
}
