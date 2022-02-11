import { Token } from "../Main";
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "../BalanceMsg"

export interface WalletBalanceProps {
    token: Token;
}

export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(address, account);
    console.log(tokenBalance);
    const formattedTokenBalance = tokenBalance
        ? parseFloat(formatUnits(tokenBalance, 18))
        : 0;
    return <BalanceMsg label={ `your un-stacked ${ name } balance!` } tokenImgSrc={ image } amount={ formattedTokenBalance }/>;
};