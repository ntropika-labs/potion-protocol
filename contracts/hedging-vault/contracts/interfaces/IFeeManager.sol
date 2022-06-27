/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title IFeeManager

    @author Roberto Cano <robercano>
    
    @notice Handles the fees that the vault fees payment to the configured recipients

    @dev The contract uses PercentageUtils to handle the fee percentages. See { PercentageUtils } for
    more information on the format and precision of the percentages.
 */

interface IFeeManager {
    /// EVENTS
    event ManagementFeeChanged(uint256 oldManagementFee, uint256 newManagementFee);
    event PerformanceFeeChanged(uint256 oldPerformanceFee, uint256 newPerformanceFee);
    event FeesReceipientChanged(address indexed oldFeeReceipient, address indexed newFeeReceipient);
    event FeesSent(
        address indexed receipient,
        address indexed token,
        uint256 managementAmount,
        uint256 performanceAmount
    );
    event FeesETHSent(address indexed receipient, uint256 managementAmount, uint256 performanceAmount);

    /// FUNCTIONS

    /**
        @notice Sets the new management fee

        @param newManagementFee The new management fee in fixed point format (See { PercentageUtils })
     */
    function setManagementFee(uint256 newManagementFee) external;

    /**
        @notice Sets the new performance fee

        @param newPerformanceFee The new performance fee in fixed point format (See { PercentageUtils })
     */
    function setPerformanceFee(uint256 newPerformanceFee) external;

    /**
        @notice Returns the current management fee

        @return The current management fee in fixed point format (See { PercentageUtils })
     */
    function getManagementFee() external view returns (uint256);

    /**
        @notice Returns the current performance fee

        @return The current performance fee in fixed point format (See { PercentageUtils })
     */
    function getPerformanceFee() external view returns (uint256);

    /**
        @notice Sets the new performance fee
     */
    function setFeesRecipient(address payable newFeesRecipient) external;
}
