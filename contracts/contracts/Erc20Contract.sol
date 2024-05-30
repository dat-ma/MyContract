// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenERC20 is ERC20, Ownable {
    constructor()
        ERC20("MyToken", "MTK")
        Ownable()
    {}

    function mint() public onlyOwner {
        _mint(owner(), 100 * 10 ** 18);
    }
}
