/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../rounds/BaseRoundsVaultUpgradeable.sol";

/**
    @title TestWrapperRolesManager

    @author Roberto Cano <robercano>

    @notice Test wrapper for the RolesManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperBaseRoundsVaultUpgradeable is BaseRoundsVaultUpgradeable {
    uint256 public exchangeRate;

    /**
        @notice Initializes the contract
     */
    function initialize(
        address targetVault,
        address underlyingAsset,
        address exchangeAsset_,
        string calldata uri
    ) external initializer {
        __ERC1155_init_unchained(uri);
        __VaultWithReceipts_init_unchained(IERC20MetadataUpgradeable(underlyingAsset));
        __VaultDeferredOperation_init_unchained(targetVault);
        __BaseRoundsVault_init_unchained(exchangeAsset_);
    }

    function _operate() internal virtual override {}

    function _getExchangeRate() internal view virtual override returns (uint256) {
        return exchangeRate;
    }

    function mockSetExchangeRate(uint256 exchangeRate_) external {
        exchangeRate = exchangeRate_;
    }
}
