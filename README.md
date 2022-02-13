# Wolf Decentralized App

## Run the wolf-dapp
If you really want to run this useless but funney app, do thiz:
```bash
cd front-end
yarn
yarn start
```
A browser window will pop up and you can connect with MetaMask. This dapp only works on the Kovan test-chain.

Ofc, if you don't have yarn installed yet, you should do so! Dhis will do the magic:
```bash
npm install --global yarn
```

If you're mssing npm, you're lost. Jk, here's a link how-to install [`npm` & `node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


## My Personal Insights:

1. to transfer a tokens from within a contract, declare the toeken with the ERC20 interface, then call transfer on it:

```ts
IERC20(_token).transfer(msg.sender, value);
```

2. Mint [Faucet token](https://erc20faucet.com/)
3. Transfer token to Contract but keep a small percentage for developement.
4. Get Token pricefeeds from [LINK]{https://docs.chain.link/docs/ethereum-addresses/}

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

For a constructor, which is declared in a separate file, import and use it with the following syntax:

```ts
<Wallet token={eth}></Wallet>
```

Always use set the structure first and the define it as export:

```ts
interface BalanceMsgProps {
    label: string;
    amount: number;
}
export const BalanceMsg = ({ label, amount }: BalanceMsgProps) => {};
```

To avoid the error msg when using json mapping, reassign and type define the mapping after import:

```ts
import configs from <...>
const netConfig : { [key: string]: any } = configs
```

Change the [`App.css`](./front_end/src/App.css) file to define styles such as background and fonts.
