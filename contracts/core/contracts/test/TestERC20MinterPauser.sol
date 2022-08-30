/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/**
    @title TestERC20MinterPauser

    @author Roberto Cano <robercano>

    @notice Mock contract for an ERC20 with minting and pausing capabilities
 */
contract TestERC20MinterPauser is ERC20PresetMinterPauser {
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20PresetMinterPauser(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
