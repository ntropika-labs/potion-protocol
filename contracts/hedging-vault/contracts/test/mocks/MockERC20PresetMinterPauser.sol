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
    uint8 private _decimals;

    constructor(uint8 decimals_) ERC20PresetMinterPauser("MockERC20", "MERC20") {
        _decimals = decimals_;
    }

    /**
        @notice Function that spends a given allowance

        @dev Used to reset an allowance when using fakes for the tests, as the safeApprove
        fails when the previous allowance has not been spent, and Smock has a bug that does
        not allow to do transactions inside a fake `returns`
     */
    function mockSpendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) external {
        _spendAllowance(owner, spender, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
