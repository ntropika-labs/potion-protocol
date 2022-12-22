# Potion Hedging Vault - Preliminary Technical Analysis

# DISCLAIMER

This document is a preliminary document used when designing the Hedging Vault and DOES NOT represent the final product, but just a conversation that led to the final design. Please refer to the Potion Hedging Vault - Technical Description v0.2 document for a version describing the implementation.

# Motivation

In the protocol there are 2 main actors: the LP provider and the buyer of potions. Currently the LP provider enjoys a set and forget approach in which the LP adds principal to the liquidity pool and then the system uses the pool each time a buyer wants to buy a Potion. However, the buyer needs to renew the Potion once it expires. This means that the buyer must keep managing the renovation. If she misses one renovation, the asset she holds would be un-insured and could cause losses.

Besides this, all Potions are paid in USDC, meaning that the buyer has to keep some USDC available at all times to be able to buy Potions.

# Proposal

To have a rolling-option vault that auto-renovates every time the Option expires. Several **Buyers** can participate in this Vault at the same time. Each buyer can add **Principal** into the vault in the **Hedged Asset**, and the Vault will automatically:

- Wait some time for Buyers to add or remove Principal from the Vault. Each investor removing Principal will also realize gain/losses
- Convert the required amount of Principal to **USDC** in order to buy a Potion (**Premium**)
- Buy a Potion for a certain **Insured Percent** of the **Hedged Asset**, with the required **Strike Price** and **Duration**
- Wait for the specified **Duration**
- Exercise the **Potion** (if possible) and realize gain/loss
- Repeat the process starting with the waiting period for Buyers

The automation of the vault cycle will be done by a third agent called the Keeper that has special access to the vault and pays for the gas to perform all management vault operations. This Keeper receives an incentive in the form of a Fee for managing the vault. The Keeper responsibilities are:

- Select the appropriate configuration values for the Vault
- Cycle the Vault through its different states
- Pay for the gas of all management transactions

# User Flow

We need to define how the user flow will look like in the DApp. This will help identify which type of functions, helpers and events we need in the contracts. While not needed right now, we should brainstorm about this after the POC to have stronger requirements:

- Steps to create a hedging vault
- Integration of Hedging vault into the buy-side flow

# Vault Design

## Architecture

We want the Vault architecture to be as simple as possible first, and then to be as composable as possible. The idea is to follow Opyn implementation in this and implement a main Vault contract that handles the Principal and the emission of Shares. The Vault then allocates a percentage of the principal to each Action and notifies the Actions about this amount. The Actions will use the allocated Principal to perform the investment strategy.

This approach allows us to focus on a specific implementation at first (Potions Buying) while not closing the system for additions in the future. It will require more time to come up with a proper design for this, but it will clearly be leaner and follow the separation of responsibilities principle.

The Vault will only accept one type of Asset to deposited into the Vault. This is the asset that the Actions will use for the investment.

![Untitled](Potion%20Hedging%20Vault%20-%20Preliminary%20Technical%20Analy/Untitled.png)

## Vault Life Cycle

After analyzing Opyn and Ribbon I think the best idea is to implement 3 different states:

- **Unlocked**: in which the Buyers can Deposit and Withdraw immediately. The Keeper can also change the parameters for the next Investment Cycle strategy freely.
- **Committed**: in which the parameters for the next Investment Cycle strategy cannot be changed anymore, but the Buyers are still able to Deposit or Withdraw immediately. This allows the Buyers to choose whether to stay for the next cycle or not. **ADD POSSIBILITY OF ROLLING BACK THE COMMITTED STATE**
- **Locked:** where the Principal is locked and will be used for the investment. Any Deposits and Withdraws are not allowed (or queued to be executed later). The investment strategy is executed and the Vault will wait for the Duration before it can get Unlocked

![Untitled](Potion%20Hedging%20Vault%20-%20Preliminary%20Technical%20Analy/Untitled%201.png)

## Investment Actions

The Vault has a list of Actions that must be executed in order for the investment strategy. This list of actions will have two different methods:

- **Enter Position:** this is called when the Vault enters the Locked state, and it signals the action to invest the given amount of Principal according to its logic
- **Exit Position:** this is called when the Vault exits the Locked state, and it signals the action to realize the investment gain/losses and return the new Principal back to the Vault

