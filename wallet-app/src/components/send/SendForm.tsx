import { type ReactElement } from "react";
import { Button, FormControl, Input, InputGroup, InputRightAddon, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TokenInfo, type FormSchemaType } from "@/types";
import { useTranslation } from "next-i18next";

export default function SendForm({
    sendTxFunc,
    tokenName,
    accountBalance,
    bgColor,
}: {
    sendTxFunc: (data: { address: string; amount: number }, tokenInfo?: TokenInfo | undefined) => void;
    tokenName: string | undefined;
    accountBalance: string;
    bgColor: string;
}): ReactElement {
    const formSchema = z.object({
        amount: z
            .number()
            .min(0, { message: "Amount must be more than zero" })
            .max(Number(accountBalance), { message: "Insufficient Balance" }),
        address: z.string(), // address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address"),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormSchemaType): void => {
        sendTxFunc(data);
        console.log(data);
    };

    const { t } = useTranslation("common");

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
                <InputGroup mt={3}>
                    <Input
                        width={300}
                        height={16}
                        fontSize={36}
                        placeholder="0.0"
                        borderColor="white"
                        borderRadius={0}
                        borderWidth={4}
                        _placeholder={{ color: "whiteAlpha.500" }}
                        _hover={{ borderColor: "white" }}
                        _active={{ borderColor: "white", boxShadow: "none" }}
                        _focusVisible={{ borderColor: "white", boxShadow: "none" }}
                        type="number"
                        step="any"
                        {...register("amount", { valueAsNumber: true })}
                        required
                    />
                    <InputRightAddon bgColor="transparent" border="none" h="auto">
                        <Text fontSize={40}>{tokenName}</Text>
                    </InputRightAddon>
                </InputGroup>
                {errors.amount?.message != null && <Text>{errors.amount.message}</Text>}
                <InputGroup size="md" my={3}>
                    <Input
                        placeholder="0x..."
                        borderColor="white"
                        borderWidth={4}
                        borderRadius={0}
                        _placeholder={{ color: "whiteAlpha.500" }}
                        _hover={{ borderColor: "white" }}
                        _active={{ borderColor: "white", boxShadow: "none" }}
                        _focusVisible={{ borderColor: "white", boxShadow: "none" }}
                        {...register("address")}
                        required
                    />
                    <InputRightAddon borderRadius={0} p={0}>
                        <Button
                            color="white"
                            bgColor={bgColor}
                            borderWidth={4}
                            borderLeftWidth={0}
                            borderRadius={0}
                            borderColor="white"
                            _hover={{ color: bgColor, bgColor: "white", borderColor: "white" }}
                            type="submit"
                        >
                            {t("SEND")}
                        </Button>
                    </InputRightAddon>
                </InputGroup>
            </FormControl>
        </form>
    );
}
