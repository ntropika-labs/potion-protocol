/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../interfaces/IEmergencyLock.sol";
import "../interfaces/IRefundsHelper.sol";
import "../interfaces/IRolesManager.sol";
import "../interfaces/IVaultDeferredOperationUpgradeable.sol";

/**
    @title BaseRoundsVaultUpgradeable

    @notice Provides a way of investing in a target tokenized vault that has investment periods in 
    which the vault is locked. During these locked periods, the vault does not accept deposits, so
    investors need to be on the lookout for the unlocked period to deposit their funds.

    Instead this contract allows investors to deposit their funds at any point in time. In exchange
    they receive a tokenized receipt that is tied to the investment round and contains the amount of
    assets deposited.

    On each round transition, this contract will use the available funds to deposit them into the
    target vault, getting an exchange asset in return. This exchange asset is typically the target
    vault shares when the underlying asset of this vault is the same as the underlying asset of the
    target vault. Otherwise, the exchange asset is the target vault underlying asset.

    The receipts belonging to the current round can always be redeemed immediately for the underlying
    token. 

    The user can also decide to exchange the receipts belonging to previous rounds for the ERC-20 exchange
    asset kept in this contract. The exchange asset can be immediately witdrawn by burning the corresponding
    receipts.

    This contract tracks the current round and also stores the shares price of the each finished round. This
    share price is used to calculate the amount of shares that the user will receive when redeeming a receipt
    for a finished round
            
    @author Roberto Cano <robercano>
 */

// TODO: We are having hierarchy linearization issues here because of the interfaces. Remove them and
// TODO: wait for the next release of the compiler to fix it
interface IBaseRoundsVault is IVaultDeferredOperationUpgradeable {
    // EVENTS
    event NextRound(uint256 indexed newRoundNumber);
    event WithdrawExchangeAsset(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 exchangeAssetAmount,
        uint256 receiptId,
        uint256 receiptAmount
    );
    event WithdrawExchangeAssetBatch(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 exchangeAssetAmount,
        uint256[] receiptIds,
        uint256[] receiptAmounts
    );

    // PUBLIC FUNCTIONS

    /**
        @notice Stores the exchange rate for the last round, operates to push or pull from
        the target vault starts a new round
     
        @dev Only the operator can call this function
     */
    function nextRound() external;

    /**
        @notice Redeems a receipt for a certain amount of target vault shares. The amount of shares is
                calculated based on the receipt's round share price and the amount of underlying tokens
                that the receipt represents

        @param id The id of the receipt to be redeemed
        @param amount The amount of the receipt to be redeemed
        @param receiver The address that will receive the target vault shares
        @param owner The address that owns the receipt, in case the caller is not the owner
     */
    function redeemExchangeAsset(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) external returns (uint256);

    /**
        @notice Same functionality as { redeemForShares } but for multiple receipts at the once

        @dev See { redeemForShares } for more details
     */
    function redeemExchangeAssetBatch(
        uint256[] calldata ids,
        uint256[] calldata amounts,
        address receiver,
        address owner
    ) external returns (uint256 shares);

    /**
        @notice Returns the current round number
     */
    function getCurrentRound() external view returns (uint256);

    /**
        @notice Returns the asset used for the exchange
     */
    function exchangeAsset() external view returns (address);

    /**
        @notice Returns the exchange rate for the underlying to the exchange asset for a given round

        @dev It gives the amount of exchange asset that can be obtained for 1 underlying token, with the
        exchange asset decimals
     */
    function getExchangeRate(uint256 round) external view returns (uint256);
}
