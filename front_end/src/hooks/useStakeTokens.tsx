import {useEthers } from "@usedapp/core"
import TokenFarm from "../contracts/TokenFarm.json"
import helperConfig from "../helper-config.json";
import brownieConfig from "../brownie-config-json.json";
import networkMapping from "../chain-info/map.json";
import { constants, utils } from "ethers";
import ERC20 from "../chain-info/MockERC20.json"
import { Contract } from "@ethersproject/contracts"


export const useStakeTokens = (tokenAddress: string) => {
    // const {chainId}: any = useEthers()
    const chainId = 42
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[chainId]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20Abi = ERC20.abi
    const erc20Interface = new utils.Interface(erc20Abi)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

}