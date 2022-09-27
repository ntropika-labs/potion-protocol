/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC4626Upgradeable.sol";
import "@prb/math/contracts/PRBMathUD60x18.sol";

import { CountersUpgradeable as Counters } from "@openzeppelin/contracts-upgradeable-4.7.3/utils/CountersUpgradeable.sol";

import "../common/EmergencyLockUpgradeable.sol";
import "../common/RefundsHelperUpgreadable.sol";
import "../common/RolesManagerUpgradeable.sol";
import "./VaultDeferredOperationUpgradeable.sol";
import "../interfaces/IBaseRoundsVault.sol";
import "../library/PriceUtils.sol";

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
    VaultDeferredOperationUpgradeable,
    IBaseRoundsVault
{
    using Counters for Counters.Counter;
    using PriceUtils for uint256;

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
        _exchangeRateByRound[_roundNumber.current()] = _getCurrentExchangeRate();

        _operate();

        _roundNumber.increment();

        emit NextRound(_roundNumber.current());
    }

    /**
        @inheritdoc IVaultWithReceiptsUpgradeable
     */
    function redeem(
        uint256 id,
        uint256 amount,
        address receiver,
        address owner
    ) public virtual override(IVaultWithReceiptsUpgradeable, VaultWithReceiptsUpgradeable) returns (uint256) {
        require(id == _roundNumber.current(), "BaseRoundsVaultUpgradeable: can only redeem current round");

        return super.redeem(id, amount, receiver, owner);
    }

    /**
        @inheritdoc IVaultWithReceiptsUpgradeable
     */
    function redeemBatch(
        uint256[] memory ids,
        uint256[] memory amounts,
        address receiver,
        address owner
    ) public virtual override(IVaultWithReceiptsUpgradeable, VaultWithReceiptsUpgradeable) returns (uint256 assets) {
        for (uint256 i = 0; i < ids.length; i++) {
            require(ids[i] == _roundNumber.current(), "BaseRoundsVaultUpgradeable: can only redeem current round");
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
            "BaseRoundsVaultUpgradeable: exchange asset only available for previous rounds"
        );

        return _redeemExchangeAsset(_msgSender(), receiver, owner, id, amount);
    }

    /**
        @inheritdoc IBaseRoundsVault

        @dev TODO: The user must be prevented from redeeming receipts partially as this could cause a cumulative rounding error
        in the amount of shares redeemed by the user. If for example the share price is 0.8 shares/asset and the user
        tries to redeem exactly 1 wei asset, the user would receive 0 shares. Doing this repeatedly would burn away all
        the receipt unit without ever getting any shares from the target vault. Forcing the user to redeem the full
        amount ensures that the behaviour is consistent with depositing the shares directly in the target vault
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
                "BaseRoundsVaultUpgradeable: exchange asset only available for previous rounds"
            );
        }

        return _redeemExchangeAssetBatch(_msgSender(), receiver, owner, ids, amounts);
    }

    // VIEW FUNCTIONS

    /**
        @inheritdoc IBaseRoundsVault
     */
    function getCurrentRound() public view override returns (uint256) {
        return _roundNumber.current();
    }

    /**
        @inheritdoc IBaseRoundsVault
     */
    function exchangeAsset() public view override returns (address) {
        return _exchangeAsset;
    }

    /**
        @inheritdoc IBaseRoundsVault
     */
    function getExchangeRate(uint256 round) public view returns (uint256) {
        return _exchangeRateByRound[round];
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
            require(isApprovedForAll(owner, caller), "BaseRoundsVaultUpgradeable: caller is not owner nor approved");
        }

        // If _asset is ERC777, `transfer` can trigger trigger a reentrancy AFTER the transfer happens through the
        // `tokensReceived` hook. On the other hand, the `tokensToSend` hook, that is triggered before the transfer,
        // calls the vault, which is assumed not malicious.
        //
        // Conclusion: we need to do the transfer after the burn so that any reentrancy would happen after the
        // shares are burned and after the assets are transfered, which is a valid state.
        _burn(owner, id, amount);

        exchangeAmount = amount.toOutputAmount(_exchangeRateByRound[id]);

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
            exchangeAmount += amounts[i].toOutputAmount(_exchangeRateByRound[ids[i]]);
        }

        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(_exchangeAsset), receiver, exchangeAmount);

        emit WithdrawExchangeAssetBatch(caller, receiver, owner, exchangeAmount, ids, amounts);
    }

    /**
        @inheritdoc VaultWithReceiptsUpgradeable
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
    function _getCurrentExchangeRate() internal view virtual returns (uint256);
}
