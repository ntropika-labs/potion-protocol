# Opyn Perpetual Vaults

# Introduction

Opyn Perpetual Vaults implement a system for vaults that work with assets with an expiration date, and makes this assets expiration-less. In order to do so the Vault renews the asset every time it expires. This is achieved through the Vault Life Cycle and the different agents participating in the system.

# Contracts Architecture

The main architecture for the Vault contracts is the one shown below:

![Untitled](Opyn%20Perpetual%20Vaults/Untitled.png)

Each Vault contains a list of actions that will be performed in certain order. This actions could be things like buying options for an asset, trading this options or any other operation that the Vault strategy needs to fulfill its promises. For each cycle the Vault executes the actions in order to perform the investment. When the cycle expires, the Vault notifies the Actions which pull the investment from the different strategies and realize the profit/loss for the Vault.

# Vault Life Cycle

The Vault life-cycle has basically two states: an **Unlocked** state and a **Locked** state. There is also an **Emergency Pause** state only used to freeze the life cycle and the assets, in case of an emergency.

![Untitled](Opyn%20Perpetual%20Vaults/Untitled%201.png)

When in **Unlocked State:**

- The Vault accepts deposits and withdrawals
- Users can deposit more money into the Vault to participate more in the investment strategy, or they can withdraw their existing balance that will include any profit/loss from previous investment cycles
- When depositing in the Unlocked state the Vault returns shares to the depositers that can be exchanged back for a percentage of the Vault assets

When transitioning from **Unlocked** to **Locked:**

- This is triggered by calling **rollover()** on the Vault at any time while the Vault is **Unlocked**
- The Vault sends to the actions a percentage of the current Vault assets. This percentage is specified as a parameter in the transaction that moves the Vault to the **Locked** state. This means that the specific percentages for each can be changed each cycle.
- The actions lock the received assets and use them to execute the investment strategy (buying of options, selling them through an auction, borrow some money from lending protocols, etc…)
- the Vault executes a series of actions for the particular investment strategy. After the expiration date the Vault returns to the **Unlocked** state and the investors can retrieve their assets and their profit back

When in **Locked State:**

- The Vault only accepts registering deposits and withdrawals for the next cycle
- A user can still deposit money but the assets won’t be used until the next investment cycle. In this case the shares are not yet returned, to avoid a malicious user registering a deposit right before the end of an investment cycle and then claiming their share of the profits
- A user that registered a deposit can claim their shares using **claimShares**() at any time, but they have to at least wait for the next investment cycle in which they deposited the assets (next Unlocked state)
- When registering a withdrawal, the user is indicating the they don’t want their resulting assets (including PnL) to be used in the next investment cycle
- Note that if a user registers a deposit, those new assets will be locked in the Vault until the next **Unlocked** state, regardless of the fact that the assets are not being used in the investment strategy for the moment

When transitioning from **Locked** to **Unlocked**:

- This is triggered by calling **closePositions()** on the Vault while the Vault is **Locked** and only if the investment cycle has finished (i.e.: when using Options, only after the option expiration date)
- The individual actions will pull the assets from the investment and realize any PnL. The new balances are kept in the Action contracts until the Vault retrieves them
- Fees are calculated and payed
- Any deposits registered while the Vault was Locked are added to the main principal of the Vault to be used in the next investment cycle
- Any withdrawals registered while the Vault was Locked are accounted for and the required amount of assets are kept aside for the users to withdraw them

# OpynPerpVault

The main Vault contract inherits directly from **ERC20Upgradable, ReentrancyGuardUpgradable** and **OwnableUpgradable:**

- **ERC20Upgradable** is the upgradable version of the ERC20 contract from OpenZeppelin. It is used to track the minted shares emitted by the Vault when deposits are made. It is also upgradable, which means the contract code can be updated in the future.
- **ReentrancyGuardUpgradable** is the upgradable version of the ReentrancyGuard contract from OpenZeppelin. It is used to avoid reentrancy in a few functions:
  - **withdraw()**
  - **withdrawQueued()**
  - **rollover()** through the \_distribute() function
  Upgradeable means that the contract code can be updated in the future.
- **OwnableUpgradable** is the upgradable version of the Ownable contract from OpenZeppelin. It is used to give owner access to some functions:
  - **setCap()** used to set the maximum amount of deposited assets accepted by the Vault
  - **rollover()** used to start a new investment round
  - **emergencyPause()** and **resumeFromPause()** use to pause the contract in an emergency
  The **closePositions()** function which is the counterpart of **rollover()** is left open for anyone to call. It is a good practice in case that the Vault Manager cannot do it, allowing the investors to unlock the vault and retrieve their assets and profits
  Upgradeable means that the contract code can be updated in the future.

## Fees

The Vault supports 2 types of fees:

