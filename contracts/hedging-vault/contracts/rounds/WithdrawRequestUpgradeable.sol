/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

// contract WithdrawRequestUpgradeable {
//     function requestWithdrawAssets(
//         uint256 receiptId,
//         uint256 amount,
//         address receiver,
//         address owner
//     ) external {
//         if (_msgSender() != owner) {
//             require(isApprovedForAll(owner, caller), "RoundsInputVaultUpgradeable: caller is not owner nor approved");
//         }

//         // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
//         // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
//         // calls the vault, which is assumed not malicious.
//         //
//         // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
//         // shares are burned and after the assets are transfered, which is a valid state.
//         _burn(owner, id, amount);

//         uint256 sharesPerAsset = _roundsSharePrice[id];
//         uint256 shares = amount * sharesPerAsset;

//         outputVault.deposit(shares); // TODO
//     }
// }
