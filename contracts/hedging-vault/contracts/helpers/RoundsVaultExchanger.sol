/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/IERC20Upgradeable.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

import "../interfaces/IBaseRoundsVault.sol";

/**
    @notice This helper contract allows the user to exchange a receipt from the RoundsInputVaultUpgradeable
    for a ticket from the RoundsOutputVaultUpgradeable. This is done by burning the receipt in exchange
    for the corresponding amount of the main vault shares in the RoundsInputVaultUpgradeable, and then
    depositing this shares into the RoundsOutputVaultUpgradeable, which will mint the corresponding
    receipt to the user.

    After this operation is completed, the user has a receipt that can be exchanged for the main vaults
    underlying once the current round is over.
 */
contract RoundsVaultExchanger is Context {
    /**
      @notice Exchanges a receipt from the RoundsInputVaultUpgradeable for a receipt from
      the RoundsOutputVaultUpgradeable by redeeming the input receipt in the input vault for
      shares and then depositing these shares into the output vault in exchange for an output
      receipt

      @param inputVault The address of the RoundsInputVaultUpgradeable
      @param outputVault The address of the RoundsOutputVaultUpgradeable
      @param id The id of the receipt to exchange
      @param amount The amount of the receipt to exchange

      @dev The receipt must be for a previous round. If it is for the current round
      the transaction will revert

      @return The amount of shares deposited in the output vault
    */
    function exchangeInputForOutput(
        IBaseRoundsVault inputVault,
        IBaseRoundsVault outputVault,
        uint256 id,
        uint256 amount
    ) external returns (uint256) {
        uint256 sharesAmount = inputVault.redeemExchangeAsset(id, amount, address(this), _msgSender());

        SafeERC20.safeApprove(IERC20(inputVault.exchangeAsset()), address(outputVault), sharesAmount);

        return outputVault.deposit(sharesAmount, _msgSender());
    }

    /**
      @notice Exchanges a list of receipts from the RoundsInputVaultUpgradeable for a receipt from
      the RoundsOutputVaultUpgradeable by redeeming the input receipts in the input vault for
      shares and then depositing these shares into the output vault in exchange for an output
      receipt

      @param inputVault The address of the RoundsInputVaultUpgradeable
      @param outputVault The address of the RoundsOutputVaultUpgradeable
      @param ids The ids of the receipts to exchange
      @param amounts The amounts of the receipts to exchange

      @dev All receipts must be for a previous round. If any of the receipts is for the current round
      the transaction will revert

      @return The amount of shares deposited in the output vault
    */
    function exchangeInputForOutputBatch(
        IBaseRoundsVault inputVault,
        IBaseRoundsVault outputVault,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external returns (uint256) {
        uint256 sharesAmount = inputVault.redeemExchangeAssetBatch(ids, amounts, address(this), _msgSender());

        SafeERC20.safeApprove(IERC20(inputVault.exchangeAsset()), address(outputVault), sharesAmount);

        return outputVault.deposit(sharesAmount, _msgSender());
    }
}
