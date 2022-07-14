/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/**
    @title MockERC20PresetMinterPauser

    @author Roberto Cano <robercano>

    @notice Mock contract for an ERC20 with minting and pausing capabilities
 */
contract MockERC20PresetMinterPauser is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser("MockERC20", "MERC20") {}
}
