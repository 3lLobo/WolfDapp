# Wolf Decentralized App


## Insights:

1. to transfer a tokens from within a contract, declare the toeken with the ERC20 interface, then call transfer on it:
```ts
IERC20(_token).transfer(msg.sender, value)
```
2. Mint [Faucet token](https://erc20faucet.com/)
3. Transfer token to Contract but keep a small percentage for developement.


To update the front-end to interact with the contracts run:
```bash
brownie compile
brownie run scripts/update_frontend.py
```
This will copy the .json's from build to the front end folder.


## Front end: Notes on React JS

To set up a react app, run:
```bash
npx create-react-app front_end --template typescript
```
It's better practice to set up a own repo for frontend.
The [manifest.json](./front_end/public/manifest.json) defines the configuration of the app. 

Frontend steps:
1. Use @usedapp/core for web3 features
2. For the UI @material-ui/core
3. For more UI @material-ui/lab

In Typescript:
Set a constant to a value if it exists otherwise default":
```ts
const var = val ? mapping[val] : 11
```

Or use an if statement with function:
```ts
const var: number = var ? func(var) : 0
```

For a delacred box you import using this syntax:
```ts
<Wallet token={ eth }></Wallet>
```

Always use set the structure first and the define it as export:
```ts
interface BalanceMsgProps {
    label: string;
    amount: number;
}
export const BalanceMsg = ({ label, amount }: BalanceMsgProps) => {}
```