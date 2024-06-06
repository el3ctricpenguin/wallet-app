import { http, createConfig } from "wagmi";
import { mainnet, mantle, mantleSepoliaTestnet, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
    chains: [mainnet, sepolia, mantle, mantleSepoliaTestnet],
    connectors: [injected()],
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [mantle.id]: http(),
        [mantleSepoliaTestnet.id]: http(),
    },
});

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
