import { tContext } from "@/hooks/useLocale";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { type ReactElement, useContext, useEffect, useState } from "react";

export default function RedirectTimer({ timer }: { timer: number }): ReactElement {
    const [countdown, setCountdown] = useState(timer);
    const router = useRouter();
    const locale = useContext(tContext).LOCALE;

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setCountdown((count) => count - 1);
        }, 1000);
        const redirectTimer = setTimeout(() => {
            router.push("/").catch(() => {});
        }, timer * 1000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <Flex>
            <Spinner size="md" mr={4} />
            <Text verticalAlign="center">
                {locale === "en" ? `Redirect in ${countdown} seconds...` : `${countdown}秒後にﾘﾀﾞｲﾚｸﾄを行います...`}
            </Text>
        </Flex>
    );
}
