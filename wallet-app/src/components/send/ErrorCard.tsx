import { Alert, AlertIcon } from "@chakra-ui/react";
import { type ReactElement } from "react";

export default function ErrorCard({ children }: { children: React.ReactNode }): ReactElement {
    return (
        <Alert status="error" variant="solid" my={4} boxShadow="0px 0px 10px #00000077">
            <AlertIcon />
            {children}
        </Alert>
    );
}
