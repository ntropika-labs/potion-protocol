# Ribbon V2 Theta Vaults

The Ribbon Theta Vault has a design very similar to that of Opyn Perpetual Vaults. For every investment period, a manager chooses the type of Option to mint, mints the option, then sells the option through Gnosis Easy Auction or AirSwap. At the end of the period the options are exercised (or not) and the profits/loss are realized and sent back to the Vault.

Vaults architecture is a bit complex, having the functionality separated between the base vault and the specific strategies.

# Ribbon Vault (Base Vault)

The base vault provides the basic functionality for a rolling options vault. It manages depositing of assets and ETH into the vault, and converts it into shares. The base vaults implements the life cycle as rounds. On each round the vault accepts deposits that are tracked and can be redeemed for shares once the round is over. The vault also tracks the price per share for each round, so it can later on calculate the exact number of shares for each deposit that was made. It also allows for initiating a withdrawal in any round that can be completed once the round is over.

All this functionality is offered as a combination of public and internal functions with the intent to be used by a contract inheriting from this base vault.

The Vault implements the concept of Lock and Unlocked state, similar to Opyn, but with a more flexible approach in which operations are not disallowed but instead tracked for later consolidation.

![Untitled](Ribbon%20V2%20Theta%20Vaults/Untitled.png)

## Features

- Keeper of the vault manages the vault life cycle
- Management Fee
- Performance Fee
- Cap for the maximum amount of assets that the vault can manage
- Minimum total supply requirement after any deposit is made
- Deposit ERC20 and ETH
- Redeem shares
- Deposit on behalf of other account
- Get account assets balance
- Get account shares balance. It can return the shares held by the vault and the account separately or together
- Allows to queue a withdrawal during a round and then execute it when the round is over

## Deposits

Deposit tracking is done in a smart way. Because the vault admits deposits at any time, it tracks the last deposit made along the unredeemed shares from all deposits, except the last one. This way it knows that a user can always redeem all shares that are tracked in the unredeemed shares ledger, but it keeps the last deposit separate in case it was made in the current round. If the user attempts to redeem, it checks if the last deposit was made this round or not:

- If it was made this round, the last deposit is ignored and only the unredeemed shares are redeemed
- If it was made in a previous round, the number of shares for that last deposit are calculated and then added to the amount of unredeemed shares, and the total number is redeemed

A user can make several deposits in the same round: these are accumulated and converted to shares after the round has finished.

## Withdrawals

Withdrawals requests have to be issued to the vault in a round prior to the round where the actual withdrawal will be made. When the user requests a withdrawal, the indicated amount of shares is transferred to the vault and locked there. Then, at a later round, the user complete the withdrawal and the assets are sent back to the user.

This allows for the Vault to know how many assets will be removed from next round, so these can be set aside for actual withdrawal.

## Next round logic

Each round has an expiration date which is the option expiration date. The Vault cannot be rolled to the next round before this date. Once the date has passed, the vault rolls to the next round and performs the following actions:

- Sets aside enough assets for the requested withdrawals
- Stores how many assets are available for investing in the new round
- Calculates the new price per share for the new round
- Mints the new amount of shares needed for the new investors
- Calculates the new keeper fee (performance + management) and sends it to configured recipient

## Libraries

The base vault relies on several library contracts to implement its logic, as shown in the following diagram:

![Untitled](Ribbon%20V2%20Theta%20Vaults/Untitled%201.png)

- **Vault** - this library contains all the data structures used throughout the vault implementation
    - **VaultParams** - for vault configuration at construction time
    - **OptionState** - for tracking the option due date and the OToken contract associated with it
    - **VaultState -** Keeps track of the rounds data, including the amount of locked assets, unlocked assets, shares requested for withdrawal, etc…
    - **DepositReceipt -** used to track deposits from a user
    - **Withdrawal** - used to track requested withdrawals
    - **AuctionSellOrder -** not directly used in the base vault, but used to track Gnosis auction sell orders
- **VaultLifeCycle** - this library contains many function related to options creation and settling. However in the base vault is only used for calculating the next round state, including price per share, total management fee, how many new shares must be minted, and so on
- **ShareMath -** helper functions to convert assets to shares and shares from assets. It also helps calculate the price per share and has a specific function to calculate the amount of shares associated to a deposit receipt

## ERC-4626 similarities and differences

