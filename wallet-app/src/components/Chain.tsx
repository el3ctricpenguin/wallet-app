import { useSwitchChain } from "wagmi";
import { Select } from "@chakra-ui/react";
import { tContext, type TranslationObj } from "@/hooks/useLocale";
import { useContext } from "react";

type supportedChainId = 1 | 11155111 | 5000 | 5003;

export default function ChainSwitcher({ chain }: { chain: any }): JSX.Element {
    const { chains, status, switchChain } = useSwitchChain();
    const t = useContext(tContext);

    if (status === "pending") {
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
                value={chain !== undefined ? chain.id : ""}
                onChange={(e) => {
                    const chainId = Number(e.target.value) as supportedChainId;
                    switchChain({ chainId });
                }}
                borderRadius={0}
                borderWidth={3}
                borderColor="white"
                _hover={{ borderColor: "white" }}
                _active={{ borderColor: "white" }}
                _focusVisible={{ borderColor: "white" }}
            >
                {chain !== undefined ? null : (
                    <option disabled value="">
                        {t.UNSUPPORTED_NETWORK}
                    </option>
                )}
                {chains.map((chain) => (
                    <option value={chain.id} key={chain.name}>
                        {chain.name}
                    </option>
                ))}
            </Select>
        );
    }
}

export function Chain({ chain, t }: { chain: any; t: TranslationObj }): JSX.Element {
    return (
        <>
            Chain Name: {chain !== undefined ? chain.name : "-"}
            <br />
            Chain Id: {chain !== undefined ? chain.id : "-"}
            <br />
            <ChainSwitcher chain={chain} />
        </>
    );
}
