import { tContext } from "@/hooks/useLocale";
import { Center, Link } from "@chakra-ui/react";
import { useContext } from "react";
import { type Connector } from "wagmi";

export default function Account({
    isConnected,
    connectors,
    address,
    connect,
    disconnect,
}: {
    isConnected: boolean;
    connectors: readonly Connector[];
    address: `0x${string}` | undefined;
    connect: any;
    disconnect: any;
}): JSX.Element {
    const t = useContext(tContext);
    if (isConnected) {
        return (
            <>
                {address} (
                <Link href="#" onClick={disconnect} textDecoration="underline" _hover={{ fontStyle: "italic" }}>
                    {t.DISCONNECT}
                </Link>
                )
            </>
        );
    } else {
        return (
            <>
                <Center
                    as="a"
                    href="#"
                    onClick={() => connect({ connector: connectors[0] })}
                    fontWeight="bold"
                    py={25}
                    my={5}
                    border={"2px solid white"}
                    _hover={{ bg: "whiteAlpha.400" }}
                >
                    {t.CONNECT_WALLET}
                </Center>
            </>
        );
    }
}
