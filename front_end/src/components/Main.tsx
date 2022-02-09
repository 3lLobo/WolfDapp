/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />

import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import brownieConfig from "../brownie-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import wlf from "../wlf.png";
import { YourWallet } from "./yourWallet";
import { makeStyles } from "@material-ui/core";

export type Token = {
    image: string;
    address: string;
    name: string;
};

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4),
    },
}));

export const Main = () => {
    const classes = useStyles();
    const { chainId } = useEthers();
    console.log(chainId);
    const strChainId: string = String(chainId);
    const networkName = chainId ? helperConfig[chainId] : "dev";
    const dappTokenAddress = constants.AddressZero;
    chainId ? networkMapping[strChainId]["WolfCoin"][0] : constants.AddressZero;
    const wethTokenAddress = chainId
        ? brownieConfig["networks"][networkName]["weth"]
        : constants.AddressZero;
    const fauTokenAddress = chainId
        ? brownieConfig["networks"][networkName]["fau"]
        : constants.AddressZero;

    const supportedTokens: Array<Token> = [
        {
            image: wlf,
            address: dappTokenAddress,
            name: "WLF",
        },
        {
            image: wlf,
            address: wethTokenAddress,
            name: "WETH",
        },
        {
            image: wlf,
            address: fauTokenAddress,
            name: "DAI",
        },
    ];

    return (
        <>
            <h2 className={classes.title}>Dapp Token App</h2>
            <YourWallet supportedTokens={supportedTokens} />
        </>
    );
};
