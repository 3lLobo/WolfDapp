import React, { useState, useEffect } from "react";
import { Token } from "../Main";
import { useEthers, useNotifications } from "@usedapp/core";
import {
    Button,
    CircularProgress,
    Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useUnStake } from "../../hooks/useUnStake";
import { constants } from "ethers";

export interface UnStakeFormProps {
    token: Token;
}

export const UnStakeForm = ({ token }: UnStakeFormProps) => {
    const { address: tokenAddress, name } = token;
    const { account } = useEthers()
    const acc: string = account ? account : constants.AddressZero
    const { notifications } = useNotifications();

    const { unStakeCall, unStakeState } = useUnStake(tokenAddress);
    const handleStakeSubmit = () => {
        return unStakeCall(tokenAddress);
    };

    const isMining = unStakeState.status === "Mining";
    const [showStakeSuccess, setShowStakeSuccess] = useState(false);
    const handleCloseSnack = () => {
        setShowStakeSuccess(false);
    };

    useEffect(() => {
        if (
            notifications.filter(
                (notification) =>
                    notification.type === "transactionSucceed" &&
                    notification.transactionName === "Stake Tokens"
            ).length > 0
        ) {
            console.log("Tokens Staked!");
            setShowStakeSuccess(true);
        }
    }, [notifications]);

    return (
        <>
            <div>
                <Button
                    onClick={handleStakeSubmit}
                    color="inherit"
                    size="large"
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={36} /> : "unSTAKEall"}
                </Button>
            </div>
            <Snackbar
                open={showStakeSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens unstaked!
                </Alert>
            </Snackbar>
        </>
    );
};
