/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IRefundsHelper } from "../interfaces/IRefundsHelper.sol";
import { RolesManagerUpgradeable } from "./RolesManagerUpgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/IERC20Upgradeable.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { AddressUpgradeable as Address } from "@openzeppelin/contracts-upgradeable-4.7.3/utils/AddressUpgradeable.sol";

/**
    @title RefundsHelperUpgreadable

    @author Roberto Cano <robercano>
    
    @notice See { IRefundsHelper}

    @dev It inherits from the RolesManagerUpgradeable contract to scope the refund functions
    for only the Admin role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the vault. The initialization will happen in the Vault and
    Action contract

    @dev No storage gaps have been added as the functionlity of this contract is considered to be
    final and there is no need to add more storage variables
 */

contract RefundsHelperUpgreadable is RolesManagerUpgradeable, IRefundsHelper {
    using Address for address payable;

    /// STORAGE

    /**
        @notice The list of tokens that cannot be refunded

        @dev The list is populated at construction time and cannot be changed. For this purpose it
        is private and there is no setter function for it
    */
    mapping(address => bool) private _cannotRefund;

    /**
        @notice Flag to indicate if ETH can be refunded or not

        @dev The flag is set at initialization time and cannot be changed afterwards. For this
        purpose it is private and there is no setter function for it
    */
    bool private _cannotRefundETH;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Marks the given token addresses as `non-refundable`

        @param _cannotRefundToken The list of token addresses that cannot be refunded

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize the RolesManagerUpgradeable contract
     */
    /* solhint-disable-next-line func-name-mixedcase */
    function __RefundsHelper_init_unchained(address[] memory _cannotRefundToken, bool cannotRefundETH_)
        internal
        onlyInitializing
    {
        for (uint256 i = 0; i < _cannotRefundToken.length; i++) {
            _cannotRefund[_cannotRefundToken[i]] = true;
        }

        _cannotRefundETH = cannotRefundETH_;
    }

    /// FUNCTIONS

    /**
        @inheritdoc IRefundsHelper

        @dev This function can be only called by the admin and only if the token is not in the
        list of tokens that cannot be refunded.
     */
    function refund(
        address token,
        uint256 amount,
        address recipient
    ) external onlyAdmin {
        require(!_cannotRefund[token], "Token cannot be refunded");
        require(recipient != address(0), "Recipient address cannot be the null address");

        SafeERC20.safeTransfer(IERC20(token), recipient, amount);
    }

    /**
        @inheritdoc IRefundsHelper

        @dev This function can be only called by the admin and only if ETH is allowed to be
        refunded
     */
    function refundETH(uint256 amount, address payable recipient) external onlyAdmin {
        require(!_cannotRefundETH, "ETH cannot be refunded");
        require(recipient != address(0), "Recipient address cannot be the null address");

        recipient.sendValue(amount);
    }

    /// GETTERS

    /**
        @inheritdoc IRefundsHelper
     */
    function canRefund(address token) public view returns (bool) {
        return !_cannotRefund[token];
    }

    /**
        @inheritdoc IRefundsHelper
     */
    function canRefundETH() public view returns (bool) {
        return !_cannotRefundETH;
    }
}
