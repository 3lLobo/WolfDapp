// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WolfToken is ERC20 {
    constructor() public ERC20("Wolf Token", "WLF") {
        _mint(msg.sender, 1000_000 * 10**18);
    }
}