// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC1155/IERC1155Upgradeable.sol";
import "../extensions/interfaces/IERC1155DecimalsUpgradeable.sol";
import "../extensions/interfaces/IERC1155FullSupplyUpgradeable.sol";

/**
    @notice Interface of the ERC4626 "Tokenized Vault Standard", modified to emit ERC-1155 receipts.
    When depositing a receipt is generated using an id provided by implementor of this interface.
    The receipt should contain the deposit amount. The id can be used freely to identify extra information
    about the deposit.
    
    @dev The `withdraw` function, along with the `previewWithdraw` and `maxWithdraw` functions
    have been removed because the only way to implement them is to support enumeration
    for the ERC-1155 tokens, which is quite heavy in gas costs.

    @dev Although the only withdrawal functions are `redeem` and `reedeemBatch` the events have been
    kept with the original names `Withdraw` and `WithdrawBatch` for backwards consistency.
 
    @dev This interface is a copy-paste of OpenZeppelin's `IERC4626Upgradeable.sol` with some modifications to
    support the ERC-1155 receipts.

    @author Roberto Cano <robercano>
 */
interface IVaultWithReceiptsUpgradeable is IERC1155DecimalsUpgradeable, IERC1155FullSupplyUpgradeable {
    event DepositWithReceipt(address indexed caller, address indexed owner, uint256 assets, uint256 id);

    event RedeemReceipt(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 amount,
        uint256 id
    );
    event RedeemReceiptBatch(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256[] amounts,
        uint256[] ids
    );

    /**
     * @dev Returns the address of the underlying token used for the Vault for accounting, depositing, and withdrawing.
     *
     * - MUST be an ERC-20 token contract.
     * - MUST NOT revert.
     */
    function asset() external view returns (address assetTokenAddress);

    /**
     * @dev Returns the total amount of the underlying asset that is “managed” by Vault.
     *
     * - SHOULD include any compounding that occurs from yield.
     * - MUST be inclusive of any fees that are charged against assets in the Vault.
     * - MUST NOT revert.
     */
    function totalAssets() external view returns (uint256 totalManagedAssets);

    /**
     * @dev Returns the maximum amount of the underlying asset that can be deposited into the Vault for the receiver,
     * through a deposit call.
     *
     * - MUST return a limited value if receiver is subject to some deposit limit.
     * - MUST return 2 ** 256 - 1 if there is no limit on the maximum amount of assets that may be deposited.
     * - MUST NOT revert.
     */
    function maxDeposit(address receiver) external view returns (uint256 maxAssets);

    /**
     * @dev Mints shares Vault shares with the given id to receiver by depositing exactly amount of underlying tokens.
     *
     * - MUST emit the Deposit event.
     * - MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
     *   deposit execution, and are accounted for during deposit.
     * - MUST revert if all of assets cannot be deposited (due to deposit limit being reached, slippage, the user not
     *   approving enough underlying tokens to the Vault contract, etc).
     *
     * NOTE: most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.
     */
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);

    /**
     * @dev Returns the maximum amount of Vault shares that can be redeemed from the owner balance in the Vault,
     * through a redeem call.
     *
     * - MUST return a limited value if owner is subject to some withdrawal limit or timelock.
     * - MUST return balanceOf(owner) if owner is not subject to any withdrawal limit or timelock.
     * - MUST NOT revert.
     */
    function maxRedeem(address owner) external view returns (uint256 maxShares);

    /**
     * @dev Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block,
     * given current on-chain conditions.
     *
     * - MUST return as close to and no more than the exact amount of assets that would be withdrawn in a redeem call
     *   in the same transaction. I.e. redeem should return the same or more assets as previewRedeem if called in the
     *   same transaction.
     * - MUST NOT account for redemption limits like those returned from maxRedeem and should always act as though the
     *   redemption would be accepted, regardless if the user has enough shares, etc.
     * - MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
     * - MUST NOT revert.
     *
     * NOTE: any unfavorable discrepancy between convertToAssets and previewRedeem SHOULD be considered slippage in
     * share price or some other type of condition, meaning the depositor will lose assets by redeeming.
     */
    function previewRedeem(uint256 shares) external view returns (uint256 assets);

    /**
     * @dev Burns exactly shares from owner and sends assets of underlying tokens to receiver.
     *
     * - MUST emit the Withdraw event.
     * - MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
     *   redeem execution, and are accounted for during redeem.
     * - MUST revert if all of shares cannot be redeemed (due to withdrawal limit being reached, slippage, the owner
     *   not having enough shares, etc).
     *
     * NOTE: some implementations will require pre-requesting to the Vault before a withdrawal may be performed.
     * Those methods should be performed separately.
     */
    function redeem(
        uint256 sharesId,
        uint256 sharesAmount,
        address receiver,
        address owner
    ) external returns (uint256 assets);

    /**
     * @dev Burns each batch of shares and the specific amounts and sends assets of underlying tokens to receiver.
     *
     * - MUST emit the WithdrawBatch event.
     * - MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
     *   redeem execution, and are accounted for during redeem.
     * - MUST revert if all of shares cannot be redeemed (due to withdrawal limit being reached, slippage, the owner
     *   not having enough shares, etc).
     *
     * NOTE: some implementations will require pre-requesting to the Vault before a withdrawal may be performed.
     * Those methods should be performed separately.
     */
    function redeemBatch(
        uint256[] memory sharesIds,
        uint256[] memory sharesAmounts,
        address receiver,
        address owner
    ) external returns (uint256 assets);
}
