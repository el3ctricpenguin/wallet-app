import { tContext } from "@/functions/useLocale";
import { Heading, Link, Spinner, Text } from "@chakra-ui/react";

import { type ReactElement, useContext } from "react";
import RedirectTimer from "@/components/send/RedirectTimer";

export default function TxResult({
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
