/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title IRefundsHelper

    @author Roberto Cano <robercano>
    
    @notice Helper contract that allows the Admin to refund tokens or ETH sent to the vault
    by mistake. At construction time it receives the list of tokens that cannot be refunded.
    Those tokens are typically the asset managed by the vault and any intermediary tokens
    that the vault may use to manage the asset.
 */
interface IRefundsHelper {
    /// FUNCTIONS

    /**
        @notice Refunds the given amount of tokens to the given address
        @param token address of the token to be refunded
        @param amount amount of tokens to be refunded
        @param recipient address to which the tokens will be refunded
     */
    function refund(
        address token,
        uint256 amount,
        address recipient
    ) external;

    /**
        @notice Refunds the given amount of ETH to the given address
        @param amount amount of tokens to be refunded
        @param recipient address to which the tokens will be refunded
     */
    function refundETH(uint256 amount, address payable recipient) external;

    /// GETTERS

    /**
        @notice Returns whether the given token is refundable or not

        @param token address of the token to be checked

        @return true if the token is refundable, false otherwise
     */
    function canRefund(address token) external view returns (bool);

    /**
        @notice Returns whether the ETH is refundable or not

        @return true if ETH is refundable, false otherwise
     */
    function canRefundETH() external view returns (bool);
}
