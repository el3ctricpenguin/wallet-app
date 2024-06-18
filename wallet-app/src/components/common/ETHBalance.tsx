import { Flex, Box, Image } from "@chakra-ui/react";
import { type ReactElement } from "react";
import { type Address, formatUnits } from "viem";
import { useBalance } from "wagmi";

export default function Balance({
    address,
    isHoverEffectEnabled = false,
}: {
    address: Address | undefined;
    isHoverEffectEnabled: boolean;
}): ReactElement {
    const { data } = useBalance({ address });
    const tokenSymbol = data?.symbol;
    const tokenName = tokenSymbol === "MNT" ? "Mantle" : "Ethereum";
    const tokenBalance = data != null ? formatUnits(data.value, data.decimals) : "-";
    return (
        <>
            <Flex padding={3} border="2px solid white" _hover={isHoverEffectEnabled ? { bgColor: "whiteAlpha.500" } : ""}>
                {tokenSymbol === "ETH" ? (
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
