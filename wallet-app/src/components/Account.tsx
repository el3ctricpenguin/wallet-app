import { Connector } from "wagmi";
export default function Account({
    isConnected,
    connectors,
    address,
    connect,
    disconnect,
}: {
    isConnected: boolean;
    connectors: readonly Connector[];
    address: `0x${string}` | undefined;
    connect: any;
    disconnect: any;
}) {
    if (isConnected) {
        return (
            <>
                {address} (
                <a href="#" onClick={disconnect}>
                    Disconnect
                </a>
                )
            </>
        );
    } else {
        return (
            <>
                <a href="#" onClick={() => connect({ connector: connectors[0] })}>
                    Connect wallet
                </a>
            </>
        );
    }
}
