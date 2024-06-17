import { getAddress, type Address } from "viem";

export function getNativeTokenName(chainName: string | undefined): string {
    switch (chainName) {
        case "Ethereum":
            return "ETH";
        case "Sepolia":
            return "ETH";
        case "Mantle":
            return "MNT";
        case "Mantle Sepolia Testnet":
            return "MNT";
        default:
            return "?";
    }
}
const ETH_USDT = getAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7");
const SEPOLIA_USDT = getAddress("0x5DD4e5874E40465A6D894076CE993bd6434eaA86");
const MANTLE_USDT = getAddress("0x201eba5cc46d216ce6dc03f6a759e8e766e956ae");
const SEPOLIA_MANTLE_USDT = getAddress("0x4A68E23d7c82A3C988c5d37fff344AEc85D7bb7D");

export function getUSDTAddress(chainName: string | undefined): Address {
    return chainName === "Ethereum"
        ? ETH_USDT
        : chainName === "Sepolia"
          ? SEPOLIA_USDT
          : chainName === "Mantle"
            ? MANTLE_USDT
            : chainName === "Mantle Sepolia Testnet"
              ? SEPOLIA_MANTLE_USDT
              : getAddress("0x0000000000000000000000000000000000000000");
}
