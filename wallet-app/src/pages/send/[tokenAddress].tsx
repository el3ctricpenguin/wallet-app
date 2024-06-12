import { useRouter } from "next/router";
import NextLink from "next/link";
import { FormEventHandler, type ReactElement, useEffect, useState } from "react";
import {
    useAccount,
    useBalance,
    useConnect,
    useDisconnect,
    useReadContract,
    useSendTransaction,
    useWaitForTransactionReceipt,
} from "wagmi";
import { Alert, AlertIcon, Button, Flex, Heading, Input, InputGroup, InputRightAddon, Link, Spinner, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { erc20Abi, formatUnits, getAddress, isAddress, parseEther } from "viem";

import Account from "../../components/Account";
import Balance from "../../components/Balance";
import Chain from "../../components/Chain";
import { getNativeTokenName } from "@/constants";
import WalletWrapper from "@/components/WalletWrapper";

function BackToTopLink(): ReactElement {
    return (
        <Link as={NextLink} href="/" textDecoration="underline" mt={4} display="inline-block" _hover={{ fontStyle: "italic" }}>
            Back to balances
            <ChevronLeftIcon />
        </Link>
    );
}

function ErrorCard({ children }: { children: React.ReactNode }): ReactElement {
    return (
        <Alert status="error" variant="solid" my={4} boxShadow="0px 0px 10px #00000077">
            <AlertIcon />
            {children}
        </Alert>
    );
}

function SendForm({
    sendTx,
    tokenName,
    bgColor,
}: {
    sendTx: FormEventHandler<HTMLFormElement>;
    tokenName: string | undefined;
    bgColor: string;
}): ReactElement {
    return (
        <form onSubmit={sendTx}>
            <InputGroup mt={3}>
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
                    name="amount"
                    required={true}
                />
                <InputRightAddon bgColor="transparent" border="none" h="auto">
                    <Text fontSize={40}>{tokenName}</Text>
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
                    name="address"
                    required
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
                        type="submit"
                    >
                        Send
                    </Button>
                </InputRightAddon>
            </InputGroup>
        </form>
    );
}

function TxResult({
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    explorerUrl,
}: {
    isPending: boolean;
    isConfirming: boolean;
    isConfirmed: boolean;
    hash: string | undefined;
    explorerUrl: string | undefined;
}): ReactElement {
    return (
        <>
            {isPending && (
                <Text>
                    [<Spinner size="sm" mx={2} />
                    Pending...]
                </Text>
            )}
            {isConfirming && (
                <Text>
                    [<Spinner size="sm" mx={2} />
                    Confirming...]
                </Text>
            )}
            {isConfirmed && <Text>[Transaction Confirmed!]</Text>}
            {hash && (
                <>
                    <Heading size="lg" mt={2} mb={1}>
                        Tx Hash:
                    </Heading>{" "}
                    <Link href={explorerUrl + "/tx/" + hash} target="_blank" textDecoration="underline" _hover={{ fontStyle: "italic" }}>
                        {hash}
                    </Link>
                </>
            )}
            {isConfirmed && <RedirectTimer timer={10} />}
        </>
    );
}

function RedirectTimer({ timer }: { timer: number }): ReactElement {
    const [countdown, setCountdown] = useState(timer);
    const router = useRouter();

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setCountdown((count) => count - 1);
        }, 1000);
        const redirectTimer = setTimeout(() => {
            router.push("/");
        }, timer * 1000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <Flex>
            <Spinner size="md" mr={4} />
            <Text verticalAlign="center">Redirect in {countdown} seconds...</Text>
        </Flex>
    );
}

export default function Send(): ReactElement {
    const { isConnected, address, chain } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: hash, isPending, sendTransaction } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    // const [bgColor, setBgColor] = useState("gray.400");
    const [bgColor, setBgColor] = useState("red.400");

    const router = useRouter();

    const routerQuery = router.query.tokenAddress;
    const nativeToken = getNativeTokenName(chain?.name);
    const isETH = routerQuery == nativeToken;
    let tokenAddress: `0x${string}` | null;

    function sendTx(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const to = formData.get("address") as `0x${string}`;
        const value = formData.get("amount") as string;
        if (isETH) {
            sendTransaction({ to, value: parseEther(value) });
        } else {
        }
    }

    if (isETH) {
        return (
            <>
                <WalletWrapper bgColor={bgColor}>
                    <Heading size="lg" mt={2}>
                        Network:
                    </Heading>
                    <Chain chain={chain} />
                    <Heading size="lg" mt={2}>
                        Account:
                    </Heading>
                    <Account
                        isConnected={isConnected}
                        connectors={connectors}
                        address={address}
                        connect={connect}
                        disconnect={disconnect}
                    />
                    <Heading size="lg" mt={2} mb={1}>
                        Send {nativeToken}:
                    </Heading>
                    <Balance address={address} tokenAddress={undefined} isHoverEffectEnabled={false} />
                    <SendForm sendTx={sendTx} tokenName={nativeToken} bgColor={bgColor} />
                    <TxResult
                        isPending={isPending}
                        isConfirming={isConfirming}
                        isConfirmed={isConfirmed}
                        hash={hash}
                        explorerUrl={chain?.blockExplorers.default.url}
                    />
                    <BackToTopLink />
                </WalletWrapper>
            </>
        );
    } else {
        let errorContent: string;
        if (typeof routerQuery === "string") {
            if (isAddress(routerQuery)) {
                tokenAddress = getAddress(routerQuery);
                const { data: balance } = useBalance({ address, token: tokenAddress });
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
                            <Heading size="lg" mt={2}>
                                Network:
                            </Heading>
                            <Chain chain={chain} />
                            <Heading size="lg" mt={2}>
                                Account:
                            </Heading>
                            <Account
                                isConnected={isConnected}
                                connectors={connectors}
                                address={address}
                                connect={connect}
                                disconnect={disconnect}
                            />
                            <Heading size="lg" mt={2} mb={1}>
                                Send {tokenSymbol}:
                            </Heading>
                            <Balance address={address} tokenAddress={tokenAddress} isHoverEffectEnabled={false} />
                            <SendForm sendTx={sendTx} tokenName={tokenSymbol} bgColor={bgColor} />
                            <TxResult
                                isPending={isPending}
                                isConfirming={isConfirming}
                                isConfirmed={isConfirmed}
                                hash={hash}
                                explorerUrl={chain?.blockExplorers.default.url}
                            />
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
