import { useEthers, useContractFunction } from "@usedapp/core";
import TokenFarm from "../chain-info/TokenFarm.json";
import helperConfig from "../helper-config.json";
import brownieConfig from "../brownie-config-json.json";
import networkMapping from "../chain-info/map.json";
import { constants, utils } from "ethers";
import ERC20 from "../chain-info/MockERC20.json";
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

export const useUnStake = (tokenAddress: string) => {
    const { account } = useEthers()
    const chainId = 42;
    const { abi } = TokenFarm;
    const tokenFarmAddress = chainId
        ? networkMapping[chainId]["TokenFarm"][0]
        : constants.AddressZero;
    const tokenFarmInterface = new utils.Interface(abi);
    const tokenFarmContract = new Contract(
        tokenFarmAddress,
        tokenFarmInterface
    );

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    // approve
    // const { send: approveErc20Send, state: approveAndStakeErc20State } =
    //     useContractFunction(erc20Contract, "approve", {
    //         transactionName: "Approve ERC20 transfer",
    //     })

    // stake
    const { send: unStake, state: unStakeState } =
        useContractFunction(tokenFarmContract, "unstakeTokens", {
            transactionName: "Stake Tokens",
        })

    const unStakeCall = (token) => {
        unStake(token)
        return unStakeState
    }

    const [amount2Stake, setAmount2Stake] = useState("0");

    return { unStakeCall, unStakeState };
};