The Actions are configured through their own interface to allow for flexibility in the strategies. The Vault is the owner of the Actions and only the Vault can call enter/exit position, while the keeper can configure the Actions.

The Action also receives the following parameters when the Vault calls Enter Position, so the Action can effectively execute the investment strategy:

- **Principal:** amount of the Hedged Asset that must be insured

## Configuration Values

The Vault works with only 1 type of asset (Principal Asset) and has the following configurable values:

- **Cycle Duration**: the duration of the Investment Cycle. Actions are informed about this value so they can adjust their investment strategies when entering a position
- **Principal Percentages**: the percentage of the Principal allocated to each Action. It does not have to add up to 100%. This allows for strategies similar to protective-puts to be implemented by not investing the whole principal
- **Keeper:** address that can execute privileged functions like changing the Cycle Duration, the Principal Percentages or the Actions specific configuration
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Keeper address
- **Management Fee**: a fixed fee as a percentage of the Principal paid to the Keeper on each Investment Cycle for managing the Vault
- **Performance Fee:** a variable fee as a percentage of the gains of an Investment Cycle. If there are losses then the resulting payable amount is 0. It is paid to the Keeper on each Investment Cycle to reward that the Keeper is choosing profitable strategies
    - [**DISCUSSED**] Understand if we should pay the fees on the hedged asset, on USDC or on both
- **Fee Recipient:** the recipient of the management and performance fee, in case it is different than the Keeper

## Keeper Role

The Keeper is the one in charge of configuring all parameters related to the Investment Cycle and executing the investment. It’s in fact the role that can make the Vault profitable or not by choosing the correct parameters each cycle. For this role there are several approaches that can be used:

