import { type Address } from "viem";

export interface TokenInfo {
    address: Address;
    decimals: number;
}

export interface FormSchemaType {
    address: string;
    amount: number;
}
