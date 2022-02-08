# Wolf Decentralized App



## Insights:

1. to transfer a tokens from within a contract, declare the toeken with the ERC20 interface, then call transfer on it:
```solidity
IERC20(_token).transfer(msg.sender, value)
```
2. Mint [Faucet token](https://erc20faucet.com/)
3. 