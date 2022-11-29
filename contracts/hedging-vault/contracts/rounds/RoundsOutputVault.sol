/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@prb/math/contracts/PRBMathUD60x18.sol";
import "../interfaces/IRoundsOutputVault.sol";
import "./BaseRoundsVaultUpgradeable.sol";

/**
    @title RoundsOutputVault

    @notice The RoundsOutputVault contract allows users to deposit shares from the target vault into
    this contract while the  target vault is locked, and receipts are minted to the users for this deposits. Upon
    round completion, the shares are redeemed in the target vault and the corresponding funds are collected.

    Users can then exchange their receipts from previous rounds for the corresponding funds held in this vault.

    @author Roberto Cano <robercano>
 */
contract RoundsOutputVault is BaseRoundsVaultUpgradeable, IRoundsOutputVault {
    using PRBMathUD60x18 for uint256;

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

        address[] memory cannotRefundToken = new address[](2);
        cannotRefundToken[0] = underlyingAsset;
        cannotRefundToken[1] = exchangeAsset_;

        __RolesManager_init_unchained(adminAddress, operatorAddress);
        __RefundsHelper_init_unchained(cannotRefundToken, false);
        __ERC1155_init_unchained(receiptsURI);
        __VaultWithReceipts_init_unchained(IERC20MetadataUpgradeable(underlyingAsset));
        __VaultDeferredOperation_init_unchained(targetVault);
        __BaseRoundsVault_init_unchained(exchangeAsset_);
    }

    // PUBLIC FUNCTIONS

    /**
        @inheritdoc BaseRoundsVaultUpgradeable

        @dev Deposits the available funds into the main vault, receiving back an amount of target vault shares

        @audit This function is protected for re-entrancy by two mechanisms: only the Operator can call
        _nextRound which is the function that in turn calls this function, and the Operator is a trusted
        entity. Also, even if the operator would call nextRound in a re-entrancy attack, the funds are being
        moved from this contract to the InvestmentVault contract and no more funds would be left, leading
        the following code to be a no-op
     */
    function _operate() internal override {
        uint256 shares = totalAssets();
        if (shares > 0) {
            uint256 assets = _redeemFromTarget(shares);

            emit SharesRedeemed(getCurrentRound(), _msgSender(), shares, assets);
        }
    }

    /**
        @inheritdoc BaseRoundsVaultUpgradeable

        @dev The exchange rate is given by the `previewRedeem` function on the target vault. The exchange rate is
        calculated for 1 full share

        @dev This function can only be called while the target vault is unlocked
     */
    function _getCurrentExchangeRate() internal view override returns (uint256) {
        IERC20MetadataUpgradeable asset_ = IERC20MetadataUpgradeable(asset());

        uint256 OneAsset = 10**asset_.decimals();
        uint256 shares = IERC4626Upgradeable(vault()).previewRedeem(OneAsset);

        return shares.fromUint().div(OneAsset.fromUint());
    }
}
