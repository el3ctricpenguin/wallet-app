import { useRouter } from "next/router";
import { createContext } from "react";

export class TranslationObj {
    LOCALE: string = "";
    NETWORK: string = "";
    ACCOUNT: string = "";
    BALANCE: string = "";
    SEND: string = "";
    TX_HASH: string = "";
    PENDING: string = "";
    CONFIRMING: string = "";
    TX_CONFIRMED: string = "";
    BACK_TO_BALANCES: string = "";
    UNSUPPORTED_NETWORK: string = "";
    CONNECT_WALLET: string = "";
    DISCONNECT: string = "";
}

const en: TranslationObj = {
    LOCALE: "en",
    NETWORK: "Network",
    ACCOUNT: "Account",
    BALANCE: "Balances",
    SEND: "Send",
    TX_HASH: "Tx Hash",
    PENDING: "Pending",
    CONFIRMING: "Confirming",
    TX_CONFIRMED: "Tx Confirmed",
    BACK_TO_BALANCES: "Back to balances",
    UNSUPPORTED_NETWORK: "Unsupported Network",
    CONNECT_WALLET: "Connect wallet",
    DISCONNECT: "Disconnect",
};

const ja: TranslationObj = {
    LOCALE: "ja",
    NETWORK: "ﾈｯﾄﾜｰｸ",
    ACCOUNT: "ｱｶｳﾝﾄ",
    BALANCE: "残高",
    SEND: "送信",
    TX_HASH: "TXﾊｯｼｭ",
    PENDING: "処理中",
    CONFIRMING: "承認中",
    TX_CONFIRMED: "ﾄﾗﾝｻﾞｸｼｮﾝが承認されました",
    BACK_TO_BALANCES: "残高表示に戻る",
    UNSUPPORTED_NETWORK: "非対応のﾈｯﾄﾜｰｸ",
    CONNECT_WALLET: "ｳｫﾚｯﾄを接続",
    DISCONNECT: "接続解除",
};

export default function useLocale(): {
    locale: string | undefined;
    t: TranslationObj;
} {
    const { locale } = useRouter();
    const t = locale === "en" ? en : ja;
    return { locale, t };
}

export const tContext = createContext(new TranslationObj());
