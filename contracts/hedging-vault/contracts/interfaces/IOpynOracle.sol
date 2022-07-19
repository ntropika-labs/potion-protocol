// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

/**
    @notice Opyn Oracle interface, used to retrieve the prices of assets
 */
interface IOpynOracle {
    /**
       @notice get a live asset price from the asset's pricer contract
       @param _asset asset address
       @return price scaled by 1e8, denominated in USD
               e.g. 17568900000 => 175.689 USD
     */
    function getPrice(address _asset) external view returns (uint256);
}
