/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../common/EmergencyLockUpgradeable.sol";
import "../common/RefundsHelperUpgreadable.sol";
import "../common/RolesManagerUpgradeable.sol";

import "../openzeppelin/ERC4626DepositsProxyUpgradeable.sol";
import "../openzeppelin/interfaces/IERC4626Upgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./RedeemRequestManager.sol";

/**
    @title RoundsOutputVaultUpgradeable

    @notice Provides a way of redeeming shares of a target tokenized vault that has investment periods in 
            which the vault is locked. During these locked periods, the vault does not accept redemption of
            shares, so investors need to be on the lookout for the unlocked period to redeem their shares.
    
            Instead this contract allows investors to deposit their shares at any point in time. In exchange
            they receive a tokenized receipt that is tied to the investment round and contains the amount of
            shares deposited.

            On each round transition, this contract will use the available shares to redeem them from the
            target vault, getting ERC-20 underlying tokens in return. These underlying tokens are kept in this
            contract and can be accessed later on by the investors.

            The receipts belonging to the current round can always be redeemed immediately for the shares.

            This contract tracks the current round and also stores the shares price of the each finished round. This
            share price is used to calculate the amount of underlying tokens that the user will receive when
            redeeming a receipt for a withdrawal request

    @author Roberto Cano <robercano>
 */
