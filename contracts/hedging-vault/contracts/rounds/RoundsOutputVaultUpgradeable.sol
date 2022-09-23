/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../interfaces/IRoundsOutputVault.sol";
import "./BaseRoundsVaultUpgradeable.sol";

/**
    @title RoundsOutputVaultUpgradeable

    @notice The RoundsOutputVaultUpgradeable contract allows users to deposit shares from the target vault into
    this contract while the  target vault is locked, and receipts are minted to the users for this deposits. Upon
    round completion, the shares are redeemed in the target vault and the corresponding funds are collected.

    Users can then exchange their receipts from previous rounds for the corresponding funds held in this vault.

    @author Roberto Cano <robercano>
 */
contract RoundsOutputVaultUpgradeable is BaseRoundsVaultUpgradeable, IRoundsOutputVault {
    // UPGRADEABLE INITIALIZER

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
                to the hierarchy will require to review this function to make sure that no initializer
                is called twice, and most importantly, that all initializers are called here

        @param adminAddress The address of the admin of this vault
        @param operatorAddress The address of the operator of this vault
        @param targetVault The vault address for which this input vault is managing deposits
        @param receiptsURI The URI of the ERC-1155 receipts that will be emitted when depositing the underlying
     */
    function initialize(
        address adminAddress,
        address operatorAddress,
        address targetVault,
        string calldata receiptsURI
    ) external initializer {
        // For the input vault, the exchange asset is the target vault's underlying asset, which
        // are given by the `asset()` function in the ERC4626 vault, and the underlying is the shares
        // token, represented by the target vault address itself
        address exchangeAsset_ = IERC4626Upgradeable(targetVault).asset();
        address underlyingAsset = targetVault;

        __RolesManager_init_unchained(adminAddress, operatorAddress);
        __ERC1155_init_unchained(receiptsURI);
        __ERC4626MultiToken_init_unchained(IERC20MetadataUpgradeable(underlyingAsset));
        __ERC4626DeferredOperation_init_unchained(targetVault);
        __BaseRoundsVault_init_unchained(exchangeAsset_);
    }

    // PUBLIC FUNCTIONS

    /**
        @inheritdoc BaseRoundsVaultUpgradeable

        @dev Deposits the available funds into the main vault, receiving back an amount of target vault shares
     */
    function _operate() internal override {
        uint256 shares = totalAssets();
        if (shares > 0) {
            uint256 assets = _redeemFromTarget(shares);

            emit SharesRedeemed(_msgSender(), shares, assets);
        }
    }

    /**
        @inheritdoc BaseRoundsVaultUpgradeable

        @dev The exchange rate is given by the `previewRedeem` function on the target vault. The exchange rate is
        calculated for 1 full share
     */
    function _getExchangeRate() internal view override returns (uint256) {
        return previewRedeem(10**decimals());
    }
}
