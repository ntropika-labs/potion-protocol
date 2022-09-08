/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IPotionProtocolOracle.sol";
import "../../interfaces/IOtoken.sol";
import { PotionBuyInfo } from "../../interfaces/IPotionBuyInfo.sol";
import "../../common/RolesManagerUpgradeable.sol";

/**
    @title IPotionProtocolOracle

    @notice Oracle contract for the Potion Protocol potion buy. It takes care of holding the information
    about the counterparties that will be used to buy a particular potion (potion) with a maximum allowed
    premium

    @dev It is very basic and it just aims to abstract the idea of an Oracle into a separate contract
    but it is still very coupled with PotionProtocolHelperUpgradeable

    @dev It inherits from the RolesManagerUpgradeable contract to scope the parameters setting
    functions for only the Keeper role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the Action. The initialization will happen in the Action contract

 */
contract PotionProtocolOracleUpgradeable is IPotionProtocolOracle, RolesManagerUpgradeable {
    /**
        @notice Information on the buy of an OToken 

        @dev potion => PotionBuyInfo
    */
    mapping(bytes32 => PotionBuyInfo) private _potionBuyInfo;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.
     */
    // solhint-disable-next-line func-name-mixedcase, no-empty-blocks
    function __PotionProtocolOracle_init_unchained() internal view onlyInitializing {
        // Empty on purpose
    }

    /// FUNCTIONS

    /**
        @inheritdoc IPotionProtocolOracle
     */
    function setPotionBuyInfo(PotionBuyInfo calldata info) external onlyOperator {
        bytes32 id = _getPotionId(info.underlyingAsset, info.expirationTimestamp);
        _potionBuyInfo[id] = info;
    }

    /**
        @inheritdoc IPotionProtocolOracle
     */
    function getPotionBuyInfo(address underlyingAsset, uint256 expirationTimestamp)
        public
        view
        returns (PotionBuyInfo memory)
    {
        bytes32 id = _getPotionId(underlyingAsset, expirationTimestamp);
        return _potionBuyInfo[id];
    }

    /**
        @notice Calculates the unique ID for a potion

        @param underlyingAsset The address of the underlying token of the potion
        @param expirationTimestamp The timestamp when the potion expires

        @return The unique ID for the potion
     */
    function _getPotionId(address underlyingAsset, uint256 expirationTimestamp) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(underlyingAsset, expirationTimestamp));
    }
}
