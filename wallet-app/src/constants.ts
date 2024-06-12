export function getNativeTokenName(chainName: string | undefined) {
    return chainName == "Ethereum" || chainName == "Sepolia"
        ? "ETH"
        : chainName == "Mantle" || chainName == "Mantle Sepolia Testnet"
          ? "MNT"
          : "?";
}
export const SEPOLIA_USDT = "0x5DD4e5874E40465A6D894076CE993bd6434eaA86";
export const SEPOLIA_MANTLE_USDT = "0x4A68E23d7c82A3C988c5d37fff344AEc85D7bb7D";
