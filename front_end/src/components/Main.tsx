/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />

import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import brownieConfig from "../brownie-config-json.json";
import networkMapping from "../chain-info/map.json";
import { constants } from "ethers";
import wlf from "../res/wlf.png";
import eth from "../res/eth.png";
import dai from "../res/dai.png";
import { YourWallet } from "./yourWallet";
import { makeStyles } from "@material-ui/core";

export type Token = {
    image: string;
    address: string;
    name: string;
};

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.black,
        textAlign: "center",
        padding: theme.spacing(4),
    },
}));

export const Main = () => {
    const classes = useStyles();
    // const { chainId } = useEthers();
    const chainId = 42;
    const networkName: string = chainId ? helperConfig[chainId] : "dev";
    console.log(networkName);
    const dappTokenAddress = networkMapping["42"]["WolfToken"][0];

    const wethTokenAddress = chainId
        ? brownieConfig["networks"][networkName]["weth"]
        : constants.AddressZero;
    const fauTokenAddress = chainId
        ? brownieConfig["networks"][networkName]["fau"]
        : constants.AddressZero;
    const linkTokenAddress = chainId
        ? brownieConfig["networks"][networkName]["link"]
        : constants.AddressZero;

    const supportedTokens: Array<Token> = [
        {
            image: wlf,
            address: dappTokenAddress,
            name: "WLF",
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH",
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI",
        },
        {
            image: wlf,
            address: linkTokenAddress,
            name: "LINK",
        },
    ];

    return (
        <>
            <h2 className={classes.title}>Dapp Token App</h2>
            <YourWallet supportedTokens={supportedTokens} />
        </>
    );
};
