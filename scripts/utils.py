"""Helper functions
"""

from code import interact
import string
from brownie import (
    MockV3Aggregator,
    MockDAI,
    MockWETH,
    # VRFCoordinatorMock,
    LinkToken,
    # AdvancedNFT,
    ETH_ADDRESS,
    accounts,
    network,
    interface,
    config,
    Contract,
)
from brownie.network.contract import ProjectContract, ContractTx, ContractContainer
from brownie.network.transaction import TransactionReceipt
from eth_account import Account
from eth_typing import Address
import eth_utils
from icecream import ic
from web3 import Web3


DECIMALS = 8
START_PRICE = 20e11
LOCAL_BLOCKCHAINS = ["development", "ganachewin11"]
FORKED_LOCAL_CHAIN = ["mainnet-fork", "dev-fork"]

c_map = {
    "eth_feed": MockV3Aggregator,
    "dai_feed": MockV3Aggregator,
    "link_feed": MockV3Aggregator,
    "fau": MockDAI,
    "weth": MockWETH,
    "link": LinkToken,
}


def get_account(acc_idx: int = 0, brownie_id: int = None) -> str:
    """Checks for network and returns account public key.
    if on Ganache, the native generated first account ist returned.
    On testnet, the account stored in .env.

    Args:
        acc_idx[int]: index of the local account. Default is the first one.
        bronie_id[int]: Id of the account stored in brownie.
    """
    net = network.show_active()
    print("WTF mate?! You're sailing on the {} networq!".format(net))

    if brownie_id:
        return accounts.load(brownie_id)

    if net in LOCAL_BLOCKCHAINS + FORKED_LOCAL_CHAIN:
        ic(accounts[acc_idx])
        return accounts[acc_idx]
    else:
        return accounts.add(config["wallets"]["from_key"])


def get_contract(c_name: string) -> ProjectContract:
    """Returs the contract defined in brownie config.
    If no contract is defined, a mock version is deployed.

    Args:
        c_name (string): contract name

    Returns:
        ProjectContract: most recent deployed contract or mock.
    """

    c_type = c_map[c_name]
    net = network.show_active()

    if net in LOCAL_BLOCKCHAINS:
        if len(c_type) <= 0:
            # MockV3Aggregator.length
            deploy_mocks()
        contract = c_type[-1]
    else:
        try:
            c_address = config["networks"][network.show_active()][c_name]
            contract = Contract.from_abi(c_type._name, c_address, c_type.abi)
        except KeyError:
            print(
                f"{network.show_active()} address not found, add it to the config or deploy mocks!",
                f"brownie run scripts/deploy_mocks.py --network {network.show_active()}",
            )
    return contract


def deploy_mocks(decimals=DECIMALS, initial_value=START_PRICE):
    """
    Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Mock Link Token...")
    link_token = LinkToken.deploy({"from": account})
    print("Deploying Mock Price Feed...")
    mock_price_feed = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account}
    )
    print(f"Deployed to {mock_price_feed.address}")
    print("Deploying Mock DAI...")
    dai_token = MockDAI.deploy({"from": account})
    print(f"Deployed to {dai_token.address}")
    print("Deploying Mock WETH")
    weth_token = MockWETH.deploy({"from": account})
    print(f"Deployed to {weth_token.address}")


# We didn't have this in the video, but it's a helpful script to have you issue the tokens!
def issue_tokens():
    """You can call this function once you have deployed your TokenFarm contract to a live network
    and have users that have staked tokens.

    Note that it relies on get_contract, so be mindful to correctly configure your Token Farm contract
    into brownie-config.yaml as well as the contract_to_mock dict as described in the get_contract docstring
    Run this function with this command: `brownie run scripts/issue_tokens.py --network kovan`
        This function will:
            - Print your account address and deployed TokenFarm contract address to confirm that you're using the right ones
            - Call issueTokens on your deployed TokenFarm contract to issue the DAPP token reward to your users
    """
    account = get_account()
    print(f"Issue Tokens called by: {account}")
    token_farm = get_contract("TokenFarm")
    print(f"TokenFarm contract called to issue tokens: {token_farm}")
    tx = token_farm.issueTokens({"from": account})
    tx.wait(1)


def fund_link(
    c_address: Address,
    acc: Account = None,
    token: Address = None,
    value: int = 10 ** 17,
):
    """Fund the given contract with certain ammount of token.

    Args:
        c_address (Address): contract address
        acc (Account, optional): Emmitting account. Defaults to None.
        link (Address, optional): Toke address. Defaults to None.
        value (int, optional): Value to be transferes. Defaults to 10**17.

    Returns:
        Transaction confirmation
    """
    acc = acc if acc else get_account()
    token = token if token else get_contract("link")
    # tx = token.transfer(c_address, value+111, {"from": acc})
    link_interface = interface.LinkTokenInterface(token.address)
    tx = link_interface.transfer(c_address, value, {"from": acc})
    tx.wait(1)
    print("Funded contract!")

    return tx


def encode_function_data(initializer: ContractTx = None, *args) -> bytes:
    """Encode data to init a contract through a proxy.
    The initializer is the function we want to call when deploying that contract.
    Proxies have no constructor, thus the initializer.
    Args:
        initializer ([ContractTx], optional): The init function we want to call. Defaults to None.

    Returns:
        bytes: the bytes code of the function.
    """
    if len(args) == 0 or not initializer:
        return eth_utils.to_bytes(hexstr="0x")
    return initializer.encode_input(*args)


def upgrade_contract(
    acc: Account,
    proxy: Contract,
    new_address: Address,
    proxy_admin_contract: Contract = None,
    initializer: ContractTx = None,
    *args,
) -> TransactionReceipt:
    """Uprage a contract trough its proxy.

    Args:
        acc (Account): Your account
        proxy (Contract): The proxy contract
        new_address (Address): The adress of the new contract
        proxy_admin_contract (Contract, optional): The Admin contract if aplicable. Defaults to None.
        initializer (ContractTx, optional): Init function to call when deploying. Defaults to None.

    Returns:
        TransactionReceipt: The receipt of deployment, including new address.
    """
    tx = None
    args_list = [new_address, {"from": acc}]

    if initializer:
        encoded_init = encode_function_data(initializer, *args)
        args_list.insert(1, encoded_init)

        if proxy_admin_contract:
            args_list.insert(0, proxy.address)
            tx = proxy_admin_contract.upgradeAndCall(*args_list)

        else:
            tx = proxy.upgradeToAndCall(*args_list)

    else:
        if proxy_admin_contract:
            args_list.insert(0, proxy.address)
            tx = proxy_admin_contract.upgrade(*args_list)

        else:
            tx = proxy.upgradeTo(*args_list)

    return tx