- Vault implementation has some similarities with ERC-4626:
    - **depositFor** is the same as deposit in ERC4626. It also provides the **deposit** function that does not allow to specify the recipient of the shares
    - **redeem** is very similar but does not allow to specify the receiver or the owner of the assets, so it is assumed that the caller is the owner and will receive the resulting assets
    - **maxWithdraw** → **accountVaultBalance**
    - **balanceOf** → **shares** and **shareBalances,** but the vault keeps a separate balance for the shares kept by the owner and the shares of that owner kept in the vault (minted while in the locked state)
    - **pricePerShare** can be used to implement **convertToAssets**, but it just calculates the amounts of assets per share (the ratio)
    - **totalAssets** → **totalBalance**
- However it is missing the following functionality from the ERC-4626:
    - **withdraw** does not exist and instead it only uses **redeem**
    - All the preview and convert functions are missing. **pricePerShare** can be used to provide similar functionality to all convert, preview and max functions

## Comments

- In general, the ideas implemented in the vault are quite similar to those in the Opyn vaults, although it feels a bit overengineered.
- The complexity of the implementation offsets its utility. The code is difficult to follow. The code base for just the base vault is huge, uses several libraries, mixes concepts and fails to completely separate competences. It could have been organized in a better way.
- It has the same functionality than Opyn Perp Vaults, just implemented in a different way
- Some functions like **transferFunds** are internal but their name is not starting with an underscore, which is misleading
- Withdraw functionality is split in 2 functions:
    - **_initiateWithdraw -** redeems all pending shares, then registers the number of shares to be withdrawn and transfer this shares to the contract. If the user calls this function repeatedly in the same round, the shares are accumulated. The user **must** complete a withdrawal from a previous round before they can initiate another withdrawal
    - **_completeWithdrawal** - completes a withdrawal queued previously. The queued withdrawal must be from a previous round, not the current round

# Ribbon Theta Vault

The Ribbon Theta Vault builds on top of the base vault to implement an options creation + auction strategy. It uses Opyn for creating the options and Gnosis for the auction process.

The life cycle is pretty similar to the base vault, except it implements a 3 steps rollover:

1. Commit to next option
2. Close current option
3. Execute collateralization of next option

There is a delay of 15 minutes (configurable) between steps 2 and 3 so investors can decide to withdraw their money if they don’t like the next option. After the waiting phase has finished the contract collateralizes the new options and starts the auction.

At the end of the round, if there are options that were not purchased in the auction, the manager can decide whether to sell the remaining options to a purchase queue, which is a match-making market, matching buy and sell orders, or whether to burn those remaining options. Then the 3-steps rollover starts again.

It also allows the users to stake their shares for liquidity mining. 

![Untitled](Ribbon%20V2%20Theta%20Vaults/Untitled%202.png)

All the logic is based on the RibbonVault base contract and uses most of its functionality.

## Features

- Set auction duration
- Selection of strike selection strategy
- Override the strike selection strategy with a manual strike price
- Selection of premium pricer (i.e:. black-scholes)
- Selling of non-auctioned options to a purchase queue: this is a contract for direct sell of options. The purchase queue stores purchase request and matches sell orders with buy orders for selling the options
- Burning of non-auctioned options
- Liquidity mining by staking shares. They don’t provide the code for this contract, just the interface, so it is not clear what kind of rewards the pool is providing
- Allows for immediate withdrawals. This is achieved by looking at the deposit receipt for the current round and allowing for the withdrawal of the assets stored there
- ERC20 tokens recovery in case that a user sent tokens to this contract that are not the asset token or the shares token
- 3 steps rollover

## Comments

- The Theta Vault supports setting a premium discount that is supposed to go towards a discount in the premium, but in reality it’s never used
- Functionality is again a bit mixed up. For example the ERC20 tokens recovery functionality could easily be extracted into a separate contract. Same for the selling of options to the purchase queue (it could be extracted into a PurchaseQueueSeller contract with the required functionality, instead of in a function in the VaultLifecycle library)
- The contract has a **startAuction()** function that can start an auction. However the **rollToNextOption()** already calls that function (in reality the underlying **_startAuction()**) so it seems that there is no need for this function at all
- The **stake()** function just tries to redeem enough shares to call the liquidity pool **deposit()**, but instead the user (or frontend) should do this directly: call redeem() in the Vault contract, get enough shares and then deposit them in the liquidity pool without having to have this function in the Vault contract
- It adds **withdrawInstantly()** which seems something that the base vault could provide. There is nothing in the Theta vault that enables this functionality. If the concern was that not all derived vaults must have this functionality, then a separate contract **VaultWithInstantWithdraw** deriving from the base vault could have been added and used only in the cases that was needed
- Overall, once analyzed, the contract functionality is quite contained, but the implementation makes it difficult to understand.

# Other Vaults

