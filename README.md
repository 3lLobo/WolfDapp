# Wolf Decentralized App



## Insights:

1. to transfer a tokens from within a contract, declare the toeken with the ERC20 interface, then call transfer on it:
```solidity
IERC20(_token).transfer(msg.sender, value)
```
2. Mint [Faucet token](https://erc20faucet.com/)
3. Transfer token to Contract but keep a small percentage for developement.


## Front end:

To set up a react app, run:
```bash
npx create-react-app front_end --template typescript
```
It's better practice to set up a own repo for frontend.
The [manifest.json](./front_end/public/manifest.json) defines the configuration of the app. 

Frontend steps:
1. Use @usedapp/core for web3 features
2. For the UI @material-ui/core

In Typescript:
Set a constant to a value if it exists otherwise default":
```ts
const var = val ? mapping[val] : 11
```