- A **performance fee** as a percentage of the profits (if any)
- A **management** **fee** as a percentage of the existing principal, accrued in a daily basis

These fees are payed at the end of the investment cycle and sent to the recipient configured in the vault.

## Notes on the implementation

### About the reentrancy guard

It is unclear why they use the **nonReentrant** guard in the **withdraw()** and **withdrawFromQueue()** functions as they first update the contract state and then transfer the assets to the caller, thus following the **CEI** pattern and avoiding the famous **ERC-777** reentrancy attack.

It is also unclear why they use the **nonReentrant guard** in the **\_distribute()** function. It seems to stem from the fact that they call **SafeERC20.safeTransfer()** in a loop, but the sender is the OpynPerpVault contract and the receiver is one of the Action contracts. If it is the case that the Actions could be created by a third party then the **nonReentrant** modifier is warranted.

### About the emergency state

They could have used the Pausable contract from Open Zeppelin to implement this state and override it to save and restore the previous state when the contract is paused and unpaused

### About the upgradable contracts

The Vault implementations seen in the [ERC-4626 Vault Standard](./ERC-4626%20Vault%20Standard.md) analysis do not use the upgradable pattern. In case we need to use it we must adapt those implementations to be upgradable.

### About the minting of Shares

In Opyn Vaults shares are not always immediately sent to the receiver. This is because users can deposit assets into the vault while the vault is locked, meaning that the Vault Manager would need to pay for a lot more gas if every single set of shares would be sent to the receiver at **rollover** time. Instead a **claimShares** function is available to claim the shares. However this is only the case for when the Vault is locked. In case the Vault is unlocked, it behaves as described in the EIP-4626 standard.

## ERC-4626 similarities and differences

- Vault implementation has some similarities with ERC-4626:
  - **deposit** is very similar but does NOT allow to specify the receiver of the shares
  - **withdraw** is very similar but does not allow to specify the receiver of the assets
  - **convertToShares** → **\_getSharesByDepositAmount**
  - **convertToAssets** → **\_getWithdrawAmountByShares**
  - **totalAssets** is very similar although the logic is quite more complex as it needs to account for all the assets sent to the Actions, plus all the queued deposits and withdrawals
- However it is missing the following functionality from the ERC-4626:
  - All the preview functions are missing from the contract and just **\_getSharesByDepositAmount** and **\_getWithdrawAmountByShares** functions are provided to convert between shares and assets
  - **maxDeposit** is implemented in the **cap** function
  - **maxMint** and **maxRedeem** do not exist

## Overall Features

- Deposit of assets in exchange for shares
- Withdrawal of shares in exchange for assets
- Register deposits and withdrawals while the Vault is locked
- Emergency pause
- Setting the maximum amount of assets that the vault will manage
- Management fee payed to the chosen recipient as a percentage of the amount of principal deposited in the Vault. Payed when the investment round finishes
- Performance fee payed to the chosen recipient as a percentage of the profit made in the round. Payed when the investment round finishes

## Unit Tests

It comes with quite a few unit tests. In total 101 tests are available. 22 of those are run directly on Mainnet against the current mainnet deployment of Opyn. Unfortunately those 22 test rely on the test runner having access to the Opyn contracts owner wallet, so they cannot be run straight out of the shelf. An independent deployment of Opyn could be done and then the tests run on top of it.

The coverage for the tests also seems to be quite high:

```bash
----------------------|----------|----------|----------|----------|----------------|
File                  |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
 core/                |      100 |    90.63 |      100 |      100 |                |
  OpynPerpVault.sol   |      100 |    90.63 |      100 |      100 |                |
 example-actions/     |    92.31 |    68.42 |    95.24 |    92.47 |                |
  ShortOToken.sol     |    94.23 |    71.43 |      100 |    94.34 |    238,249,281 |
  ShortPutWithETH.sol |    89.74 |       60 |     87.5 |       90 |117,118,142,206 |
 libraries/           |      100 |      100 |      100 |      100 |                |
  SwapTypes.sol       |      100 |      100 |      100 |      100 |                |
 proxy/               |    41.67 |       50 |       50 |    43.24 |                |
  CTokenProxy.sol     |        0 |      100 |        0 |        0 |... 72,74,76,77 |
  ETHProxy.sol        |      100 |       50 |      100 |      100 |                |
 utils/               |    91.21 |       70 |    86.67 |     91.3 |                |
  AirswapUtils.sol    |      100 |      100 |      100 |      100 |                |
  AuctionUtils.sol    |      100 |       75 |      100 |      100 |                |
  CompoundUtils.sol   |      100 |       50 |      100 |      100 |                |
  GammaUtils.sol      |    82.35 |      100 |       80 |    82.35 |    102,104,114 |
  RollOverBase.sol    |      100 |       90 |      100 |      100 |                |
  ZeroXUtils.sol      |        0 |      100 |        0 |        0 | 17,25,26,34,35 |
----------------------|----------|----------|----------|----------|----------------|
All files             |    89.57 |       75 |    90.22 |    89.74 |                |
----------------------|----------|----------|----------|----------|----------------|
```