## RibbonThetaVaultWithSwap

This Vault forks the Base Vault to remove Gnosis auction and add AirSwap offering. They also forked the VaultLifeCycle into VaultLifeCycleWithSwap. In this case, the **rollToNextOption()** function, instead of starting an auction, creates an offer in the AirSwap contract. It also provides a function to settle the offer which will be most likely called after the round has ended.

## RibbonThetaSTETHVault

Special vault for Lido DAO and their staked ETH token, also forking the Base Vault. They as well forked VaultLifeCycle into VaultLifeCycleSTETH, but in this case they import BOTH versions into the contract. Very similar to RibbonThetaVault but with a very complicated calculation of the actual principal in the vault, mixing WETH, ETH and stETH.

They use the funds (ETH + WETH) to exchange it for stETH. Then they wrap stETH into wstETH, and they use this as the collateral for the options purchase.

Quite a mess: they alias some variables in the contract to cache them, but then they use the original and the cached one indistinguishably. Very difficult to follow logic as it is never clear the total amount of funds that will be used for the collateral. Also they have a fix for stETH in which they substract 1 wei, and add 1 wei for certain operations

## RibbonTreasuryVault

This is a complete fork of the Base Vault with all the functionality in a single contract, instead of the Base/Derived approach followed by the other vaults.

This is exactly the same as RibbonThetaVault for options creation and selling through Gnosis auction. The difference is that depositors get a premium paid in USDC, presumably coming from the treasury (the approval of USDC to the vault contract would happen outside of the code of the vault).

Each depositor gets a percentage of the paid premium based on the percentage of shares owned. The total amount allocated to premiums is outside of the scope of the vault contract.

## RibbonThetaYearnVault

Again a fork of Base vault and the RibbonThetaVault to accept Yearn Finance yield tokens (i.e.: a Yearn vault). Again is option creation + selling through an auction.

They seem to have the same problem with the 1-wei off calculations, steaming from Yearn contract.

## RibbonStraddleVault (MetalVault)

They have this vault as an example of a meta-vault, which is a vault that uses other vaults to create a combined strategy. The straddle vault, for example, uses a combination of short option and long option to create a straddle.

The contract is, however, almost pseudocode. There are a lot of commented lines and it seems to be just a quick draft of what such a type of vault could look like. Although it is a nice exercise, it is not very useful because it actually lacks the star of the show: the **rollVault()** implementation to actually use these other vaults to create the straddle.

In any case the idea is clear and we could also consider having meta-vaults in our system, in case it impacts the design of the vaults.

# Overall Comment

- Nice way of handling upgradeable contracts storage: they inherit from a contract that declares all storage variables, and this contract in turn, inherits in order from StorageV1, StorageV2, and so on. This maintains a strict inheriting chain and ensures that an upgrade does not overwrite existing storage.
- Good list of examples of what can be done with vaults for different types of assets.
- They use inheritance instead of composition which makes the system simpler than using actions like Opyn. For our vaults we need to figure out if we want to go for composition or monolithic vaults. This will depend on whether an existing deployed Vault would need to modify its strategy after deployment, for example adding an additional step to the investment strategy, in which case an Actions approach would suit better. On the other hand having the contracts as upgradeable would allow us to update the code in any case, but just something to have in mind.
- The concept of rounds, although good, is just hiding the fact that they have a locked and unlocked state. During the unlocked state they’ve also commited to the next Option, so the investors can stay or bail-out before the next round. Again, it’s a good idea but the implementation feels messy.
- The implementation has some problems:
    - They’ve copy-pasted the contracts several times and adapted them to the different scenarios, instead of coming up with a common framework for all the vaults. It’s not easy to do, but we could implement simpler and more understandable. Also more expandable.
    - They have libraries like **VaultLifecycle** that have inside functions for purchasing Opyn options, which does not make sense
    - They have functions like **instantWithdraw** implemented in a derived contract, instead of in the base one, which also does not make sense
    - They have plenty of casts to narrower types (uint104, uint128, uint32) and then some asserts for those types to make sure they don’t overflow. The reason seems to be that the VaultState structure is a packed structure (this means that they use types smaller than uint256 to use less storage slots and save gas), but then they should have built all this functionality into a VaultState library that handles all this, instead of having it all spread around the code
    - The base vault have variables for the Opyn controller or the Gnosis auction contracts, but these are not used in the base vault, so it’s hard to understand why they didn’t put this in a derived contract instead
- We can inspire ourselves in the Ribbon Vault functionality, and grab some good ideas from them, but we should not use the code as it is.
    
    

Author Roberto Cano (robercano)