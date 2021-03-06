import { Token } from "../Main";
import React, { useState } from "react";
import { Box, Tab, makeStyles } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

import { WalletBalance } from "./WalletBalance";
import { WalletStake } from "./WalletStake";
import { StakeForm } from "./StakeForm";
import { UnStakeForm } from "./UnStakeForm";

interface YourWalletProps {
    supportedTokens: Array<Token>;
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4),
    },
    box: {
        backgroundColor: "lightblue",
        borderRadius: "33px",
    },
    header: {
        color: "lightblue",
    },
}));

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue));
    };
    const classes = useStyles();
    return (
        <Box>
            <h1 className={classes.header}> Your Wallet! </h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList
                        onChange={handleChange}
                        aria-label="stake from tabs"
                    >
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab
                                    label={token.name}
                                    value={index.toString()}
                                    key={index}
                                ></Tab>
                            );
                        })}
                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>
                                    <WalletBalance
                                        token={
                                            supportedTokens[selectedTokenIndex]
                                        }
                                    />
                                    <WalletStake
                                        token={
                                            supportedTokens[selectedTokenIndex]
                                        }
                                    />
                                    <StakeForm
                                        token={
                                            supportedTokens[selectedTokenIndex]
                                        }
                                    />
                                    <UnStakeForm
                                        token={
                                            supportedTokens[selectedTokenIndex]
                                        }
                                    />
                                </div>
                            </TabPanel>
                        );
                    })}
                </TabContext>
            </Box>
        </Box>
    );
};
