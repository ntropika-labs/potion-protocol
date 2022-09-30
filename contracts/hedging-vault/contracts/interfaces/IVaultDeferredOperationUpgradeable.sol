// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "./IVaultWithReceiptsUpgradeable.sol";

/**
 * @notice Interface of the ERC4626 "Tokenized Vault Standard", modified to emit ERC-1155 share tokens
 *         When depositing, the user of this contract must indicate for which id they are depositing. The
 *         emitted ERC-1155 token will be minted used that id, thus generating a receipt for the deposit
 *
 * @dev The `withdraw` function, along with the `previewWithdraw` and `maxWithdraw` functions
 *      have been removed because the only way to implement them is to support enumeration
 *      for the ERC-1155 tokens, which is quite heavy in gas costs.
 *
 * @author Roberto Cano <robercano>
 */
interface IVaultDeferredOperationUpgradeable is IVaultWithReceiptsUpgradeable {
    /**
     * @dev Returns the target vault for which this vault is accepting deposits
     */
    function vault() external view returns (address vaultAddress);
}
