/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { RolesManagerUpgradeable } from "./RolesManagerUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
    @title RefundsHelperUpgreadable

    @notice Helper contract that allows the Admin to refund tokens or ETH sent to the vault
    by mistake. At construction time it receives the list of tokens that cannot be refunded.
    Those tokens are typically the asset managed by the vault and any intermediary tokens
    that the vault may use to manage the asset.

    @dev It inherits from the RolesManagerUpgradeable contract to scope the refund functions
    for only the Admin role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the vault. The initialization will happen in the Vault and
    Action contract

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables
 */

contract RefundsHelperUpgreadable is RolesManagerUpgradeable {
    /// STORAGE

    /**
      @notice The list of tokens that cannot be refunded

      @dev The list is populated at construction time and cannot be changed. For this purpose it
      is private and there is no setter function for it
    */
    mapping(address => bool) private cannotRefund;

    /// UPGRADEABLE INITIALIZERS
    // solhint-disable-next-line func-name-mixedcase
    function __RefundsHelper_init_unchained(address[] memory _cannotRefund) internal onlyInitializing {
        for (uint256 i = 0; i < _cannotRefund.length; i++) {
            cannotRefund[_cannotRefund[i]] = true;
        }
    }

    /// FUNCTIONS

    /**
        @notice Refunds the given amount of tokens to the given address
        @param token address of the token to be refunded
        @param amount amount of tokens to be refunded
        @param recipient address to which the tokens will be refunded

        @dev This function can be only called by the admin and only if the token is not in the
        list of tokens that cannot be refunded.
     */
    function refund(
        address token,
        uint256 amount,
        address recipient
    ) external onlyAdmin {
        require(!cannotRefund[token], "Token cannot be refunded");
        require(recipient != address(0), "Recipient address cannot be the null address");

        SafeERC20.safeTransfer(IERC20(token), recipient, amount);
    }
}
