import { useEthers, useContractFunction } from "@usedapp/core";
import TokenFarm from "../chain-info/TokenFarm.json";
import helperConfig from "../helper-config.json";
import brownieConfig from "../brownie-config-json.json";
import networkMapping from "../chain-info/map.json";
import { constants, utils } from "ethers";
import ERC20 from "../chain-info/MockERC20.json";
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

export const useStakeTokens = (tokenAddress: string) => {
    // const {chainId}: any = useEthers()
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
    const { send: approveErc20Send, state: approveAndStakeErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "Approve ERC20 transfer",
        })
    const approveAndStake = (amount: string) => {
        setAmount2Stake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }
    // stake
    const { send: stakeSend, state: stakeState } =
        useContractFunction(tokenFarmContract, "stakeTokens", {
            transactionName: "Stake Tokens",
        })

    const [amount2Stake, setAmount2Stake] = useState("0");

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            stakeSend(amount2Stake, tokenAddress);
        }
    }, [approveAndStakeErc20State, amount2Stake, tokenAddress]);

    const [state, setState] = useState(approveAndStakeErc20State);

    useEffect(() => {
        if (approveAndStakeErc20State.status === "Success") {
            setState(stakeState)
        } else {
            setState(approveAndStakeErc20State)
        }
    }, [approveAndStakeErc20State, stakeState] )

    return { approveAndStake, state };
};
