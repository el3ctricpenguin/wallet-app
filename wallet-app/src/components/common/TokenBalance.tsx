import { Flex, Box, Image } from "@chakra-ui/react";

import { type ReactElement } from "react";
import { type Address, erc20Abi, formatUnits } from "viem";
import { useBalance, useReadContract } from "wagmi";

export default function Balance({
    address,
    tokenAddress = undefined,
    isHoverEffectEnabled = false,
}: {
    address: Address | undefined;
    tokenAddress: Address | undefined;
    isHoverEffectEnabled: boolean;
}): ReactElement {
    const { data } = useBalance({ address, token: tokenAddress });

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
            <Flex padding={3} border="2px solid white" _hover={isHoverEffectEnabled ? { bgColor: "whiteAlpha.500" } : ""}>
                <Image boxSize="60px" objectFit="contain" src="/img/token_tether.svg" alt="USDT"></Image>
                <Box ml={4}>
                    {tokenName}
                    <br />
                    {tokenBalance} {tokenSymbol}
                </Box>
            </Flex>
        </>
    );
}
