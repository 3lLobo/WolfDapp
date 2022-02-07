// stake
// unstake
// add token
// getETHvalue

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";


contract TokenFarm is Ownable {
    address[] public allowedTokens;

    function addAllowedToken(address _token) public onlyOwner {
        allowedTokens.push(_token);

    }

    function stakeToken(uint256 _amount, address _token) public {
        require(_amount > 0, "Gimme moreee!");
        require(isAllowed(_token), "Token not allowed!");
    }

    function isAllowed(address _token) public view returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
    }
}
