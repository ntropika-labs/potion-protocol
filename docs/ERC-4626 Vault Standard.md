# ERC-4626 Vault Standard

# EIP-4626

EIP from the Ethereum Foundation: [https://eips.ethereum.org/EIPS/eip-4626](https://eips.ethereum.org/EIPS/eip-4626)

The standard offers a way of emitting shares based on a deposited asset. This deposited asset can be sent to the Vault and shares are minted in response and sent to the assets owner. Then the owner can use those shares and finally return them to the Vault and redeem them back for the underlying asset.

Each Vault has a single deposited asset, and the Vault behaves like an ERC-20 token with extended functionality. The ERC-20 part of the vault represents the shares given to the users that deposit the asset into the Vault.

### Assets → Shares

The standard offers 2 ways of minting shares from assets:

- **deposit** - which specifies the **amount of assets** that will be deposited in the contract. The amount of shares that will be **minted** is calculated from the amount of assets
- **mint** - which specifies the **amount of shares** that will be minted. The amount of assets that will be **deposited** is calculated from the amount of shares

### Shares → Assets

Consequently 2 ways of redeeming shares for assets are provided:

- **withdraw** - which specifies the **amount of assets** to withdraw from the contract. The amount of shares is then calculated from the amount of assets
- **redeem** - which specifies the **amount of shares** that will be redeemed. The amount of assets that will be sent back is then calculated from the amount of shares

### Preview Functions

The preview functions are used to provide an accurate estimate of the conversion between assets and shares, and vice-versa. They take into account any existing fees, but they do not take into account slippage. They also don’t check any conditions that could make the function revert. They must assume that the conversion is possible:

- **previewDeposit** - calculates how many shares will be minted given an amount of assets
- **previewMint** - calculates how many assets will be needed in order to to mint the given amount of shares
- **previewWithdraw** - calculates how many shares will be burned in order to withdraw the given amount of assets
- **previewRedeem** - calculates how many assets will be returned when burning a certain amount of shares

### Convert Functions

The convert functions are utility functions focused on a good UX of the Vault. Because it is for UX, these functions are not accurate. They give a close estimation to the conversion from assets to shares and vice-versa, but without taking into account fees or slippage:

- **convertToShares** - returns a preview of how many shares would be minted for a certain amount of assets
- **convertToAssets** - returns a preview of how many assets would be minted for a certain amount of shares

### Max Functions

The max functions returns the maximum amount of an input asset that can be used to perform an action. These set of functions assume that the caller has infinite assets and just gives information about how many of the other assets the vault can provide. However it will take into account any specifics about the user (for example if a user is blacklisted, restricted, or has a bonus, for example)

- **maxDeposit** - returns the maximum amount of assets that a user can deposit in the vault
- **maxMint** - returns the maximum amount of shares that a user can mint from the vault
- **maxWithdraw** - returns the maximum amount of assets that a user can withdraw from the vault
- **maxRedeem** - returns the maximum amount of shares that a user can redeem from the vault

# Specific Implementations

There are currently 2 available implementations of the standard. Both are quite similar to each other, although there are subtleties in the implementation. Overall the Open Zeppelin one feels more structured and clean, although it makes some design decisions that could or could not fit our goals for the implementation of the hedging vaults.

Nonetheless both comply with the standard, and it is just in the behavior where they slightly deviate.

### Rari-Capital Solmate implementation

Source: [https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol](https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol)

Specifics of the implementation. The icon of the left is a quick assessment on whether the mentioned feature is desired or not:

- ✅ Reverts when the number of shares to be minted is 0
- ❌ Offers **afterDeposit** and **beforeWithdraw** convenience functions for integrators
- ❌ Abstract contract that needs implementation of the **totalAssets()** function
- ✅ Specific accounting logic, which is OK because it will be overridden by the integrator
- ✅ Takes care of ERC-777 re-entrance attack by preserving the invariants before calling **transferFrom**
- ❌ Manually handles the case where the caller has been approved for allowance
- ✅ Emits **Deposit** and **Withdraw** events

### OpenZeppelin implementation (WIP)

Source: [https://github.com/OpenZeppelin/openzeppelin-contracts/pull/3171](https://github.com/OpenZeppelin/openzeppelin-contracts/pull/3171)

Specifics of the implementation. The icon of the left is a quick assessment on whether the mentioned feature is desired or not:

- ❌ NOT reverting if the amount of shares to be minted is 0
- ✅ Re-uses **afterTransfer** and **beforeTransfer** from ERC-20 to notify integrator about such events
- ✅ Reverts if the amount of assets to deposit exceeds the maximum allowed (calling **maxDeposit()**)
- ✅ Reverts if the amount of shares to mint exceeds the maximum allowed (calling **maxMint()**)
- ✅ Abstract contract, but in this case it is fully functional as it is
- ✅ Takes care of ERC-777 re-entrance attack by preserving the invariants before calling **transferFrom**
- ✅ Uses ERC-20 **_spendAllowance** to handle the case where the caller has been approved for allowance
- ✅ Code is better organized and internal convenience functions are used to convert from assets to shares and vice-versa
- ✅ Emits **Deposit** and **Withdraw** events

# Use case for Hedging Vaults

The use case for hedging vaults is clear as we want to deposit some asset into the vault and get back a hedged asset that represents the recurrently insured asset. The functionality of the ERC-4626, although very useful, is just a small building block in the overall scope of the hedging vaults. It will take care of the depositing/withdrawing functionality and provide information about the exchange rate between the underlying asset and the shares.

However in the case of a hedging vault, this functionality is completely dependent on the vault cycles: the user can only exchange the assets while in the interim period between cycles. Outside this interims, the user can queue a deposit/withdraw but must wait for the next interim before the action is executed. It must be carefully analyzed whether this extra functionality must be handled by the deposit/withdraw calls, or whether a new set of functions is more desirable.

Whether or not this is needed will be more clear after analyzing the existing cyclic vaults implementations from Opyn and Ribbon.

Author Roberto Cano (robercano)