import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import { type ReactElement } from "react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";

export default function BackToTopLink(): ReactElement {
    const { t } = useTranslation("common");
    return (
        <Link as={NextLink} href="/" textDecoration="underline" mt={4} display="inline-block" _hover={{ fontStyle: "italic" }}>
            {t("BACK_TO_BALANCES")}
            <ChevronLeftIcon />
        </Link>
    );
}
