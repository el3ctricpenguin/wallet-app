import { useRouter } from "next/router";
import NextLink from "next/link";
import { useState } from "react";
import { useAccount, useBalance, useConnect, useDisconnect, useReadContract } from "wagmi";
import { Alert, AlertIcon, border, Box, Button, Center, Heading, Input, InputGroup, InputRightAddon, Link, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { erc20Abi, formatUnits, getAddress, isAddress } from "viem";

import Account from "../../components/Account";
import Balance from "../../components/Balance";
import Chain from "../../components/Chain";
import { getNativeTokenName } from "@/constants";
import WalletWrapper from "@/components/WalletWrapper";

function BackToTopLink() {
    return (
        <Link as={NextLink} href="/" textDecoration="underline" _hover={{ fontStyle: "italic" }}>
            Back to balances
            <ChevronLeftIcon />
        </Link>
    );
}

function ErrorCard({ children }: { children: React.ReactNode }) {
    return (
        <Alert status="error" variant="solid" my={4} boxShadow="0px 0px 10px #00000077">
            <AlertIcon />
            {children}
        </Alert>
    );
}

export default function Send() {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    // const [bgColor, setBgColor] = useState("gray.400");
    const [bgColor, setBgColor] = useState("red.400");

    const router = useRouter();

    const routerQuery = router.query.tokenAddress;
    const nativeToken = getNativeTokenName(chain?.name);
    const isETH = routerQuery == nativeToken;
    let tokenAddress: `0x${string}` | null;

    if (isETH) {
    } else {
        let errorContent: string;
        if (typeof routerQuery == "string") {
            if (isAddress(routerQuery)) {
                tokenAddress = getAddress(routerQuery);
                const { data: balance, isError, isLoading } = useBalance({ address: address, token: tokenAddress });
                const nameResult = useReadContract({
                    address: tokenAddress,
                    abi: erc20Abi,
                    functionName: "name",
                });
                const tokenName = nameResult.data;
                const tokenSymbol = balance?.symbol;
                const tokenBalance = balance ? formatUnits(balance.value, balance.decimals) : "-";
                return (
                    <>
                        <WalletWrapper bgColor={bgColor}>
                            <Text size="xl" mt={2}>
                                Network:
                            </Text>
                            <Chain chain={chain} />
                            <Text size="xl" mt={2}>
                                Account:
                            </Text>
                            <Account
                                isConnected={isConnected}
                                connectors={connectors}
                                address={address}
                                connect={connect}
                                disconnect={disconnect}
                            />
                            <Text size="xl" mt={2}>
                                Send {tokenName}:
                            </Text>
                            <Balance address={address} tokenAddress={tokenAddress} />
                            <InputGroup>
                                <Input
                                    width={300}
                                    height={16}
                                    fontSize={36}
                                    placeholder="0.0"
                                    borderColor="white"
                                    borderRadius={0}
                                    borderWidth={4}
                                    _placeholder={{ color: "whiteAlpha.500" }}
                                    _hover={{ borderColor: "white" }}
                                    _active={{ borderColor: "white", boxShadow: "none" }}
                                    _focusVisible={{ borderColor: "white", boxShadow: "none" }}
                                />
                                <InputRightAddon bgColor="transparent" border="none" h="auto">
                                    <Text fontSize={40}>{tokenSymbol}</Text>
                                </InputRightAddon>
                            </InputGroup>
                            <InputGroup size="md" my={3}>
                                <Input
                                    placeholder="0x..."
                                    borderColor="white"
                                    borderWidth={4}
                                    borderRadius={0}
                                    _placeholder={{ color: "whiteAlpha.500" }}
                                    _hover={{ borderColor: "white" }}
                                    _active={{ borderColor: "white", boxShadow: "none" }}
                                    _focusVisible={{ borderColor: "white", boxShadow: "none" }}
                                />
                                <InputRightAddon borderRadius={0} p={0}>
                                    <Button
                                        color="white"
                                        bgColor={bgColor}
                                        borderWidth={4}
                                        borderLeftWidth={0}
                                        borderRadius={0}
                                        borderColor="white"
                                        _hover={{ color: bgColor, bgColor: "white", borderColor: "white" }}
                                    >
                                        Send
                                    </Button>
                                </InputRightAddon>
                            </InputGroup>

                            <Balance address={address} tokenAddress={tokenAddress}></Balance>
                            <BackToTopLink />
                        </WalletWrapper>
                    </>
                );
            } else {
                errorContent = `Invalid Token Address Format: ${routerQuery}`;
            }
        } else {
            errorContent = `Invalid Query Type: ${routerQuery} (${typeof routerQuery})`;
        }
        return (
            <>
                <ErrorCard>{errorContent}</ErrorCard>
                <BackToTopLink />
            </>
        );
    }
}
