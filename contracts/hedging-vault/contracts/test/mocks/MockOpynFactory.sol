/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IOpynFactory.sol";

/**
    @title MockOpynController

    @author Roberto Cano <robercano>

    @notice Mock contract for the Opyn contoller
*/
contract MockOpynFactory is IOpynFactory {
    function getOtoken(
        address, /*_underlyingAsset*/
        address, /*_strikeAsset*/
        address, /*_collateralAsset*/
        uint256, /*_strikePrice*/
        uint256, /*_expiry*/
        bool /*_isPut*/
    ) external pure returns (address) {
        // This address is the address at index 5 of Hardhat's generated addresses for its default seed
        return address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
    }

    function getTargetOtokenAddress(
        address, /*_underlyingAsset*/
        address, /*_strikeAsset*/
        address, /*_collateralAsset*/
        uint256, /*_strikePrice*/
        uint256, /*_expiry*/
        bool /*_isPut*/
    ) external pure returns (address) {
        // This address is the address at index 5 of Hardhat's generated addresses for its default seed
        return address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
    }
}
