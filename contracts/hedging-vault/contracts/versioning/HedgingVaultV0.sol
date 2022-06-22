/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @title HedgingVaultV0
        
    @author Roberto Cano <robercano>

    @notice Storage and interface for the first version of the Vault
 */
abstract contract HedgingVaultV0 {
    // CONSTANTS

    /**
        @notice The minimum duration of a cycle in seconds
     */
    uint256 public constant MIN_CYCLE_DURATION = 1 days;

    // STORAGE

    /**
        @notice Percentages of the principal assigned to each action in the vault

        @dev The percentages are stored in the form of a uint256 with
        `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    uint256[] public principalPercentages;

    /**
        @notice The duration of the investment cycle in seconds
     */
    uint256 public cycleDurationSeconds;

    /// ERRORS
    error PrincipalPercentagesMismatch(
        uint256 _principalPercentagesLength,
        uint256 _principalPercentagesLengthExpected
    );
    error CycleDurationTooShort(uint256 _cycleDurationSeconds, uint256 _cycleDurationSecondsExpected);

    /// FUNCTIONS

    /**
        @notice Sets the new percentages of the principal assigned to each action in the vault

        @dev Reverts if the number of percentages is not the same as the number of actions in the vault
     */
    function setPrincipalPercentages(uint256[] calldata principalPercentages_) external virtual;

    /**
        @notice Sets the new duration of the investment cycle in seconds

        @dev Reverts is the duration is less than the minimum duration allowed
     */
    function setCycleDuration(uint256 cycleDurationSeconds_) external virtual;

    function commitStrategy() external virtual;

    function enterPosition() external virtual;

    function exitPosition() external virtual;
}
