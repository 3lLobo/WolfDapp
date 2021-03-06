import React, { useState, useEffect } from "react";
import { Token } from "../Main";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import {
    Button,
    Input,
    CircularProgress,
    LinearProgress,
    Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { BigNumber, utils } from "ethers";
import { useStakeTokens } from "../../hooks/useStakeTokens";

export interface StakeFormProps {
    token: Token;
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token;
    const { notifications } = useNotifications();
    // const { account } = useEthers();
    // const tokenBalance: BigNumber | undefined = useTokenBalance(
    //     tokenAddress,
    //     account
    // );
    // const formattedTokenBalance: number = tokenBalance
    //     ? parseFloat(formatUnits(tokenBalance, 18))
    //     : 0;

    const [amount, setAmount] = useState<
        number | string | Array<number | string>
    >(0);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount =
            event.target.value === "" ? "" : Number(event.target.value);
        setAmount(newAmount);
    };

    const { approveAndStake, state: erc20State } = useStakeTokens(tokenAddress);
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString());
        return approveAndStake(amountAsWei.toString());
    };

    const isMining = erc20State.status === "Mining";
    const [showERC20Success, setShowERC20Success] = useState(false);
    const [showStakeSuccess, setShowStakeSuccess] = useState(false);
    const handleCloseSnack = () => {
        setShowERC20Success(false);
        setShowStakeSuccess(false);
    };

    useEffect(() => {
        if (
            notifications.filter(
                (notification) =>
                    notification.type === "transactionSucceed" &&
                    notification.transactionName === "Approve ERC20 transfer"
            ).length > 0
        ) {
            console.log("Approved!");
            setShowERC20Success(true);
            setShowStakeSuccess(false);
        }
        if (
            notifications.filter(
                (notification) =>
                    notification.type === "transactionSucceed" &&
                    notification.transactionName === "Stake Tokens"
            ).length > 0
        ) {
            console.log("Tokens Staked!");
            setShowERC20Success(false);
            setShowStakeSuccess(true);
        }
    }, [notifications]);

    return (
        <>
            <div>
                <Input onChange={handleInputChange} />
                <Button
                    onClick={handleStakeSubmit}
                    color="inherit"
                    size="large"
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={36} /> : "STAKE"}
                </Button>
            </div>
            <Snackbar
                open={showERC20Success}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    ERC-20 token approved! Now waiting for transfer.
                </Alert>
            </Snackbar>
            <Snackbar
                open={showStakeSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens staked!
                </Alert>
            </Snackbar>
        </>
    );
};
