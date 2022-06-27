/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IInvestmentVaultV0 } from "../interfaces/IInvestmentVaultV0.sol";

/**    
    @title InvestmentVaultV0
        
    @author Roberto Cano <robercano>

    @notice Storage for the first version of the Investment Vault
 */
abstract contract InvestmentVaultV0 is IInvestmentVaultV0 {
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
}
