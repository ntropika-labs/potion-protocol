/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../common/EmergencyLockUpgradeable.sol";
import "../common/RefundsHelperUpgreadable.sol";
import "../common/RolesManagerUpgradeable.sol";

import "../extensions/ERC4626DeferredOperationUpgradeable.sol";
import "../openzeppelin/interfaces/IERC4626Upgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IBaseRoundsVault.sol";

/**
    @title BaseRoundsVaultUpgradeable

    @notice Provides a way of investing in a target tokenized vault that has investment periods in 
    which the vault is locked. During these locked periods, the vault does not accept deposits, so
    investors need to be on the lookout for the unlocked period to deposit their funds.

    @dev See { IBaseRoundsVault } for more details.

    @dev Here the `_operate` function is defined as a pure virtual function. This is because the
    specific logic when moving to the next round is left to the derived contracts. Typically they
    will use the `_redeemFromTarget` or `_depositOnTarget` functions to move the funds in or out
    of this vault.
            
    @author Roberto Cano <robercano>
 */
abstract contract BaseRoundsVaultUpgradeable is
    RolesManagerUpgradeable,
    EmergencyLockUpgradeable,
    RefundsHelperUpgreadable,
    ERC4626DeferredOperationUpgradeable,
    IBaseRoundsVault
{
    using Counters for Counters.Counter;

    // STORAGE
    Counters.Counter private _roundNumber;
    mapping(uint256 => uint256) private _exchangeRateByRound;
    address private _exchangeAsset;

    // UPGRADABLE INITIALIZERS
    function __BaseRoundsVault_init(address exchangeAsset_) internal onlyInitializing {
        __BaseRoundsVault_init_unchained(exchangeAsset_);
    }

    function __BaseRoundsVault_init_unchained(address exchangeAsset_) internal onlyInitializing {
        _exchangeAsset = exchangeAsset_;
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
        @inheritdoc IBaseRoundsVault
     */
    function nextRound() external onlyOperator {
        _exchangeRateByRound[_roundNumber.current()] = _getExchangeRate();
        _roundNumber.increment();

        _operate();

        emit NextRound(_roundNumber.current());
    }

    /**
        @inheritdoc IERC4626MultiTokenUpgradeable
     */
    function redeem(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public virtual override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable) returns (uint256) {
        require(id == _roundNumber.current(), "RoundsInputVaultUpgradeable: can only redeem current round");

        return super.redeem(id, amount, receiver, owner);
    }

    /**
        @inheritdoc IERC4626MultiTokenUpgradeable
     */
    function redeemBatch(
        uint256[] memory ids,
        uint256[] memory amounts,
        address receiver,
        address owner
    ) public virtual override(ERC4626MultiTokenUpgradeable, IERC4626MultiTokenUpgradeable) returns (uint256 assets) {
        for (uint256 i = 0; i < ids.length; i++) {
            require(ids[i] == _roundNumber.current(), "RoundsInputVaultUpgradeable: can only redeem current round");
        }

        return super.redeemBatch(ids, amounts, receiver, owner);
    }

    /**
        @inheritdoc IBaseRoundsVault
     */
    function redeemExchangeAsset(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public returns (uint256) {
        require(
            id < _roundNumber.current(),
            "RoundsInputVaultUpgradeable: exchange asset only available for previous rounds"
        );

        return _redeemExchangeAsset(_msgSender(), receiver, owner, id, amount);
    }

    /**
        @inheritdoc IBaseRoundsVault
     */
    function redeemExchangeAssetBatch(
        uint256[] calldata ids,
        uint256[] calldata amounts,
        address receiver,
        address owner
    ) public returns (uint256 shares) {
        require(ids.length == amounts.length, "BaseRoundsVaultUpgradeable: mismatch shares ids and amounts lengths");

        for (uint256 i = 0; i < ids.length; i++) {
            require(
                ids[i] < _roundNumber.current(),
                "RoundsInputVaultUpgradeable: exchange asset only available for previous rounds"
            );
        }

        return _redeemExchangeAssetBatch(_msgSender(), receiver, owner, ids, amounts);
    }

    // VIEW FUNCTIONS

    /**
        @inheritdoc IBaseRoundsVault
     */
    function getCurrentRound() external view override returns (uint256) {
        return _roundNumber.current();
    }

    /**
        @inheritdoc IBaseRoundsVault
     */
    function exchangeAsset() external view override returns (address) {
        return _exchangeAsset;
    }

    // INTERNALS

    /**
        @notice Checks if the receipt corresponds to the current round, and if so, it calls the parent function
                to redeem the receipt for the underlying tokens

        @param id The id of the receipt to be redeemed
        @param amount The amount of the receipt to be redeemed
        @param receiver The address that will receive the underlying tokens
        @param owner The address that owns the receipt, in case the caller is not the owner
     */
    function _redeemCurrentRound(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) internal returns (uint256) {
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
    function _redeemExchangeAsset(
        address caller,
        address receiver,
        address owner,
        uint256 id,
        uint256 amount
    ) private returns (uint256 exchangeAmount) {
        if (caller != owner) {
            require(isApprovedForAll(owner, caller), "ERC4626MultiToken: caller is not owner nor approved");
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burn(owner, id, amount);

        exchangeAmount = amount * _exchangeRateByRound[id];

        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(_exchangeAsset), receiver, exchangeAmount);

        emit WithdrawExchangeAsset(_msgSender(), receiver, owner, id, amount, exchangeAmount);
    }

    /**
        @notice Checks if the receipt corresponds to any previous round, and if so, it calculates how many shares
                the user should receive based on the receipt's round share price and the amount of deposited tokens

        @param caller The address that is calling the function
        @param receiver The address that will receive the exchange asset tokens
        @param owner The address that owns the receipt, in case the caller is not the owner
        @param ids The ids of the receipts to be redeemed
        @param amounts The amounts of the receipts to be redeemed
     */
    function _redeemExchangeAssetBatch(
        address caller,
        address receiver,
        address owner,
        uint256[] memory ids,
        uint256[] memory amounts
    ) private returns (uint256 exchangeAmount) {
        if (caller != owner) {
            isApprovedForAll(owner, caller);
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burnBatch(owner, ids, amounts);

        for (uint256 i = 0; i < ids.length; i++) {
            exchangeAmount += amounts[i] * _exchangeRateByRound[ids[i]];
        }

        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(_exchangeAsset), receiver, exchangeAmount);

        emit WithdrawExchangeAssetBatch(caller, receiver, owner, exchangeAmount, ids, amounts);
    }

    /**
        @inheritdoc ERC4626MultiTokenUpgradeable
     */
    function _getMintId() internal view virtual override returns (uint256) {
        return _roundNumber.current();
    }

    /**
        @notice Function to execute the deposit/redeem logic for the current round

        @dev The child contract must implement this function to execute the deposit/redeem logic
        for the current round. Typically it will call `_redeemFromTarget` or `_depositOnTarget`
        from the ERC4626DeferredOperationUpgradeable contract, but the logic is left open for
        other use cases
     */
    function _operate() internal virtual;

    /**
        @notice Retrieves the exchange rate between the underlying asset and the exchange asset for
        the current round. Whether the rate is underlying/exchange or exchange/underlying depends on
        the specific implentation of the derived contract
        
     */
    function _getExchangeRate() internal view virtual returns (uint256);
}
