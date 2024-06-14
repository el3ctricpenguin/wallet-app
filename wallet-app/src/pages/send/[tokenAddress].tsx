import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import { getNativeTokenName } from "@/constants";
import { BackToTopLink, ErrorCard, SendETH, SendToken } from "@/components/send";
import { WalletWrapper } from "@/components/common";
import { useState } from "react";

export default function Send(): JSX.Element {
    const [bgColor] = useState("red.400");
    const { chain } = useAccount();
    const router = useRouter();

    const routerQuery = router.query.tokenAddress;
    const nativeToken = getNativeTokenName(chain?.name);
    const isETH = routerQuery === nativeToken;

    return isETH ? (
        <SendETH nativeToken={nativeToken} bgColor={bgColor} />
    ) : typeof routerQuery === "string" ? (
        <SendToken routerQuery={routerQuery} bgColor={bgColor} />
    ) : (
        <WalletWrapper bgColor={bgColor}>
            <ErrorCard>{`Invalid Query Type: ${routerQuery?.toString()} (${typeof routerQuery})`}</ErrorCard>
            <BackToTopLink />
        </WalletWrapper>
    );
}
