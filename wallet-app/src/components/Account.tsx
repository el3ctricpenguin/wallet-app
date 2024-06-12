import { type translationObj } from "@/locales/useLocale";
import { Center, Link } from "@chakra-ui/react";
import { type Connector } from "wagmi";
export default function Account({
    isConnected,
    connectors,
    address,
    connect,
    disconnect,
    t,
}: {
    isConnected: boolean;
    connectors: readonly Connector[];
    address: `0x${string}` | undefined;
    connect: any;
    disconnect: any;
    t: translationObj;
}) {
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
