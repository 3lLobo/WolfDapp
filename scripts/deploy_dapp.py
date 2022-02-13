"""Deploy The Dapp"""


from importlib.abc import Loader
import json
import os
import shutil
import yaml
from typing import Dict, get_args
from eth_account import Account
from web3 import Web3
from scripts.utils import get_account, get_contract
from brownie import Contract, WolfToken, TokenFarm, config, network
from brownie.network.transaction import TransactionReceipt
from scripts.update_frontend import update_front_end

KEPT_BALANCE = Web3.toWei(111, "ether")


def deploy_farm_token():
    """Deploy both the Token and the TokenFarm contracts."""
    acc = get_account()
    if network.show_active() == "kovan":
        print("Contracts already deployed on {}!".format(network.show_active()))
        wolf_coin = WolfToken[-1]
        token_farm = TokenFarm[-1]
    else:
        wolf_coin = WolfToken.deploy({"from": acc})
        token_farm = TokenFarm.deploy(
            wolf_coin.address,
            {"from": acc},
            publish_source=config["networks"][network.show_active()]["verify"],
        )
        tx = wolf_coin.transfer(
            token_farm.address, wolf_coin.totalSupply() - KEPT_BALANCE, {"from": acc}
        )
        tx.wait(1)
    weth_token = get_contract("weth")
    fau_token = get_contract("fau")
    link_token = get_contract("link")
    allowed_token = {
        wolf_coin: get_contract("dai_feed"),
        fau_token: get_contract("dai_feed"),
        weth_token: get_contract("eth_feed"),
        link_token: get_contract("link"),
    }
    token_farm = add_allowed_token(token_farm, allowed_token, acc)
    update_front_end()

    return token_farm, wolf_coin


def add_allowed_token(
    token_farm: Contract, allowed_tokens: Dict, acc: Account
) -> TransactionReceipt:
    """Add token to list of allowed tokens.
    Therefore an Aggregator to read the value of this token is neccessary.

    Args:
        token_farm (Contract): The contract of the tokenFarm
        allowed_tokens (Dict): Dict of alreadt allowed tokens
        acc (Account): Executing account

    Returns:
        TransactionReceipt: The transaction receipt
    """
    for token in allowed_tokens:
        add_tx = token_farm.addAllowedToken(token.address, {"from": acc})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, allowed_tokens[token], {"from": acc}
        )
        set_tx.wait(1)
    return token_farm


# def update_UI():
#     """Send the brownie configurations to the forntend."""
#     copy_dir2UI("./build", './front_end/src/chain-info')
#     with open("brownie-config.yaml", "r") as f_yaml:
#         with open("./front_end/src/brownie-config.json", "w") as f_json:
#             json.dump(yaml.load(f_yaml, Loader=yaml.FullLoader), f_json)
#     print("Front-end up to date!")


# def copy_dir2UI(src: str, dest: str):
#     """Cope a folder to the front-end.

#     Args:
#         src (str): Source folder
#         dest (str): Destination folder path
#     """
#     if os.path.exists(dest):
#         shutil.rmtree(dest)
#     shutil.copytree(src, dest)


def main():
    """Main app."""
    deploy_farm_token()
