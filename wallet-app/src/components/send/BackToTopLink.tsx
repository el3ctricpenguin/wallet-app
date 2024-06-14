import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import { useContext, type ReactElement } from "react";
import NextLink from "next/link";
import { tContext } from "@/functions/useLocale";

export default function BackToTopLink(): ReactElement {
    const t = useContext(tContext);
    return (
        <Link as={NextLink} href="/" textDecoration="underline" mt={4} display="inline-block" _hover={{ fontStyle: "italic" }}>
            {t.BACK_TO_BALANCES}
            <ChevronLeftIcon />
        </Link>
    );
}
