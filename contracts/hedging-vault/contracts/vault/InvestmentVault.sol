/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./BaseVaultUpgradeable.sol";
import "../versioning/InvestmentVaultV0.sol";
import "../library/PercentageUtils.sol";

/**
    @title InvestmentVault

    @author Roberto Cano <robercano>
    
    @notice Investment Vault contract that implements an investment strategy via the configured actions in the vault

    @dev The responsibility of the Vault is to accept immediate deposits and withdrawals while the vault is in the Unlocked state.
    Then when the position is entered, it executes the investment actions in the configured order. If all actions succeed,
    then the Vault is Locked and no more deposits or withdrawals are allowed. The moment the position can be exited, the vault
    exits the position of all actions, also in order, and receives back the remaining funds, including profit or loss

    TODO: Explain the current version of the vault in detail
    
    @dev See {BaseVaultUpgradeable}
 */

contract InvestmentVault is BaseVaultUpgradeable, InvestmentVaultV0 {
    using PercentageUtils for uint256;
    using SafeERC20 for IERC20;

    /**
        @inheritdoc IVault
     */
    function enterPosition() external onlyOperator onlyUnlocked nonReentrant {
        _setLifecycleState(LifecycleState.Locked);

        uint256 totalPrincipalAmount = totalAssets();

        uint256 maxAmountToInvest = totalPrincipalPercentages.applyPercentage(totalPrincipalAmount);
        uint256 actualAmountInvested = 0;
        address investmentAsset = asset();

        uint256 numActions = getActionsLength();

        for (uint256 i = 0; i < numActions; i++) {
            IAction action = getAction(i);

            uint256 amountToInvest = principalPercentages[i].applyPercentage(totalPrincipalAmount);

            IERC20(investmentAsset).safeApprove(address(action), amountToInvest);

            action.enterPosition(investmentAsset, amountToInvest);

            actualAmountInvested += amountToInvest;
        }

        if (actualAmountInvested > maxAmountToInvest) {
            revert InvestmentTotalTooHigh(actualAmountInvested, maxAmountToInvest);
        }

        emit VaultPositionEntered(totalPrincipalAmount, actualAmountInvested);
    }

    /**
        @inheritdoc IVault
     */
    function exitPosition() external onlyOperator onlyLocked nonReentrant returns (uint256 newPrincipalAmount) {
        address investmentAsset = asset();

        uint256 totalAmountReturned = 0;

        uint256 numActions = getActionsLength();

        for (uint256 i = 0; i < numActions; i++) {
            IAction action = getAction(i);

            totalAmountReturned += action.exitPosition(investmentAsset);
        }

        _setLifecycleState(LifecycleState.Unlocked);

        newPrincipalAmount = totalAssets();

        emit VaultPositionExited(newPrincipalAmount);
    }

    /**
        @inheritdoc IVault
     */
    function canPositionBeExited() external view returns (bool canExit) {
        uint256 numActions = getActionsLength();

        for (uint256 i = 0; i < numActions; i++) {
            IAction action = getAction(i);

            if (!action.canPositionBeExited(asset())) {
                return false;
            }
        }

        assert(getLifecycleState() == LifecycleState.Locked);

        return true;
    }

    /**
        @inheritdoc IVault
     */
    function canPositionBeEntered() external view returns (bool canEnter) {
        uint256 numActions = getActionsLength();

        for (uint256 i = 0; i < numActions; i++) {
            IAction action = getAction(i);

            if (!action.canPositionBeEntered(asset())) {
                return false;
            }
        }

        assert(getLifecycleState() == LifecycleState.Unlocked);

        return true;
    }

    /**
        @inheritdoc InvestmentVaultV0
     */
    function setPrincipalPercentages(uint256[] calldata newPrincipalPercentages) external override onlyStrategist {
        uint256 numActions = getActionsLength();

        if (newPrincipalPercentages.length != numActions) {
            revert PrincipalPercentagesMismatch(newPrincipalPercentages.length, numActions);
        }

        principalPercentages = new uint256[](newPrincipalPercentages.length);
        totalPrincipalPercentages = 0;

        for (uint256 i = 0; i < newPrincipalPercentages.length; i++) {
            if (newPrincipalPercentages[i] == 0 || newPrincipalPercentages[i] > 100) {
                revert PrincipalPercentageOutOfRange(i, newPrincipalPercentages[i]);
            }

            principalPercentages[i] = newPrincipalPercentages[i];
            totalPrincipalPercentages += newPrincipalPercentages[i];
        }

        if (totalPrincipalPercentages > PercentageUtils.PERCENTAGE_100) {
            revert PrincipalPercentagesSumMoreThan100(totalPrincipalPercentages);
        }

        emit PrincipalPercentagesUpdated(newPrincipalPercentages);
    }

    /**
        @inheritdoc ERC4626Upgradeable
     */
    function deposit(uint256 assets, address receiver) public override onlyUnlocked returns (uint256) {
        return super.deposit(assets, receiver);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function mint(uint256 shares, address receiver) public override onlyUnlocked returns (uint256) {
        return super.mint(shares, receiver);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override onlyUnlocked returns (uint256) {
        return super.withdraw(assets, receiver, owner);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override onlyUnlocked returns (uint256) {
        return super.redeem(shares, receiver, owner);
    }
}
