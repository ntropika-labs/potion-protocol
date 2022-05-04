// contracts/SimpleERC20.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("Simple", "SMP") {
        _mint(msg.sender, initialSupply);
    }
}
