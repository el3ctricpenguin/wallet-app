import { useSwitchChain } from "wagmi";
import { Select } from "@chakra-ui/react";

export default function ChainSwitcher({ chain }: { chain: any }) {
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
                <option>pending</option>
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
                    switchChain({ chainId: Number(e.target.value) });
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
                        Unsupported Network
                    </option>
                )}
                {chains.map((chain) => (
                    <option value={chain.id}>{chain.name}</option>
                ))}
            </Select>
        );
    }
}

export function Chain({ chain }: { chain: any }) {
    return (
        <>
            Chain Name: {chain ? chain.name : "-"}
            <br />
            Chain Id: {chain ? chain.id : "-"}
            <br />
            <ChainSwitcher chain={chain} />
        </>
    );
}