- **Keep3r Network**: in the Keep3r Network, contracts can register as available for keeping, offering an incentive. On the other side, keepers will look for profitable contracts to keep and will join as keeper of that contract. In this scenario it is very important to have a clear incentive scheme that can be sustainable and profitable for the keeper
- **Manual Keeper:** in this case the keeper is selected manually and set by the Vault owner to be the Keeper. The incentive scheme is also very important here.
- **Gasless Keeper:** in this scenario, the owner of the Vault will setup gasless transactions for the Vault. Any user could execute the Investment Cycle. However configuration of the Vault and the Actions would be restricted to the Vault Owner. This can be implemented in two ways:
    - Using OpenZeppelin Defender with Relayer, Autotask and meta-transactions ([https://blog.openzeppelin.com/gasless-metatransactions-with-openzeppelin-defender/](https://blog.openzeppelin.com/gasless-metatransactions-with-openzeppelin-defender/)). With a meta-transaction any user could execute the Investment Cycle without having to pay for the gas, and the gas would be paid by the Vault Owner. However this action must be incentivized to convince users to spend time sending the transaction. In this case the incentive can be lower as the user is not paying the gas.
    - Using the Gas Station Network, a network of relayers that will pay for the gas of a transaction in exchange for incentives ([https://opengsn.org/](https://opengsn.org/)). In this case the relayer pays for the gas and so they expect a reward in return. The incentive scheme could be similar to that of the Keep3r network.
    

I think the best way to go right now is to implement the Manual Keeper solution, so the DAO can setup their own Keeper for the Vaults. However they will need money in their Treasury to keep paying for this. Any of the other approaches would most likely need extra work to adapt the contracts and prepare some helper scripts. While not knowing in depth all the solutions I’d say it should not be difficult to adapt the contracts in the future. It could, however, invalidated an Audit.

**TL;DR: Implement the Manual Keeper role which is simpler**

## **Principal Percentages**

The Principal Percentages configuration allow having less than 100% of the Principal insured with a Potion. This enables us to implement different investment strategies:

- Higher insured percentage
    - Higher amount of Principal covered by the Potion
    - Higher Premium
    - Less downside if the Option expires ITM
    - Less upside if the Option expires OTM (because of the Premium)
- Lower insured percentage
    - Lower amount of Principal covered by the Potion
    - Lower Premium
    - Higher downside if the Option expires ITM
    - Higher upside if the Option expires OTM (because of the Premium)

## Deposit and Withdrawals

It is very important to define when a user can deposit and withdraw from the vault, to make sure that the system functions correctly all the time and that the users cannot take advantage of the Vault behaviour in this respect. The more common attack vector in this case is to deposit right before the end of the Investment Cycle to the get the corresponding Shares, and then redeem the Shares immediately after the cycle ends. This allows the Buyers to not put their money at risk until the very last moment.

To prevent scenarios like that, the Vault should not accept any Deposits or Withdrawals while the Vault is Locked. However there are two different approaches to implement this:

- Deposits and Withdrawals will revert if the Buyer tries to do it when the Vault is Locked
- Deposit and Withdrawals are accepted in the Locked state, but instead of executed they are queued until the Vault is Unlocked. At that moment all Deposits and Withdrawals are unlocked

The first approach is really simple to implement but it narrows down the window at which Buyers can interact with the contract, negatively impacting usability. On the other hand, accepting Deposits and Withdrawals during the Locked state, complicates the accounting of the available assets, and also impacts usability. Let’s see why:

- A typical implementation for accepting Buyer’s Deposits during the Locked state would take note of the Deposits made during that period, also transferring the required amount of assets into the contract, and the moment it goes to Unlocked it would add up those Deposits to the Principal. The cost in gas is quite similar to accepting a Deposit in the Unlocked state, but it complicates a bit the accounting.
- A typical implementation for accepting Buyer’s Withdrawals during the Locked state would take note of the required Withdrawals made during that period. The moment the Vault goes to Unlocked, it would set apart all the required assets to pay out the Withdrawals. Then the Buyer’s must do another transaction to finally retrieve the assets back. This means that Buyer’s must do 2 transactions and also that the accounting logic is more complicated

However this later approach gives peace of mind to the Buyer’s because they can Deposit at any time, and they can decide at any time if they want to Withdraw the funds for the next Investment Cycle, without having to wait for a specific period of time. Then they have to come back to the contract to finally Withdraw, but the funds are safe and not used for a new investment.

A further discussion in the case of accepting Deposits and Withdrawals during the Locked state is whether to accept Immediate Withdrawals. This is basically a Withdrawal executed after a Deposit during the Locked state of the same Investment Cycle. Let’s say I Deposit 1000 units of assets in the Vault during the Locked state of Investment Cycle 42. If suddenly I feel the urge to Withdraw 200 units of assets while still in the Locked state of Investment Cycle 42, that would be an Immediate Withdrawal, that would come from the pending Deposits the Buyer’s has at that moment

My suggestion would be to implement the simple revert at first for the POC. Then see how difficult it would be to implement the second approach.

## Fees

The Vault manages 2 different types of Fees:

- **Management Fee:** it’s a fee to incentivize a Keeper to take care of the Vault. It is a percentage applied on the Principal on each Investment Cycle. The more Principal in the Vault, the more attractive the Vault will be to a prospect Keeper
- **Performance Fee:** it’s a fee to incentivize a Keeper to choose profitable strategies for the Vault. It is a percentage applied on the gains between the last Investment Cycle and the next
- **~~Owner Fee:** this would be a fee (variable or not) to be paid to the owner on each Investment Cycle. This could fund the protocol owner to keep running the operation.~~

This fees can be paid to the Keeper to incentivize them to keep managing the vault and choosing profitable strategies.

**TL;DR: DISCUSSED, SEE ABOVE**

## ERC-20 and Ether

The contract will accept ERC-20 compatible tokens for the Hedged Asset. However there is the debate about whether to accept Ether or not. A common practice is to accept Ether and internally convert it into WETH (ERC-20) to work with it.

To simplify the Vault we could just accept directly WETH, which means the Vault is only aware of ERC-20. A case can be made that if we need the functionality to be implemented we could have an external helper contract that converts Ether to WETH and calls the Vault.

Implementing this internally in the contract should also not be difficult and it seems to be common practice, so I’m more inclined for this option. I’d completely discourage to work with Ether directly as it gets really complicated because all accounting logic should be duplicated to take Ether into account.

**TL;DR: Accept Ether and convert it to WETH internally**

# Potion Buy Action

For the first version of the Hedging Vault only the Potion Buy strategy will be implemented. This strategy is explained in the [Proposal](https://www.notion.so/Proposal-f6d88e119e1e449bacd28945fab27d33) section.

## Life Cycle

The Action has 2 states:

- **Unlocked:** an state where configuration values can be changed freely by the Keeper
- **Committed:** no more configuration is possible but no investment is made yet
- **Locked:** no more configuration is possible and the received funds are used to perform the investment

## Configuration Values

The Potion Buy Action works with only 1 type of insured asset (Principal Asset) and has the following configurable values:

- **Cycle Duration**: the duration of the Potion to be purchased. This comes from the Vault configuration
- **Maximum Premium**: the maximum premium to be paid when purchasing Potions. This allows to implement slippage when purchasing Potions (**should this be a percentage?**)
- **Strike Price**: the strike price to be used when purchasing the Potion
- **Counterparties:** the list of LP providers and amounts that the Action will use to purchase the Potions
- **Swap Min Price:** Minimum price to be accepted when swapping the hedged token for USDC

## Premium, Gains and Swaps

The received Principal will be denominated in some Asset that is not USDC. In order to pay the Potion Premium, the Potion Buy Action must Swap part of the Principal into USDC in order to purchase the Potion.

The amount to be swapped should be Maximum Premium, as it would be the maximum that the Action is willing to pay for the Potions. For this Swap, Uniswap V3 will be used, as it has enough liquidity for us and also mitigates big price movements by using the concentrated liquidity feature.

Then at the end of the investment cycle, if the Potion is exercised, the Action will receive more USDC from the the Potion, that must be Swapped back into the original Hedged Asset, again with some slippage. 

To find the best swapping route, Uniswap provides an Auto-Router, which is written in Javascript. This means that the Smart Contract cannot request this Route directly and it must be provided by the **Keeper**, and pass this route to the Potion Buy Action contract, both times when entering the position and when exiting the position.

**TL;DR: Uniswap V3 will be used to swap the Hedged Asset for enough USDC to pay for the premiums. Uniswap V3 uses concentrated liquidity, which mitigates big price movements when swapping assets, and also has more TVL right now than Uniswap V2. The Keeper will need to bridge the assets routes to the Potion Buy Contract.**

## Strike Selection Strategy

The Strike Price selection for each Investment Cycle is one of the most important parts of the system, as it must follow the existing asset price to understand how much of that price should be insured in the next cycle.

There are two ways of implementing this strategy:

- **External contract**: in this case an external contract would take care of the strike selection strategy. It could have complex logic or just be a setter/getter in which the Keeper could set the Strike Price for each Investment Cycle. This costs more gas because there is an external call.
- **Internal Storage:** in this case the Keeper would set the value directly in the Potion Buy Action. It is simpler and it also costs less gas, but it’s less versatile.

For the initial implementation I’d go for the Internal Storage approach as it seems simpler. Later on it should be trivial to change this by a call to an external contract with more complex logic.

**TL;DR: Use a strike price configured by the Keeper in the Internal Storage of the Potion Buy Action**

# Implementation

## Code Reuse

I think the best thing to do is to use the ERC-4626 (ERCTokenizedVault as of the last version) and then expand it for our needs. I wouldn’t use as it is most code from Opyn or Ribbon, although Opyn is worth to look at for the Actions implementation.

That said I’ll try to see if we can copy/paste functions or specific functionality from them, instead of developing everything from scratch.

I’d also try to implement the different responsibilities into different contracts that we can have available as a library of smart contracts that could be published at some point. 

**TL;DR: Implement from scratch using ERCTokenizedVault (EIP-4626) from OpenZeppelin and copy/paste some functionality from Opyn/Ribbon if needed**

## Upgradeable Contracts

Making the contracts upgradeable will allow the deployer to update the implementation in case a bug is found. It is definitely desired to have the contracts upgradeable and we can use the OpenZeppelin Upgradeable contracts implementing the Proxy pattern ([https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable))

**TL;DR: make all the contracts upgradeable using OpenZeppelin Upgradeable contracts**

## Fees Recipient

For flexibility, the Fee recipient can be configured independently from the Keeper in case gas-less transactions are used paid by the Owner, in which case the Relayer contract address, which is the Keeper, is not the desired recipient of the fees.

**TL;DR: Have a specific Fee Recipient address for sending the Fees**

## Vault and Actions Components

- **Open Zeppelin**
    - ERCTokenizedVaultUpgradeable - implementation of the EIP-4626 for tokenized vaults
    - AccessControlUpgradeable - allows defining different roles for accessing different functionality. It provides the default Admin role
    - PausableUpgradeable - implements a mechanism to temporarily pause functionality in a contract
- **Common Components**
    - Roles Manager - defines the Keeper role and provides helper modifiers to aid implementation
    - Emergency Lock - uses the Pausable contract to provide external functions `pause()` and `unpause()`
    - Lifecycle Manager - defines the different states of the vault and action lifecycle: `Unlocked` , `Committed` and `Locked`
    - Refunds Manager - helper contract to add the ability of returning funds that have been received by mistake in the contract
- **Vault Components**
    - Deposit Cap - implements a Cap on the deposits for the ERCTokenizedVault
    - Actions Manager - stores a list of Actions that will be executed when entering a Position
    - Fee Manager - manages all fees calculations and allow to pay this fees to the configured recipient
    - Vault Configuration - storage for the Vault contract. Separated from the main contract to be able to easily upgrade the contract without overriding the existing storage
    - Hedging Vault - the full vault that makes use of all the other contracts. It is at this level that the access control is implemented for Keeper functions
- **Potion Buy Action Components**
    - Potion Library - helper library to buy and redeem Potions from the Potion Protocol
    - Uniswap Library - helper library to swap assets in Uniswap
    - Action Configuration - storage for the Action contract. Separated from the main contract to be able to easily upgrade the contract without overriding the existing storage
    - Potion Buy Action - the actual Action contract that makes use of all the other contracts. It is at this level that the access control is implemented for Keeper functions
    - USDC Provider - optional contract that could be implemented to optimize the conversion of assets to USDC and viceversa. It would keep an accounting of how much USDC it already has and only swap the required amount

## Contract Events

The events will allow the DApp to quickly show information about the Vault state and Actions state.

### Roles Manager Events

- Admin/Owner Changed
- Keeper Changed

### Refunds Manager

- ETH Refunded
- Token Refunded

### LifeCycle Mana**ger**

- Vault Locked
- Vault Unlocked
- Vault Committed

### Emergency Lock

- Contracts Paused
- Contracts Unpaused

### Fee Manager

- Management Fee Changed
- Performance Fee Changed
- Fee Recipient Changed
- Fee Paid

### Actions Manager

- Actions added

### Deposit Cap

- Cap Changed

### ERCTokenizedVault

- Deposit
- Withdraw

### Hedging Vault

- Cycle Duration Changed
- Principal Percentages Changed

### Potion Buy Action Configuration

- Strike Price Changed
- Maximum Premium Changed
- Swap Slippage Changed

### Potion Buy Action

- Potions Purchased
- Potions Settled
- Principal Swapped
- USDC Swapped

## Vault Contract Architecture

![Untitled](Potion%20Hedging%20Vault%20-%20Preliminary%20Technical%20Analy/Untitled%202.png)

## Potion Buy Action Contract Architecture

![Untitled](Potion%20Hedging%20Vault%20-%20Preliminary%20Technical%20Analy/Untitled%203.png)

# Optimizations

## Vault ↔ Actions Transfers

There is quite a lot of asset transfers between the Vault and the Actions. Each time the Vault enters the Locked state, it sends to each Action the allocated amount of Principal. Then the Potion Buy Action Swaps part of this Principal into USDC to pay for the Premium. At the end of the cycle, the Action may receive back some more USDC which must be converted into the original Hedge Asset. All this back and forth could be minimized by:

- The Action only needs to get enough Asset for the Premium to be paid
- The Action could keep a balance of USDC in the Action, and request to the Vault accordingly only the amount it needs for each cycle
- The Vault could retrieve from the Action this USDC in case it needs it for a Withdrawal

This would complicate the logic, but would save quite some gas

**TL;DR: Don’t do anything for the first iteration. We can reassess later if this is needed**

# Issues

## Counterparties List and amount of OTokens

To buy a potion from the Potion Protocol the Keeper needs to retrieve a list of counterparties from the protocol’s router. This list is completely tied to the number of OTokens to be purchased. However the vault may suffer from 2 types of slippage when it comes to buying OTokens:

- Slippage on the utilization of the counterparties pools that could lead to an increase on the premium. This is mitigated by using the Premium Slippage percentage
- Slippage on the amount of principal that must be hedged, caused by investors transactions coming between the moment the Keeper sends the order to hedge the principal and the moment that the Keeper’s transaction is mined. This is a very tricky case because the list of counterparties has in itself the amount that will be purchased from each counterparty

To solve the second slippage, some ideas could be:

- Transition the vault first to a Pre-Invest state in which the investors cannot deposit so the Keeper knows exactly the amount to be hedged and then creates the counterparties list. For the version of the vault in which investments are made back to back this would create a gap in the hedging that would slightly increase the risk of being exposed to a black-swan event.
- Post-process the counterparties list to add the difference between the expected amount of OTokens and the actual amount of OTokens. The post-processing would divide the difference between the number of counterparties and add this final amount to the counterparties list amount of OTokens to be purchased. This could create a high increase in the premium that can then be mitigated using the Premium Slippage. However if the difference is too big the transaction could fail

## Counterparties List and Spot Price

### Problem

When the counterparties list is generated, the spot price of the hedged asset is used to understand the strike price in USDC derived from the strike percentage. The list of counterparties is then set in the Potion Buy action for that specific spot price.

From the moment the information is set to the moment it is used to purchase the potions, the spot price might have moved. If it moves, there are two possibilities:

- The price moves up, meaning the updated strike percentage moves down: having an original strike percentage of 80% for a spot price of 1000 USDC, meant the strike price in USDC was 800 USDC. If the price moves up, the new spot price is 1600 USDC, now the original strike price in USDC of 800 USDC yields an strike percentage of 50%
- The price moves down, meaning the updated strike percentage moves up: having an original strike percentage of 80% for a spot price of 1000 USDC, meant the strike price in USDC was 800 USDC. If the price moves up, the new spot price is 400 USDC, now the original strike price in USDC of 800 USDC yields an strike percentage of 200%

The **price moving up** has the following implications:

- The actual strike percentage moves down
- Without updating the list of counterparties, the premium will stay the same, thus making the buyer pay more that if LPs with lower maximum strike percentage were chosen
- The covered percentage is also lower, meaning the buyer is losing the difference in case the expiration spot price would be in the money
- However the experience from the buyer point of view is the same, as the strike price is given as an absolute denominated in USDC, so the expectations of the buyer will match the payout received

The **price moving down** has the following implications:

- The actual strike percentage moves up
- It could be that this new strike percentage is above the maximum percentage of one or more of the liquidity providers in the counterparties list, which will cause the transaction to fail, and in turn the vault not being able to enter the position
- If all the counterparties still support the new strike percentage, the premium will stay the same, same as in the previous case, so the buyer is not affected in any way

### Conclusion

The price moving up is not considered an issue and the vault does not need to handle that case in any way.

The price moving down is an issue, as it could cause the enter position to fail. To alleviate this problem the suggested solution is to modify the Potion Router so we can include a slippage on the strike percentage. The router would apply this slippage percentage to the strike percentage to yield the new strike percentage to be used when searching for counterparties

For example, if a strike percentage of 80% is going to be used, we could apply a strike percentage slippage of 10%. This would yield a final strike percentage of 88%, which would be used to find the correct counterparties. The vault would receive the 80% strike as the one to use for buying the options, but the list of counterparties is ensured to have counterparties that accept at least an 88% strike. If the price moves up by less than 10% the transaction would still succeed.

This last mechanism has the side-effect that the buyer could be paying a higher premium as pools with higher maximum strike percentage are chosen, so the maximum strike percentage slippage must be chosen very carefully:

- High enough so a change in price does not make the strike percentage exceed the maximum strike percentage of any counterparty
- Low enough as to optimize the premium that the buyer will be paying

## Trusted Counterparties

In the current implementation, the Keeper is the one that configures all the parameters in the Actions, including the list of Counterparties. There is the possibility that an unfaithful Keeper would want to take advantage of this to try to select certain counterparties that benefits the Keeper instead of the Buyers. Currently there is no mechanism in place to prevent this.

If it is needed, the Router should sign the list of counterparties and send this signature along the list to the Keeper, which in turn would send this to the Action. The Action would validate the signature to make sure that the list is trusted and then execute the investment.

**TL;DR: For now we trust the Keeper and there is no need to implement this type of system**

## Trusted Swap Route

The same rationale explained for the Counterparties list applies to the Swap Route of Uniswap. The Keeper could tamper with it to benefit a specific pool that they have an interest in. The same mitigation could be applied to it, which would be to run the Auto-Router behind a private server and sign the route so the Vault can verify it before using the route.

As in the previous point, for now we trust the Keeper and there is no need for such mitigation.

**TL;DR: For now we trust the Keeper and there is no need to implement this type of system**

## Front-Running

Front-running attacks are a type of attack where an attacker aims to have their transaction executed before other transaction in the same block, to take advantage of the operations done in the second transaction or to harm the operation on the second transaction. In its simplest case it allows the attacker, for example, to purchase a unique resource before the second transaction is executed, thus getting hold of the resource and making the second transaction fail.

More complex attacks may involve moving the price of an asset up before the second transaction buys the same asset, either to harm the second transaction or to take advantage of the price difference.

To do this the attacker typically monitors the mem-pool with all unprocessed transactions that still need to be processed by miners. When the attacker finds a transaction that they can take advantage of, they issue a transaction with higher gas price. This increases the chance of their transaction to be picked-up by the mines before the other one, and thus front-running the original transaction.

### Vault Attack Vectors

In the case of the Hedging Vaults we need to consider all the different operations that are performed in order to understand if a front-running attack is possible:

- **Special Access Functions:** in general, all functions that are walled behind Owner or Keeper access are not considered as no external front-runner can exploit them. However we will consider cases in which an attacker could impact the behaviour of such functions by front-running them with other publicly accessible functions.
    - **Configuration Functions:** all configuration functions are only allowed during the Unlocked state but they are not used until the Vault is Locked. Because of this no other transactions in the same block can impact the functionality of the configuration functions.
    - **Committed → Locked State Transition:** the state transition function triggers the Locking of the Vault and its funds to be used in the investment strategy. The only public functions allowed before the state transition that are public are Deposit and Withdraw. If a front-runner issues one of this before the state transition it is OK, as it won’t affect any of the operations. Once Locked the Vault examines the current existing funds and locks them, so any user can update their balances up to the last second.
    - **Locked → Unlocked State Transition:** during the Locked period no public functions are available, so no risk of front-running is of concern. In the future if we allow pending Deposits and Withdraws during the Locked period we need to re-examine this case. However considering that those pending operations would have their own separate ledger, it should not be possible to affect the operations by front-running.
    - **Unlocked → Committed State:** during the Unlocked period all operations are allowed, including Configuration, Deposits and Withdrawals. However as seen above, all configuration functions are orthogonal to the Deposit and Withdraw functions, so they don’t interact with each other, thus they are safe from front-running.
- **Deposit:** deposits depend on the ratio between the existing number of shares and the total amount of assets in the Vault. When depositing a certain amount of assets this ratio is applied, rounded down and the resulting number of shares are sent to the caller. Because of this rounding, there can be a 1-off error in the calculation. If a front-runner takes advantage of this it could cause a depositor to obtain 1 unit less of shares (not a full token, just the last decimal). This is why it is important to choose a sensible amount of decimals for the Shares token representation. This applies to both the Unlocked and Locked state.
- **Withdrawals:** withdrawals depend on the ratio between the existing number of shares and the total amount of assets in the Vault. When withdrawing a certain amount of assets this ratio is applied, rounded down and the resulting number of assets are sent to the caller. Because of this rounding, there can be a 1-off error in the calculation. If a front-runner takes advantage of this it could cause a depositor to obtain 1 unit less of assets (not a full token, just the last decimal). This is why it is important to allow only tokens with a reasonable amount of decimals. This applies to both the Unlocked and the Locked state.
- **Fees:** the fees calculation and sending are only done when transitioning from Locked to Unlock which can only be done independent of any other transactions in the same block, so they are not vulnerable to front-running attacks. The only operations allowed in the same block would be Deposit and Withdrawals requests (not immediate) that won’t affect the fees calculation, and also are not included in the first version of the Hedging Vault

### Potion Buy Action Attack Vectors

Because the action can only be managed by the Vault and the Keeper, it reduces the attack surface for possible front-runners. However, because the action interacts with external entities, it still can be vulnerable to some front-run attacks:

- **Special Access Functions:** similar to the Vault special access functions, these are not considered vulnerable. Configuration can only happen when the action is Unlocked and it does not affect any other functionality until the Action is Locked
- **Enter Position:** during the Unlocked state only the configuration can be changed and only by the Keeper. The existing configuration is used for the investment and the investment is executed. Any front transaction for the same block could only change the configuration and only be performed by the Keeper. The actions performed inside the enter position function are not considered here but in the items below (like swap, for example)
- **Exit Position:** during the Locked state no operations can be performed in the action, so there is no risk of a front-running attack
- **Uniswap Swap:** in this case the attacker could harm the Vault by raising the price of the asset being swapped to. This is known in the space and there are currently only 2 solutions:
    - Use a private mem-pool where the Vault transaction cannot be seen until it is mined. This is not generally available and it seems to be expensive
    - Use a slippage to account for the price of the asset rising. An attacker could still rise the price of the asset to be right on the slippage percentage and make the Vault pay more, but with a proper slippage setting it should not be a problem
- **Potion Buy:** in this case there could be an attack in which the attacker purchases other Potions from the same counterparties as the Buyer just to raise their utilization. This way the Buyer has to pay more for the Potion. This is solved though by having the maximum premium configuration, which is equivalent to the slippage configuration for the swap. Again, an attacker could raise the utilization to be right on the slippage percentage and make the Buyer pay more, but with a proper maximum premium it should not be a problem.

## Sandwich Attacks

A sandwich attack is very similar to a front-running attack, except the attacker not only front-runs the transaction, but also back-runs it, thus making a sandwich, to take advantage of the situation.

In our case, because the front-running doesn’t seems to be feasible, the sandwich attacks would be negated, so no further analysis is needed.

# Glossary

- **Owner:** an actor of the system that originally deploys the Vault. It has access to all admin functions in the Vault
- **Buyer:** an actor of the system that Deposits an asset into a Hedging Vault to obtain Shares of that Vault
- **Potion Provider:** an actor of the system that has a Liquidity Pool to provide liquidity for Potions of a certain type (Asset, Duration)
- **Keeper:** an actor of the system that manages the Vault and selects the investment strategy. It also receives a management fee on each Investment Cycle
- **Counterparties:** actor of the system that provide liquidity in the Potion Protocol and participate by selling Potions to Buyers
- **Hedging Vault**: a vault that implements a rolling-options strategy for all Buyers that participate in it. The Vault returns Hedged Assets to the Buyers that can be trade in secondary markets or retained by the Buyers
- **Hedged Asset:** the type of asset that the Vault is managing on behalf of the Buyers
- **Deposit:** an action by which a Buyer locks a certain amount of Hedged Asset in to the Hedging Vault and makes it available for the next Investment Cycle
- **Withdrawal:** an action by which a Buyer retrieves a certain amount of Hedged Asset from the Hedging Vault thus making it unavailable for the next Investment Cycle
- **Principal:** the total amount of Hedged Asset that the Hedging Vault is managing at a specific moment in time
- **Shares:** a token representing the percentage of Principal that is owned by a Buyer. Each Buyer will receive Shares upon making a Deposit. These Shares can be later exchanged back to the Hedged Asset in proportion to the total number of Shares and the Principal.
- **Investment Cycle**: each cycle for the Hedging Vault. In general each cycle the Vault will accept Deposits, wait for a certain Duration, realize Gain/Losses and then use the new Principal to start another investment cycle
- **Cycle Duration**: the duration of each Investment Cycle
- **Gain/Losses:** the amount of gain or losses that the investment yields each Investment Cycle
- **Premium:** the amount of money paid in order to purchase a Potion
- **Maximum Premium:** the maximum amount of Principal that will be used to pay the Potion’s Premium. It allows to implement slippage protection.
- **Strike Price:** minimum price insured by the Potion. If the Potion expires below this price, the Potion can be exercised. If it expires above this price, then the Potion cannot be exercised
- **Insured Percent:** the percentage of the Principal that will be used for investment on each Investment Cycle
- **Keep3r Network:** network that matches keepers with contracts that need keeping. The contract offers incentives in return
- **Management Fee**: a fixed fee paid on each Investment Cycle to the Keeper for managing the Vault
- **Performance Fee**: a variable fee paid to the Keeper on the gains of each Investment Cycle for choosing profitable strategies

Author Roberto Cano (robercano)