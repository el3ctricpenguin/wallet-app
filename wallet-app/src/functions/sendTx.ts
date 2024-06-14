import { type Config } from "wagmi";
import { erc20Abi, parseEther } from "viem";
import { type SendTransactionMutate, type WriteContractMutate } from "wagmi/query";

import { type FormSchemaType, type TokenInfo } from "@/types";

export default function sendTx(
    data: FormSchemaType,
    writeContract: WriteContractMutate<Config, unknown> | undefined,
    sendTransaction: SendTransactionMutate<Config, unknown> | undefined,
    tokenInfo: TokenInfo | undefined = undefined
): void {
    const to = data.address as `0x${string}`;
    const amount = data.amount;
    if (tokenInfo !== undefined) {
        if (writeContract !== undefined) {
            writeContract({
                address: tokenInfo.address,
                abi: erc20Abi,
                functionName: "transfer",
                args: [to, BigInt(amount) * BigInt(10 ** tokenInfo.decimals)],
            });
        }
    } else {
        if (sendTransaction !== undefined) {
            sendTransaction({ to, value: parseEther(amount.toString()) });
        }
    }
}
