import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import { getNativeTokenName } from "@/constants";
import { BackToTopLink, ErrorCard, SendETH, SendToken } from "@/components/send";
import { WalletWrapper } from "@/components/common";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticPaths(): Promise<any> {
    const paths = [
        { params: { tokenAddress: "ETH" } },
        { params: { tokenAddress: "MNT" } },
        { params: { tokenAddress: "0x5DD4e5874E40465A6D894076CE993bd6434eaA86" } },
    ];
    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ locale }: { locale: string }): Promise<any> {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

export default function Send(): JSX.Element {
    const [bgColor] = useState("red.400");
    const { chain } = useAccount();
    const router = useRouter();

    const routerQuery = router.query.tokenAddress;
    const nativeToken = getNativeTokenName(chain?.name);
    const isETH = routerQuery === nativeToken;

    if (isETH) {
        return <SendETH nativeToken={nativeToken} bgColor={bgColor} />;
    }

    if (typeof routerQuery === "string") {
        return <SendToken routerQuery={routerQuery} bgColor={bgColor} />;
    } else {
        return (
            <WalletWrapper bgColor={bgColor}>
                <ErrorCard>{`Invalid Query Type: ${routerQuery?.toString()} (${typeof routerQuery})`}</ErrorCard>
                <BackToTopLink />
            </WalletWrapper>
        );
    }
}
