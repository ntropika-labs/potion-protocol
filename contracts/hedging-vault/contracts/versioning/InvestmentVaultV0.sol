/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @title InvestmentVaultV0
        
    @author Roberto Cano <robercano>

    @notice Storage and interface for the first version of the Investment Vault
 */
abstract contract InvestmentVaultV0 {
    // STORAGE

    /**
        @notice Percentages of the principal assigned to each action in the vault

        @dev The percentages are stored in the form of a uint256 with
        `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    uint256[] public principalPercentages;

    /**
        @notice Sum of all the principal percentages

        @dev Used to do sanity checks on the operations of the vault
     */
    uint256 public totalPrincipalPercentages;

    /// ERRORS
    error PrincipalPercentagesMismatch(
        uint256 _principalPercentagesLength,
        uint256 _principalPercentagesLengthExpected
    );
    error PrincipalPercentageOutOfRange(uint256 index, uint256 value);
    error PrincipalPercentagesSumMoreThan100(uint256 totalSumOfPercentages);
    error InvestmentTotalTooHigh(uint256 totalInvestment, uint256 expectedMaxInvestment);

    /// EVENTS
    event PrincipalPercentagesUpdated(uint256[] principalPercentages);

    /// FUNCTIONS

    /**
        @notice Sets the new percentages of the principal assigned to each action in the vault

        @dev Reverts if the number of percentages is not the same as the number of actions in the vault
     */
    function setPrincipalPercentages(uint256[] calldata principalPercentages_) external virtual;
}
