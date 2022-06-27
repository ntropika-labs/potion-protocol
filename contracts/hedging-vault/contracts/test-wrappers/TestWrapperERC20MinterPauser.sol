/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/**
    @title ERC20PresetMinterPauser

    @author Roberto Cano <robercano>

    @notice Test wrapper for the ERC20PresetMinterPauser contract. This wrapper just
    inherits from the Open Zeppelin contract in order to have it available in typechain
 */
contract TestWrapperERC20PresetMinterPauser is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser("TestERC20", "TERC20") {}
}