contract RoundsOutputVaultUpgradeable is
    RolesManagerUpgradeable,
    EmergencyLockUpgradeable,
    RefundsHelperUpgreadable,
    ERC4626DepositsProxyUpgradeable
{
    using Counters for Counters.Counter;

    // EVENTS
    event NextRound(uint256 indexed newRoundNumber);

    event WithdrawShares(
        address indexed caller,
        address indexed receiver,
        address indexed owner,
        uint256 id,
        uint256 assetsAmount,
        uint256 sharesAmount
    );

    // STORAGE
    Counters.Counter private _roundNumber;
    mapping(uint256 => uint256) private _roundsSharePrice;

    // UPGRADEABLE INITIALIZER

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
                to the hierarchy will require to review this function to make sure that no initializer
                is called twice, and most importantly, that all initializers are called here

        @param targetVault The vault address for which this input vault is managing deposits
        @param receiptsURI The URI of the ERC-1155 receipts that will be emitted when depositing the underlying
     */
    function initialize(
        address adminAddress,
        address operatorAddress,
        address targetVault,
        string calldata receiptsURI
    ) external initializer {
        __RolesManager_init_unchained(adminAddress, operatorAddress);
        __ERC1155_init_unchained(receiptsURI);
        __ERC4626DeferredDeposits_init_unchained(targetVault);
    }

    // PUBLIC FUNCTIONS

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerableUpgradeable, ERC1155Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            AccessControlEnumerableUpgradeable.supportsInterface(interfaceId) ||
            ERC1155Upgradeable.supportsInterface(interfaceId);
    }

    /**
        @notice Stores the price for the last round, deposits the funds into the target vault and
                starts a new round
     
        @dev Only the operator can call this function
     */
    function nextRound() external onlyOperator {
        // The shares price stays the same before and after our deposit, so we first fetch the current
        // share price and finally we deposit the funds in the target vault
        uint256 tokensPerShare = previewRedeem(1**decimals());

        _roundsSharePrice[_roundNumber.current()] = tokensPerShare;
        _roundNumber.increment();

        _redeemTargetShares();

        emit NextRound(_roundNumber.current());
    }

    /**
        @inheritdoc IERC4626MultiTokenUpgradeable

        @dev This function is overridden because it should only work with receipts for the current round.
        For receipts belonging to previous rounds see { withdrawShares }
    */
    function redeem(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public virtual override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable) returns (uint256) {
        if (_msgSender() != owner) {
            require(
                isApprovedForAll(owner, _msgSender()),
                "RoundsInputVaultUpgradeable: caller is not owner nor approved"
            );
        }

        return _redeem(id, amount, receiver, owner);
    }

    /**
        @notice Same functionality as { redeem } but for multiple receipts at once

        @dev See { redeem } for more details
     */
    function redeemBatch(
        uint256[] memory ids,
        uint256[] memory amounts,
        address receiver,
        address owner
    ) public virtual override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable) returns (uint256 assets) {
        if (_msgSender() != owner) {
            require(
                isApprovedForAll(owner, _msgSender()),
                "RoundsInputVaultUpgradeable: caller is not owner nor approved"
            );
        }

        for (uint256 i = 0; i < ids.length; i++) {
            assets += _redeem(ids[i], amounts[i], receiver, owner);
        }
    }

    /**
        @notice Redeems a receipt for a certain amount of target vault shares. The amount of shares is
                calculated based on the receipt's round share price and the amount of underlying tokens
                that the receipt represents

        @param id The id of the receipt to be redeemed
        @param amount The amount of the receipt to be redeemed
        @param receiver The address that will receive the target vault shares
        @param owner The address that owns the receipt, in case the caller is not the owner

        @dev The user is prevented from redeeming receipts partially as this could cause a cumulative rounding error
        in the amount of shares redeemed by the user. If for example the share price is 0.8 shares/asset and the user
        tries to redeem exactly 1 wei asset, the user would receive 0 shares. Doing this repeatedly would burn away all
        the receipt unit without ever getting any shares from the target vault. Forcing the user to redeem the full
        amount ensures that the behaviour is consistent with depositing the shares directly in the target vault
     */
    function redeemForUnderlying(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public returns (uint256) {
        if (_msgSender() != owner) {
            require(
                isApprovedForAll(owner, _msgSender()),
                "RoundsInputVaultUpgradeable: caller is not owner nor approved"
            );
        }

        return _redeemForUnderlying(id, amount, receiver, owner);
    }

    /**
        @notice Same functionality as { redeemForUnderlying } but for multiple receipts at the once

        @dev See { redeemForUnderlying } for more details
     */
    function redeemBatchForUnderlying(
        uint256[] calldata sharesIds,
        uint256[] calldata sharesAmounts,
        address receiver,
        address owner
    ) public returns (uint256 shares) {
        if (_msgSender() != owner) {
            require(
                isApprovedForAll(owner, _msgSender()),
                "RoundsInputVaultUpgradeable: caller is not owner nor approved"
            );
        }

        for (uint256 i = 0; i < sharesIds.length; i++) {
            shares += _redeemForUnderlying(sharesIds[i], sharesAmounts[i], receiver, owner);
        }
    }

    /**
        @notice Checks if the receipt corresponds to the current round, and if so, it calls the parent function
                to redeem the receipt for the underlying tokens

        @param id The id of the receipt to be redeemed
        @param amount The amount of the receipt to be redeemed
        @param receiver The address that will receive the underlying tokens
        @param owner The address that owns the receipt, in case the caller is not the owner
     */
    function _redeem(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) internal virtual returns (uint256) {
        require(id == _roundNumber.current(), "RoundsInputVaultUpgradeable: can only redeem current round");

        return super.redeem(id, amount, receiver, owner);
    }

    /**
        @notice Checks if the receipt corresponds to any previous round, and if so, it calculates how many shares
                the user should receive based on the receipt's round share price and the amount of deposited tokens

        @param id The id of the receipt to be redeemed
        @param amount The amount of the receipt to be redeemed
        @param receiver The address that will receive the underlying tokens
        @param owner The address that owns the receipt, in case the caller is not the owner
     */
    function _redeemForUnderlying(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) internal returns (uint256 assets) {
        require(id < _roundNumber.current(), "RoundsInputVaultUpgradeable: shares only available for previous rounds");

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burn(owner, id, amount);

        uint256 assetsPerShare = _roundsSharePrice[id];
        assets = amount * assetsPerShare;

        address sharesToken = asset();

        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(sharesToken), receiver, assets);

        emit WithdrawShares(_msgSender(), receiver, owner, id, amount, assets);
    }
}