## Comments

- Code is quite well structured and well documented
- The logic is a bit complicated due to the ability of handling deposits and withdraws while the Vault is locked.
- It does not use the EIP-4626 proposed standard which would help standardize the Vault and stick to good practices.
- Fee payment logic is well isolated
- It does not use OpenZeppelin’s Pausable contract for the emergency pause
- The contract uses the upgradeable proxy pattern from Open Zeppelin
- All code is in one single file and there is no clear separation of responsibilities. It uses however Open Zeppelin’s ERC20, ReentrancyGuard and Ownable
- It comes with a set of unit test that seem to cover most of the functionality

# IAction and Example Actions

The library provides the **IAction** interface that can be used to implement actions that can be added to the **OpynPerpVault** for creating different Vault strategies.

On each investment round the **OpynPerpVault** contract will send part of the assets to each **Action** contract and then will instruct the Action contract to start the investment. After the expiration date has arrive, the Vault instructs the Action contract to close the position and make all principal, including all gain/loses, to be available for withdrawal.

This interface requires 3 functions to be implemented:

- **currentValue()** that returns the amount of principal currently controlled by the Action contract
- **rolloverPosition()** initiates the investment round, investing the amount of principal controlled by the Action
- **closePosition()** closes the current investment round, closing the position and making all the principal, plus/minus all gain/loses, available for withdrawal by the main Vault Contract

The repository provides 2 example actions:

- **ShortOToken**
- **ShortPutWithETH**

## ShortOToken Action

This action offers a mixed functionality for minting OTokens and then either auctioning them or selling them OTC.

In particular the action allows for:

- Minting OTokens using **asset** as collateral, and then auctioning those OTokens through Gnosis using the same **asset** as the bidding token
- Minting OTokens using **asset** as collateral and then making a bid to an ongoing Gnosis Auction for the minted OToken, using **asset** as the bidding token
- Minting OTokens using **asset** and then filling an AirSwap order to sell them OTC in exchange for **asset**

All the minting functions can only be called once the action is in **Active** state, which only happens when the **rolloverPosition**() has been called. At expiry time the Vault will call **closePosition**() at which moment the corresponding Opyn vault is settled and the OToken gain/loss is realized.

## ShortPutWithETH Action

This actions uses the Ether sent by the Perpetual Vault to supply it to Compound, where it used to borrow USDC. Then the USDC is used to mint OTokens and sell them through AirSwap. When the position is closed the Opyn Gamma Vault is settled and the recovered collateral used to repay the Compound loan, where the original Ether is recovered and made available to the Perpetual Vault

## Comments

The actions showcase some possible use cases for the perpetual vaults. The code is quite complex and not very polished, and there are a few evident minor bugs throughout, although nothing really important.

One interesting observation is that the **rolloverPosition()** functions just marks the Action as active, and then another function must be called to actually execute the investment. This seems to complicate the management of the Perpetual Vault, and it would be better if we could avoid it in our design.

# Operation

The system is designed in such a way that it needs a **Vault Owner** or vault manager in order to work. The manager will be the actor transitioning the vault between its states and paying for the gas required to do so. This manager could be a physical person or a bot with funds to perform the operation.

Although it is not enforced in the contract, the idea is that the fees will be payed to the vault manager to incentivize them.

# Overall Assessment

## The Good

- The proposed **architecture** has some strong points and it is very useful in understanding how a possible implementation could work
- The **OpynPerpVault** contract has a simple enough interface that could work in the scope of the hedging vaults
- The **OpynPerpVault** offers some security measures like the emergency pause
- The **Action** interface is also simple and makes the perpetual vault functionality composable
- The **Action** examples show how to mint OTokens and sell them through different methods, which is a very good reference point
- It uses battle-tested contracts like Ownable, ReentrancyGuard and ERC20 from Open Zeppelin

## The Bad

- The overall design, taking it as a whole, seems a bit complex. The life cycle makes the logic of the **OpynPerpVault** a bit complex
- While diving into the **Action** contracts, it seems that the functionality does not fully fit the proposed design. The lifecycle proposed in the Vault contract is then extended in the Actions to fit the specific use cases. It would be great to have a better design where the actions are free to perform their duties without relying on external calls
- The overall implementation is complex and it seems difficult to analyze formally in order to ensure the absence of bugs in it
- It does not really follow the EIP-4626 standard
- It does not use the Pausable contract from Open Zeppelin

## The Unknown

- The design begs the question on whether it is possible to simplify the architecture, or it is rather what it is. It would be good to iterate on it to understand if a better approach can be found, although the general directions seems to be good

Author Roberto Cano (robercano)
