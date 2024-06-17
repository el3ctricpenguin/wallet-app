import { Center, Link } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { type Address } from "viem";
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
    address: Address | undefined;
    connect: any;
    disconnect: any;
}): JSX.Element {
    const { t } = useTranslation("common");
    if (!isConnected) {
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
                    {t("CONNECT_WALLET")}
                </Center>
            </>
        );
    }
    return (
        <>
            {address} (
            <Link href="#" onClick={disconnect} textDecoration="underline" _hover={{ fontStyle: "italic" }}>
                {t("DISCONNECT")}
            </Link>
            )
        </>
    );
}
