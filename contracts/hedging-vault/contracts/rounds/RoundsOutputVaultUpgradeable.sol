/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./BaseRoundsVaultUpgradeable.sol";

/**
    @title RoundsOutputVaultUpgradeable

    @notice The RoundsOutputVaultUpgradeable contract allows users to deposit shares from the target vault into
    this contract while the  target vault is locked, and receipts are minted to the users for this deposits. Upon
    round completion, the shares are redeemed in the target vault and the corresponding funds are collected.

    Users can then exchange their receipts from previous rounds for the corresponding funds held in this vault.

    @author Roberto Cano <robercano>
 */
contract RoundsOutputVaultUpgradeable is BaseRoundsVaultUpgradeable {
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
        address exchangeAsset = IERC4626Upgradeable(targetVault).asset();
        address underlyingAsset = targetVault;

        __RolesManager_init_unchained(adminAddress, operatorAddress);
        __ERC1155_init_unchained(receiptsURI);
        __ERC4626_init_unchained(IERC20MetadataUpgradeable(underlyingAsset));
        __ERC4626DeferredOperation_init_unchained(targetVault);
        __BaseRoundsVault_init_unchained(exchangeAsset);
    }

    // PUBLIC FUNCTIONS

    /**
        @inheritdoc ERC4626DeferredOperationUpgradeable

        @dev Deposits the available funds into the main vault, receiving back an amount of target vault shares
     */
    function _operate() internal override {
        uint256 amount = totalAssets();
        if (amount > 0) {
            address targetVault = vault();
            SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(asset()), targetVault, amount);
            IERC4626Upgradeable(targetVault).redeem(amount, address(this), address(this));
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

    /**
     * @dev Redeems the available shares into the main vault, receiving back an amount
     *      of underlying tokens
     */
    function _redeemTargetShares() internal {
        uint256 amount = totalAssets();
        if (amount > 0) {
            address targetVault = vault();
            SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(targetVault), targetVault, amount);
            IERC4626Upgradeable(targetVault).redeem(amount, address(this), address(this));
        }
    }
}
