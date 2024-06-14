import { useRouter } from "next/router";
import NextLink from "next/link";
import { type ReactElement, useContext, useEffect, useState } from "react";
import {
    useAccount,
    useBalance,
    useConnect,
    useDisconnect,
    useReadContract,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import {
    Alert,
    AlertIcon,
    Button,
    Flex,
    FormControl,
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { erc20Abi, formatUnits, getAddress, isAddress, parseEther } from "viem";

import Account from "../../components/Account";
import Balance from "../../components/Balance";
import Chain from "../../components/Chain";
import { getNativeTokenName } from "@/constants";
import WalletWrapper from "@/components/WalletWrapper";
import { tContext } from "@/hooks/useLocale";

interface TokenInfo {
    address: `0x${string}`;
    decimals: number;
}

interface FormSchemaType {
    address: string;
    amount: number;
}

function BackToTopLink(): ReactElement {
    const t = useContext(tContext);
    return (
        <Link as={NextLink} href="/" textDecoration="underline" mt={4} display="inline-block" _hover={{ fontStyle: "italic" }}>
            {t.BACK_TO_BALANCES}
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

function RedirectTimer({ timer }: { timer: number }): ReactElement {
    const [countdown, setCountdown] = useState(timer);
    const router = useRouter();
    const locale = useContext(tContext).LOCALE;

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setCountdown((count) => count - 1);
        }, 1000);
        const redirectTimer = setTimeout(() => {
            router.push("/").catch(() => {});
        }, timer * 1000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <Flex>
            <Spinner size="md" mr={4} />
            <Text verticalAlign="center">
                {locale === "en" ? `Redirect in ${countdown} seconds...` : `${countdown}秒後にﾘﾀﾞｲﾚｸﾄを行います...`}
            </Text>
        </Flex>
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
    const t = useContext(tContext);
    return (
        <>
            {hash !== undefined && (
                <>
                    <Heading size="lg" mt={2} mb={1}>
                        {t.TX_HASH}:
                    </Heading>{" "}
                    <Link href={explorerUrl + "/tx/" + hash} target="_blank" textDecoration="underline" _hover={{ fontStyle: "italic" }}>
                        {hash}
                    </Link>
                </>
            )}
            {isPending && (
                <Text>
                    [<Spinner size="sm" mx={2} />
                    {t.PENDING}...]
                </Text>
            )}
            {isConfirming && (
                <Text>
                    [<Spinner size="sm" mx={2} />
                    {t.CONFIRMING}...]
                </Text>
            )}
            {isConfirmed && <Text>[{t.TX_CONFIRMED}!]</Text>}
            {isConfirmed && <RedirectTimer timer={10} />}
        </>
    );
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

    function sendTx(data: FormSchemaType, tokenInfo: TokenInfo | undefined = undefined): void {
        const to = data.address as `0x${string}`;
        const amount = data.amount;
        if (tokenInfo !== undefined) {
            if (typeof routerQuery === "string") {
                writeContract({
                    address: tokenInfo.address,
                    abi: erc20Abi,
                    functionName: "transfer",
                    args: [to, BigInt(amount) * BigInt(10 ** tokenInfo.decimals)],
                });
            }
        } else {
            sendTransaction({ to, value: parseEther(amount.toString()) });
        }
    }

    function SendForm({
        sendTxFunc,
        tokenName,
        accountBalance,
        bgColor,
    }: {
        sendTxFunc: (data: { address: string; amount: number }, tokenInfo?: TokenInfo | undefined) => void;
        tokenName: string | undefined;
        accountBalance: string;
        bgColor: string;
    }): ReactElement {
        const formSchema = z.object({
            amount: z
                .number()
                .min(0, { message: "Amount must be more than zero" })
                .max(Number(accountBalance), { message: "Insufficient Balance" }),
            address: z.string(), // address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
        });
        const {
            register,
            handleSubmit,
            // watch,
            formState: { errors },
        } = useForm<FormSchemaType>({
            resolver: zodResolver(formSchema),
        });

        const onSubmit = (data: FormSchemaType): void => {
            sendTxFunc(data);
            console.log(data);
        };

        const t = useContext(tContext);

        return (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
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
                            type="number"
                            {...register("amount", { valueAsNumber: true })}
                            required
                        />
                        <InputRightAddon bgColor="transparent" border="none" h="auto">
                            <Text fontSize={40}>{tokenName}</Text>
                        </InputRightAddon>
                    </InputGroup>
                    {errors.amount?.message != null && <Text>{errors.amount.message}</Text>}
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
                            {...register("address")}
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
                                {t.SEND}
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                </FormControl>
            </form>
        );
    }

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
                        <SendForm sendTxFunc={sendTx} tokenName={nativeToken} accountBalance={ethBalance} bgColor={bgColor} />
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
                                        sendTx(e, tokenInfo);
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
