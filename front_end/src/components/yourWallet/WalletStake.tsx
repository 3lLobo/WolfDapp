import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "../BalanceMsg";
import networkMapping from "../../chain-info/map.json";
import { constants } from "ethers";

export interface WalletStakeProps {
    token: Token;
}

export const WalletStake = ({ token }: WalletStakeProps) => {
    const { image, address, name } = token;

    // Contract account
    const chainId = 42;
    const tokenFarmAddress = chainId
        ? networkMapping[chainId]["TokenFarm"][0]
        : constants.AddressZero;

    const tokenStake = useTokenBalance(address, tokenFarmAddress);
    const formattedTokenStake: number = tokenStake
        ? parseFloat(formatUnits(tokenStake, 18))
        : 0;
    return (
        <BalanceMsg
            label={`Stacked ${name} :`}
            tokenImgSrc={image}
            amount={formattedTokenStake}
        />
    );
};
