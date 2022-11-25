/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IOpynFactory.sol";

import "./MockERC20PresetMinterPauser.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockOpynFactory is IOpynFactory {
    uint8 public constant OTOKEN_DECIMALS = 8;
    MockERC20PresetMinterPauser public otoken;

    constructor(address otoken_) {
        otoken = MockERC20PresetMinterPauser(otoken_);
    }

    /**
        @inheritdoc IOpynFactory
    */
    function getOtoken(
        address, /*_underlyingAsset*/
        address, /*_strikeAsset*/
        address, /*_collateralAsset*/
        uint256, /*_strikePrice*/
        uint256, /*_expiry*/
        bool /*_isPut*/
    ) external view returns (address) {
        // This address is the address at index 5 of Hardhat's generated addresses for its default seed
        return address(otoken);
    }

    /**
        @inheritdoc IOpynFactory
    */
    function getTargetOtokenAddress(
        address, /*_underlyingAsset*/
        address, /*_strikeAsset*/
        address, /*_collateralAsset*/
        uint256, /*_strikePrice*/
        uint256, /*_expiry*/
        bool /*_isPut*/
    ) external view returns (address) {
        // This address is the address at index 5 of Hardhat's generated addresses for its default seed
        return address(otoken);
    }
}
