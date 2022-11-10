/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./BaseVaultUpgradeable.sol";
import "../library/PercentageUtils.sol";
import "../versioning/InvestmentVaultV0.sol";

import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/IERC20Upgradeable.sol";

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

    // UPGRADEABLE INITIALIZER

    /**
        @custom:member adminAddress The address of the admin of the Vault
        @custom:member strategistAddress The address of the strategist of the Vault
        @custom:member operatorAddress The address of the operator of the Vault
        @custom:member underlyingAsset The address of the asset managed by this vault
        @custom:member underlyingAssetCap The cap on the amount of principal that the vault can manage
        @custom:member managementFee The fee percentage charged for the management of the Vault
        @custom:member performanceFee The fee percentage charged for the performance of the Vault
        @custom:member feesRecipient The address of the account that will receive the fees
        @custom:member actions The list of investment actions to be executed in the Vault
        @custom:member principalPercentages The list of principal percentages for the default strategy
        @custom:member sharesName The name of the shares token
        @custom:member sharesSymbol The symbol of the shares token
     */
    struct InvestmentVaultInitParams {
        address adminAddress;
        address strategistAddress;
        address operatorAddress;
        address underlyingAsset;
        uint256 underlyingAssetCap;
        uint256 managementFee;
        uint256 performanceFee;
        address payable feesRecipient;
        IAction[] actions;
        uint256[] principalPercentages;
        string sharesName;
        string sharesSymbol;
    }

    /// INITIALIZERS

    /**
       @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here

        @param initParams Initialization parameters for the Investment Vault

        @dev See { InvestmentVaultInitParams }

     */
    function initialize(InvestmentVaultInitParams calldata initParams) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the underlying
        // asset is not allowed to be refunded to prevent the admin from accidentally refunding the
        // underlying asset
        address[] memory cannotRefundToken = new address[](1);
        cannotRefundToken[0] = initParams.underlyingAsset;

        __RolesManager_init_unchained(initParams.adminAddress, initParams.operatorAddress);
        __ERC20_init_unchained(initParams.sharesName, initParams.sharesSymbol);
        __ERC4626Cap_init_unchained(initParams.underlyingAssetCap, initParams.underlyingAsset);
        __EmergencyLock_init_unchained();
        __LifecycleStates_init_unchained();
        __RefundsHelper_init_unchained(cannotRefundToken, false);
        __FeeManager_init_unchained(initParams.managementFee, initParams.performanceFee, initParams.feesRecipient);
        __ActionsManager_init_unchained(initParams.actions);
        __ReentrancyGuard_init_unchained();

        _grantRole(RolesManagerUpgradeable.STRATEGIST_ROLE, initParams.strategistAddress);
        _setDefaultStrategy(initParams.actions, initParams.principalPercentages);
    }

    /// STATE CHANGERS

    /**
        @inheritdoc IVaultV0
     */
    function enterPosition() external onlyOperator onlyUnlocked nonReentrant {
        _enterPosition(DefaultStrategy);
    }

    /**
        @inheritdoc IVaultV0
     */
    function enterPositionWith(Strategy calldata strategy) external onlyOperator onlyUnlocked nonReentrant {
        _enterPosition(strategy);
    }

    /**
        @inheritdoc IVaultV0
     */
    function exitPosition() external onlyOperator onlyLocked nonReentrant returns (uint256 newPrincipalAmount) {
        address investmentAsset = asset();

        uint256 totalAmountReturned = 0;

        uint256 numActions = _lastStrategy.actionsIndexes.length;

        for (uint256 i = 0; i < numActions; i++) {
            uint256 actionIndex = _lastStrategy.actionsIndexes[i];
            IAction action = getAction(actionIndex);

            totalAmountReturned += action.exitPosition(investmentAsset);

            IERC20(investmentAsset).safeApprove(address(action), 0);
        }

        _setLifecycleState(LifecycleState.Unlocked);

        newPrincipalAmount = totalAssets();

        // TODO: Apply fees here

        emit VaultPositionExited(newPrincipalAmount, _lastStrategy);
    }

    /**
        @inheritdoc ERC4626Upgradeable
     */
    function deposit(uint256 assets, address receiver)
        public
        override(ERC4626Upgradeable, IERC4626Upgradeable)
        onlyUnlocked
        onlyInvestor
        returns (uint256)
    {
        return super.deposit(assets, receiver);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function mint(uint256 shares, address receiver)
        public
        override(ERC4626Upgradeable, IERC4626Upgradeable)
        onlyUnlocked
        onlyInvestor
        returns (uint256)
    {
        return super.mint(shares, receiver);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override(ERC4626Upgradeable, IERC4626Upgradeable) onlyUnlocked onlyInvestor returns (uint256) {
        return super.withdraw(assets, receiver, owner);
    }

    /**
        @inheritdoc ERC4626Upgradeable
    */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override(ERC4626Upgradeable, IERC4626Upgradeable) onlyUnlocked onlyInvestor returns (uint256) {
        return super.redeem(shares, receiver, owner);
    }

    /// GETTERS

    /**
        @inheritdoc IVaultV0
     */
    function canPositionBeEntered() external view returns (bool canEnter) {
        return _canPositionBeEnteredWith(DefaultStrategy);
    }

    /**
        @inheritdoc IVaultV0
     */
    function canPositionBeEnteredWith(Strategy calldata strategy) external view returns (bool canEnter) {
        return _canPositionBeEnteredWith(strategy);
    }

    /**
        @inheritdoc IVaultV0
     */
    function canPositionBeExited() external view returns (bool canExit) {
        uint256 numActions = _lastStrategy.actionsIndexes.length;
        address investmentAsset = asset();

        for (uint256 i = 0; i < numActions; i++) {
            uint256 actionIndex = _lastStrategy.actionsIndexes[i];
            IAction action = getAction(actionIndex);

            if (!action.canPositionBeExited(investmentAsset)) {
                return false;
            }
        }

        return true;
    }

    /// INTERNALS

    /**
        @notice Sets the default strategy that will be used when no strategy is given in the `enterPosition` call

        @param actions The list of actions to be executed in the strategy
        @param principalPercentages The list of percentages of the principal that will be used for each action

        @dev The length of the actions and principalPercentages arrays must be the same
     */
    function _setDefaultStrategy(IAction[] calldata actions, uint256[] calldata principalPercentages) private {
        if (principalPercentages.length != actions.length) {
            revert PrincipalPercentagesMismatch(actions.length, principalPercentages.length);
        }

        for (uint256 i = 0; i < actions.length; i++) {
            uint256 percentage = principalPercentages[i];

            // If the percentage is 0, skip this action for the default strategy
            if (percentage == 0) {
                continue;
            }

            DefaultStrategy.actionsIndexes.push(i);
            DefaultStrategy.principalPercentages.push(percentage);
        }
    }

    /**
        @notice See { setPrincipalPercentages }
     */
    function _validatePrincipalPercentages(Strategy memory strategy) private pure returns (uint256 totalPercentage) {
        uint256 numActions = strategy.actionsIndexes.length;
        uint256 numPercentages = strategy.principalPercentages.length;

        if (numPercentages != numActions) {
            revert PrincipalPercentagesMismatch(strategy.actionsIndexes.length, strategy.principalPercentages.length);
        }

        uint256 sumPrincipalPercentages = 0;

        for (uint256 i = 0; i < numPercentages; i++) {
            uint256 percentage = strategy.principalPercentages[i];
            if (percentage > PercentageUtils.PERCENTAGE_100) {
                revert PrincipalPercentageOutOfRange(strategy, i);
            }

            sumPrincipalPercentages += percentage;
        }

        if (sumPrincipalPercentages > PercentageUtils.PERCENTAGE_100) {
            revert PrincipalPercentagesSumMoreThan100(strategy);
        }

        return sumPrincipalPercentages;
    }

    /**
        @notice Enters a position in the Vault. The strategy is used to determine the actions to be
                executed in order to enter the position

        @param strategy The strategy to be used to enter the position
     */
    function _enterPosition(Strategy memory strategy) private {
        _setLifecycleState(LifecycleState.Locked);

        uint256 totalPercentage = _validatePrincipalPercentages(strategy);

        uint256 totalPrincipalAmount = totalAssets();

        uint256 maxAmountToInvest = totalPercentage.applyPercentage(totalPrincipalAmount);
        uint256 actualAmountInvested = 0;
        address investmentAsset = asset();

        uint256 numActions = strategy.actionsIndexes.length;

        for (uint256 i = 0; i < numActions; i++) {
            uint256 actionIndex = strategy.actionsIndexes[i];

            IAction action = getAction(actionIndex);

            uint256 amountToInvest = strategy.principalPercentages[i].applyPercentage(totalPrincipalAmount);

            IERC20(investmentAsset).safeApprove(address(action), amountToInvest);

            action.enterPosition(investmentAsset, amountToInvest);

            actualAmountInvested += amountToInvest;
        }

        if (actualAmountInvested > maxAmountToInvest) {
            revert InvestmentTotalTooHigh(actualAmountInvested, maxAmountToInvest);
        }

        _lastStrategy = strategy;

        emit VaultPositionEntered(totalPrincipalAmount, actualAmountInvested, strategy);
    }

    /**
        @notice Checks if the position can be entered for the given strategy

        @param strategy The strategy to be used to enter the position

        @return canEnter True if the position can be entered for the given strategy, false otherwise
     */
    function _canPositionBeEnteredWith(Strategy memory strategy) private view returns (bool canEnter) {
        uint256 numActions = strategy.actionsIndexes.length;
        address investmentAsset = asset();

        for (uint256 i = 0; i < numActions; i++) {
            uint256 actionIndex = strategy.actionsIndexes[i];
            IAction action = getAction(actionIndex);

            if (!action.canPositionBeEntered(investmentAsset)) {
                return false;
            }
        }

        return true;
    }
}
