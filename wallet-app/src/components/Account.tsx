import { Center, Link } from "@chakra-ui/react";
import { Connector } from "wagmi";
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
}) {
    if (isConnected) {
        return (
            <>
                {address} (
                <Link href="#" onClick={disconnect} textDecoration="underline" _hover={{ fontStyle: "italic" }}>
                    Disconnect
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
                    py={25}
                    my={5}
                    border={"1px solid white"}
                    _hover={{ bg: "whiteAlpha.400" }}
                >
                    Connect wallet
                </Center>
            </>
        );
    }
}
