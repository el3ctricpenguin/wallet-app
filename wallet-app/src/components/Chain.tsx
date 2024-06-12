import { useSwitchChain } from "wagmi";
import { Select } from "@chakra-ui/react";
import type { translationObj } from "@/locales/useLocale";

type supportedChainId = 1 | 11155111 | 5000 | 5003;

export default function ChainSwitcher({ chain, t }: { chain: any; t: translationObj }) {
    const { chains, data, status, switchChain } = useSwitchChain();

    if (status == "pending") {
        return (
            <Select
                w={280}
                borderRadius={0}
                borderWidth={3}
                borderColor="white"
                _hover={{ borderColor: "white" }}
                _active={{ borderColor: "white" }}
                _focusVisible={{ borderColor: "white" }}
            >
                <option>{t.PENDING}</option>
            </Select>
        );
    } else {
        return (
            <Select
                w={280}
                name=""
                id=""
                value={chain ? chain.id : ""}
                onChange={(e) => {
                    const chainId = Number(e.target.value) as supportedChainId;
                    switchChain({ chainId: chainId });
                }}
                borderRadius={0}
                borderWidth={3}
                borderColor="white"
                _hover={{ borderColor: "white" }}
                _active={{ borderColor: "white" }}
                _focusVisible={{ borderColor: "white" }}
            >
                {chain ? null : (
                    <option disabled value="">
                        {t.UNSUPPORTED_NETWORK}
                    </option>
                )}
                {chains.map((chain) => (
                    <option value={chain.id}>{chain.name}</option>
                ))}
            </Select>
        );
    }
}

export function Chain({ chain, t }: { chain: any; t: translationObj }) {
    return (
        <>
            Chain Name: {chain ? chain.name : "-"}
            <br />
            Chain Id: {chain ? chain.id : "-"}
            <br />
            <ChainSwitcher chain={chain} t={t} />
        </>
    );
}
