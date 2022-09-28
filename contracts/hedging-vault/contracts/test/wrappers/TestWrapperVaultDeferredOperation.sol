/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../rounds/VaultDeferredOperationUpgradeable.sol";

/**
    @title TestWrapperRolesManager

    @author Roberto Cano <robercano>

    @notice Test wrapper for the RolesManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperVaultDeferredOperation is VaultDeferredOperationUpgradeable {
    uint256 public mintId;

    /**
        @notice Initializes the contract
     */
    function initialize(
        address targetVault,
        address asset,
        string calldata uri
    ) external initializer {
        __ERC1155_init_unchained(uri);
        __VaultWithReceipts_init_unchained(IERC20MetadataUpgradeable(asset));
        __VaultDeferredOperation_init_unchained(targetVault);
    }

    function _getMintId() internal virtual override returns (uint256) {
        return mintId;
    }

    function mockSetMintId(uint256 mintId_) external {
        mintId = mintId_;
    }

    function redeemFromTarget(uint256 amount) external returns (uint256) {
        return _redeemFromTarget(amount);
    }

    function depositOnTarget(uint256 amount) external returns (uint256) {
        return _depositOnTarget(amount);
    }
}
