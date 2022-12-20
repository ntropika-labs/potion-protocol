# Potion Hedging Vault - Technical Description v0.2

# Motivation

In the protocol there are 2 main actors: the LP provider and the buyer of potions. Currently the LP provider enjoys a set and forget approach in which the LP adds principal to the liquidity pool and then the system uses the pool each time a buyer wants to buy a Potion. However, the buyer needs to renew the Potion once it expires. This means that the buyer must keep managing the renewal process. If she misses a renewal, the asset she holds would be un-insured and could cause losses.

Besides this, all Potions are paid in USDC, meaning that the buyer has to keep some USDC available at all times to be able to buy Potions.

# Proposal

To have a perpetual hedging vault that automatically purchases new Options every time the previous Options expire. Several **Users** can participate in this Vault at the same time. Each investor can add **Principal** into the vault in the form of the **Hedged Asset**, and the Vault will automatically:

- The **Hedging Vault** will run in back-to-back **Rounds**, minimizing the amount of time that the assets are unprotected
- On each Round, **Users** can add Principal at any moment in time and they will receive a **Deposit** **Receipt** for the current Round
- **Users** can also request a **Withdrawal** from previous deposits. They can do this by exchanging their **Deposit Receipts** for **Withdrawal Receipts.**
- When a Round ends, the **Profit/Loss** from the previous round is realized, **Withdrawals** are processed, setting the corresponding funds aside, and the new **Deposits** are added to the Principal
- The **Hedging Vault** then immediately moves onto the next round and **Swaps** part of the Principal into **USDC** in order to pay for the **Premium** when buying **Potions**
- The Vault buys Potions in order to cover the configured **Hedging Percentage** of the **Hedged Asset,** with the required **Strike Price** and **Duration**
- The new Round has started and investors can again request **Deposits** and **Withdrawals**
- **Users** with **Deposit Receipts** for previous Rounds can also exchange this receipts for the corresponding **Vault Shares** that can be traded in secondary markets
- The Vault Shares can always be used to retrieve a **Withdrawal Receipt** that can be used to withdraw assets from the vault

The automation of the vault round will be done by a third agent called the Operator that has special access to the vault and pays for the gas to perform all management vault operations. This Operator receives an incentive in the form of a Fee for managing the vault. The Operator responsibilities are:

- Cycle the Vault through its different states
- Pay for the gas of all management transactions

# Hedging Vault System

## Architecture

We want the Vault architecture to be as simple as possible first, and then to be as composable as possible. The idea is to follow Opyn implementation in this and implement a main **Vault** contract that handles the **Principal** and the emission of **Shares**. The Vault then allocates a percentage of the principal to each **Action** and notifies the Actions about this amount. The Actions will use the allocated Principal to perform the investment strategy.

This approach allows us to focus on a specific implementation at first (Potions Buying) while not closing the system for additions in the future. It will require more time to come up with a proper design for this, but it will clearly be leaner and follow the separation of responsibilities principle.

The Vault will only accept one type of Asset to deposited into the Vault. This is the asset that the Actions will use for the investment.

![Untitled](Potion%20Hedging%20Vault%20-%20Technical%20Description%20v0%202/Untitled.png)

# Life Cycle

The Hedging Vault, seen as a blackbox, is a system that runs in **Rounds** (i.e. cycles). On each **Round**, a user can deposit funds in the system and get back a **Deposit Receipt** indicating how much it was deposited and for which Round. This receipt is implemented as an ERC-1155 token. Users will be able to use this receipt to recover their funds. The specific procedure will be detailed later on in this section.

At the end of each round, the **Operator** of the vault will trigger the transition from one round to the next. At that moment the **Profit/Loss** from the current round is realized and the funds deposited prior to the transition are made available for hedging through the Potion Protocol.

## Rounds

The system runs in cycles called Rounds. A Round extends from where the **Investment Vault** enters the **Locked** state, until when it exits this state and enters the **Unlocked** state.

Once in the **Unlocked** state, the **Rounds Input Vault** can deposit Assets in the **Investment Vault** to receive Shares, and the **Rounds Output Vault** can redeem its Shares to receive back the Assets. The **Hedging Vault Orchestrator** will signal both **Rounds Vaults** to exchange the available Tokens right before the **Investment Vault** is Locked again. This is done in a single transaction. From a user perspective the funds deposited in the system for Round N, end up invested in the Potion Protocol in the Round N+1.

Similarly when requesting to withdraw funds, the funds requested to be withdrawn on Round N, can be finally retrieved on Round N+1.

# Deposit and Withdrawals

As mentioned before, the **Investment Vault** accepts immediate Deposits and Withdrawals while that Vault is Unlocked. However, due to the Rounds mechanism and the fact that the Rounds are always back to back, we need a way to allow Users to Deposit/Withdraw while the **Investment Vault** is Locked.

This is achieved through the **Rounds Input Vault** and **Rounds Output Vault.** This special Vaults are in charge of registering any Deposit or Withdrawal request and realizing it in the **Investment Vault** in the Round to Round interim. This is possible thanks to the **Hedging Vault Orchestrator** that, during the same transaction, Unlocks the **Investment Vault**, signals both **Rounds Vaults** that it is possible to Deposit/Withdraw \***\*and then Locks the **Investment Vault\*\* again.

Let’s see how Deposits and Withdrawals work from the user experience perspective.

### Deposits

When a user wants to deposit, it does so through the **Rounds Input Vault**. The funds are immediately deposited in this Vault and in return the user gets minted **Deposit Receipt** represented by an ERC-1155 that includes the amount of deposited assets and the Round when the assets where deposited. These **Deposit Receipt** can be later used to request the corresponding Shares. The deposited Assets are still immediately available for Withdrawal until the next Round starts. This is, any **Deposit Receipt** for Round N can be immediately redeemed for Assets during Round N and before Round N+1 starts. This would be the case in which the user changes her mind and wants to reduce the invested amount.

Once the Round N+1 starts, the Assets deposited by the user are invested and not available for immediate withdrawal anymore.

### Withdrawals

The withdrawal mechanism is a bit more involved due to the funds being continuously locked in the **Investment Vault.** In order to withdraw part of the funds, the user must first make a **Withdrawal Request**. First the user must exchange a **Deposit Receipt** for the corresponding Shares in the **Rounds Input Vault**. These shares can then be deposited in the **Rounds Output Vault** in exchange for a **Withdrawal Receipt.** The minting of this receipt signals the Rounds Output Vault that the user wants to redeem the Shares. The deposited Shares are still immediately available for Withdrawal until the next Round starts. This is, any **Withdrawal Receipt** for Round N can be immediately redeemed for Shares during Round N and before Round N+1 starts. This would be the case in which the user changes her mind and wants to still participate in the Vault.

Once the Round N+1 starts, the Shares deposited by the user are redeemed and not available for immediate withdrawal anymore.

# Tokens

There are two types of tokens used in the system, the ERC-20 and the ERC-1155. ERC-20 is used to accept Assets and to emit Shares, while the ERC-11155 is used to emit receipts. These tokens can be exchanged for each other as shown in the diagram below.

![Untitled](Potion%20Hedging%20Vault%20-%20Technical%20Description%20v0%202/Untitled%201.png)

## Assets

This is the main token that the user is interested in hedging. It has one single use:

- **Immediate Deposit**, in any Round. Upon depositing the assets a **Deposit Receipt** will be minted to the user indicating the deposited amount and in which Round it was deposited

## **Deposit Receipts**

These Receipts have two different uses:

- **Immediate Assets Withdrawal**, during the same Round where the Receipt was minted. This is in effect a way of cancelling a Deposit Request in case the User does not want to participate in the Vault.
- **Immediate Shares Withdrawal**, in case the user wants to trade the shares in a secondary market. In this case the user can immediately request Shares for any previous rounds. The **Deposit Receipt** is then traded for this amount of Shares that are deposited in the Users account.

## Shares

These tokens have two different uses:

- **Secondary Market Trading**, where the user can sell the shares freely and any user receiving the shares will effectively participate in the Hedging Vault.
- **Deferred Withdrawal Request,** where the user will deposit the Shares in exchange for a **Withdrawal Receipt**, indicating their intention of withdrawing assets. This Receipt will contain the amount of deposited shares and the Round for which the request was made.

## Withdrawal Receipts

This Receipts have two different uses:

- **Immediate Shares Withdrawal,** during the same Round where the Receipt was minted. This is in effect a way of cancelling a Withdrawal Request in case the User does not want stop participating in the Vault
- **Immediate Assets Withdrawal**, for any Round previous to the current one, in which the Receipt is immediately traded for the assets made available through a Withdrawal Request.

# **Hedging Vault Orchestrator**

The Orchestrator takes care of all the operations needed to execute the Hedging Vault life-cycle. It is managed by the **Operator** and is in charge of talking to the **Potion Buy Action, Investment Vault** and **Rounds Vault.**

It has a single entry point to change to **Next Round** and it receives from the Operator the **Potion Protocol Route**, the **Uniswap V3 In Route**, and the **Uniswap V3 Out Route.** Upon being called, it performs 4 different steps:

- Pass all 3 routes to the **Potion Buy Action** so they can be used for Uniswap Swapping and to Buy Potions
- Exit the current position in the **Investment Vault,** which will realize any gain/loss from the current Round
- Signal the **Rounds Vault** that the window of opportunity has opened for it to deposit and withdraw funds.
- Enter the next position in the **Investment Vault**, which will lock any funds in this Vault

## Roles

- **Operator:** address that operates the **Hedging Vault Orchestrator** and is in charge of cycling the vault by providing the necessary Action parameters.
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Operator address.

## Configuration Values

- **Rounds Input Vault Address:** address of the Rounds Vault to be orchestrated
- **Rounds Output Vault Address:** address of the Rounds Vault to be orchestrated
- **Investment Vault Address:** address of the Investment Vault to be orchestrated
- **Potion Buy Action:** address of the Potion Buy Action to be orchestrated

# **Rounds Input Vault**

Allows users to Deposit Assets and in exchange it mints **Deposit Receipts** (ERC-1155) back to the users for the Deposited Assets Amount and the Round where the deposit was made. When transitioning to a new Round, the Rounds Input Vault deposits all assets into the **Investment Vault.** In exchange the Investment Vault will mint Shares to the Rounds Input Vault which will keep them on behalf of all the users that deposited funds. As mentioned before any user can trade a **Deposit Receipt** minted in a previous round for the corresponding amount of Shares.

This Vault also tracks the exchange rate of Assets to Shares and viceversa for each round, so it can calculate how many Shares are to be given to a user when they exchange a **Deposit Receipt** for **Shares**.

## Roles

- **Operator:** address that can cycle to the next round. Set to the **Hedging Vault Orchestrator** address.
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Operator address.

## Configuration Values

- **Investment Vault Address:** address of the Investment Vault where Assets will be deposited

# Rounds Output Vault

Allows users to Deposit Shares and in exchange it mints **Withdrawal Receipts** back to the users for the Deposited Shares Amount and the Round where the deposit was made. When transitioning to a new Round, the Rounds Output Vault redeems returns all shares to the **Investment Vault.** In exchange the Investment Vault will return to the Rounds Output Vault the corresponding amount of assets, which will keep this assets on behalf of all the users that requested a Withdrawal. As mentioned before any user can trade a **Withdrawal Receipt** minted in a previous round for the corresponding amount of Assets.

This Vault also tracks the exchange rate of Assets to Shares and viceversa for each round, so it can calculate how many Assets are to be given to a user when they Deposit **Shares** into the Vault.

## Roles

- **Operator:** address that can cycle to the next round. Set to the **Hedging Vault Orchestrator** address.
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Operator address.

## Configuration Values

- **Investment Vault Address:** address of the Investment Vault where Shares will be redeemed from

# Rounds Vault Exchanger

This is a helper component that allows a user to exchange a **Deposit Receipt** for a **Withdrawal Receipt** in one single transaction. It just exchanges the Deposit Receipt for the corresponding Shares in the **Rounds Input Vault** and then deposits the Shares into the **Rounds Output Vault** to mint the **Withdrawal Receipt.**

# **Investment Vault**

It is the actual vault that holds the funds of the investors and executes the investment strategy by means of the Potion Buy Action. In this version of the system the only allowed investors are the **Rounds Input Vault** and the **Rounds Output Vault.**

## Life Cycle

There are two different life-cycles in the system: one for the **Hedging Vault System** itself and the other one for the **Investment Vault.** The former arising from the latter. This life-cycles are controlled by the **Hedging Vault Orchestrator.**

![Untitled](Potion%20Hedging%20Vault%20-%20Technical%20Description%20v0%202/Untitled%202.png)

The Investment Vault life-cycle consists of 2 states:

- **Unlocked**: in which an investor can deposit funds into the vault and receive Fungible Shares in exchange
- **Locked:** where the Funds of the vault are locked and will be used for the investment. Any Deposits and Withdraws are not allowed. The investment strategy is executed and the Vault will wait for the Duration before it can get Unlocked

This life-cycle is internal to the system and not experienced by the user

## Roles

- **Operator:** address that operates the **Investment Vault** and is in charge of cycling the vault by providing the necessary Action parameters. This is set to the **Hedging Vault Orchestrator** address
- **Strategist:** address than can change the Configuration Values of the Investment Vault in order to implement a different strategy
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Operator and the Strategist address
- **Investor:** only the **Rounds Input Vault** and the **Rounds Output Vault** are allowed to deposit assets and redeem Shares

## Configuration Values

- **Investment Asset:** the ERC-20 token that the vault will manage as the investment asset, and that will be passed to the Potion Buy Action for it to be hedged
- **Investment Actions:** the list of actions that will implement the investment strategy for this Vault. In this case it will be only the Potion Buy Action
- **Principal Percentages**: the percentage of the Principal allocated to each Action. It does not have to add up to 100%. This allows for strategies similar to protective-puts to be implemented by not investing the whole principal. The Principal Percentages configuration allow having less than 100% of the Principal insured with a Potion.
- **Management Fee:** this fee is typically used to incentivize an Operator to take care of the Vault. It is a percentage applied on the Principal on each Investment Round. The more Principal in the Vault, the more attractive the Vault will be to a prospect Operator. The fee recipient however is unlinked from the Operator role and can be freely configured.
- **Performance Fee:** this fee is typically used to incentivize an Operator to choose profitable strategies for the Vault. It is a percentage applied on the gains between the last Investment Round and the next. The fee recipient however is unlinked from the Strategist role and can be freely configured.
- **Fee Recipient:** the recipient of the management and performance fee, in case it is different than the Operator. **NOTE:** at this moment in time there is only 1 fees recipient. We may want to implement different recipients for each type of fee

# Investment Actions

The Investment Vault has a list of Actions that must be executed in order for the investment strategy. This list of actions will have two different methods:

- **Enter Position:** this is called when the Vault enters the Locked state, and it signals the action to invest the given amount of Principal according to its logic
- **Exit Position:** this is called when the Vault exits the Locked state, and it signals the action to realize the investment gain/losses and return the new Principal back to the Vault

The Actions are configured through their own interface to allow for flexibility in the strategies. The Vault is the owner of the Actions and only the Vault can call enter/exit position, while the operator can configure the Actions.

The Action also receives the following parameters when the Vault calls Enter Position, so the Action can effectively execute the investment strategy:

- **Principal:** amount of the Hedged Asset that must be insured

# Potion Buy Action

The Potion Buy action implements the hedging of the received assets. For this it uses the Potion Protocol to buy Potions in order to protect the received funds for a certain **Strike Percentage**

For the first version of the Hedging Vault only the Potion Buy strategy will be implemented. This strategy is explained in the [Proposal](#proposal) section.

## Life Cycle

![Untitled](Potion%20Hedging%20Vault%20-%20Technical%20Description%20v0%202/Untitled%203.png)

The Action has 2 states:

- **Unlocked:** an state where configuration values can be changed freely by the Operator
- **Locked:** no more configuration is possible and the received funds are used to perform the investment

## Roles

- **Operator:** address that operates the **Potion Buy Action** and is in charge of signaling when an investment round starts and end, and provides the necessary Action parameters. This is set to the **Hedging Vault Orchestrator** address
- **Strategist:** address than can change the Configuration Values of the Investment Vault in order to implement a different strategy
- **Owner:** initially is the deployer of the contract and has access to admin functions. Among them, it can change the Operator and the Strategist address

## Configuration Values

The Potion Buy Action works with only 1 type of insured asset (Principal Asset) and has the following configurable values:

- **Round Duration**: the duration of the Potion to be purchased. This must be aligned with the duration of the round configured in the Investment Vault
- **Strike Percentage**: used to calculate the strike price of the Potion by applying the percentage to the spot price at the moment the Potion is going to be purchased
- **Maximum Premium Percentage:** the maximum percentage of the received funds that can be used to pay the Potions premium. If the calculated maximum premium exceeds this percentage, the transaction will be reverted
- **Premium Slippage:** slippage percentage applied to the expected premium in order to calculate the maximum premium to be paid when purchasing Potions
- **Swap Slippage:** slippage percentage applied to the swap amounts when swapping in Uniswap
  - For the swap from Hedged Asset to USDC it is applied to the expected input Hedged Asset amount to calculate the maximum amount of Hedged Asset that is allowed to be swapped for USDC
  - For the swap from USDC to Hedged Asset, it is applied to the expected output amount of Hedged Asset to calculate the minimum amount of Hedged Asset that is to be received after the swap
- **Maximum Swap Duration**: used to calculate a deadline for the swap operation. The deadline is the block timestamp for the transaction plus this swap duration. If the transaction is mined after the deadline, the transaction reverts. This is implemented on Uniswap

## Potion and Uniswap Routes

Before the Potion Buy Action can enter the investment position, it needs to passed the Potion and Uniswap routes for it to use these two services. The routes are passed by the **Hedging Vault Orchestrator** while the Action is Unlocked (although they could be passed at any moment).

### Potion Route

It is a set of parameters that allows the Potion Buy Action to purchase Potions from the Potion Protocol. It contains the following parameters:

- **Target Potion Address**: the Potion (OToken) address that will mint the Potions for the Potion Buy Action. Used to verify that we are buying the right Potion.
- **Underlying Asset Address:** the asset underlying the Potion. It must be the same as the Investment Asset and it is used to verify that we are hedging the right asset
- **Strike Price in USDC:** the strike price denominated in USDC at which we want to buy Potions
- **Expiration Timestamp:** the timestamp for the end of the current Round, used to buy Potion for the correct duration and make sure the asset is hedged for the duration of the Round
- **Counterparties List:** the list of LP providers and order sizes that the Action will use to purchase the Potions from the Potion Protocol
- **Expected Premium in USDC:** the expected premium when purchasing the Potions. Used to calculate the maximum premium that is used to protect the investment from slippage
- **Total Size in Potions:** the sum of all order sizes in the Counterparties List. Used as the number of potions to be purchased. The Potion Protocol will verify that this amount and the total sum of order sizes in the Counterparties List match

### Uniswap Route

It is a set of parameters that allows the Potion Buy Action contract to interact with the Uniswap V3 protocol in order to swap the Hedged Asset for USDC and viceversa.

- **Input Token:** the input token for the swap
  - It is the Hedged Asset when swapping from Hedged Asset → USDC
  - It is USDC when swapping from USDC → Hedged Asset
- **Output Token**: the output token for the swap
  - It is USDC when swapping from Hedged Asset → USDC
  - It is the Hedged Asset when swapping from USDC → Hedged Asset
- **Expected Price Rate:** the price rate that is to be expected during the swap. Used to get the maximum/minimum rate by applying the Swap Slippage
- **Swap Path:** the list of Uniswap V3 pools to be used for the swap

# Strategist Configuration

As of the writing of this document there is no clear approach for the Strategist configuration.

Looking at Mellow Finance, they use a Pull approach for this. The Configuration is set in an external contract that is then known to the Investment Vault and Potion Buy Action. The Vault and the Action will pull the config from the next round from this contract. This way, an external Actor, like the Strategist, can push the information into this external Contract, and it will be used when the Vault transitions to the next round.

This will also allow us to implement Governance on top of the Configuration contract, as its writing can be protected by Governance, delayed with a Timelock and so on.

## ERC-20 and Ether

The **Hedging Vault System** only accepts ERC-20 compatible tokens for the **Hedged Asset**. In the case of ETH, it must be wrapped into WETH before being deposited in the system. There is no automatic conversion of ETH into WETH at this moment.

# Correcting Factor

The correcting factor is a formula that allows the Hedging Vault to correctly calculate the amount of Puts that must be bought to cover the Principal after some of the Principal has been used as a Premium. As the number of Puts and the Premium are interrelated, this is a complex calculation that could be asymptotically approached to yield the correct number.

However, an estimation suffices to get a number close enough that can be actioned. This calculation happens in the Operator side, when calculating the Potion Routes, and again in the contract in order to validate that the actual Hedging Rate after buying the Puts is inside a required range.

The calculation can be found in a separate document: [Correcting Factor for Synthetic Call Strategy](./Correcting%20Factor%20for%20Synthetic%20Call%20Strategy.md).

# Fallback Strategies

The Hedging Vault system allows for fallback strategies to be defined in case the main strategy fails for whatever reason. This kind of strategy is implemented in the **Hedging Vault Orchestrator** with support of the **Investment Vault.** The Vault allows for a set of Actions to be added to the contract. Then, on each cycle, the Orchestrator can trigger a combination of those actions to be executed, including the percentages of principal that are assigned to each action. This combination is called the **\*\***\*\*\*\***\*\***Strategy**\*\***\*\*\*\***\*\***. Any number of strategies can be executed in this way. If any of those strategies fail, the Orchestrator an recognize this case and re-try with a different Strategy to try to alleviate the problem. This is done automatically in the same transaction. Measures must be taken to ensure that the gas cost is kept under control when implementing automatic-fallback strategies.

The Orchestrator currently catches ANY revert that happens in the Potion Buy Action, and if so, triggers the Swap To USDC Action. Further refinement could be done in the Orchestrator to treat different reverts in a different way and implement a more complex strategy switching.

## Swap To USDC Action

In this version of the Hedging Vault, the Swap To USDC fallback strategy is implemented. In this strategy, the amount of principal indicated by the Hedging Rate is swapped to USDC, to protect the hedged amount from the downside. It also will miss the upside though. The implementation of this action re-uses part of the Potion Buy Action to do the swap in Uniswap.

For this strategy to be implemented, the Operator will need to generate 2 new routes: the Uniswap route to Swap the current USDC amount back to Underlying at exit position, and the route to swap the hedged amount of Underlying to USDC at enter position. These 2 new routes along the previous information will be sent to the Orchestrator so it can manage both strategies.

# Glossary

- **Owner:** an actor of the system that originally deploys the Vault. It has access to all admin functions in the Vault
- **User:** an actor of the system that Deposits an asset into a Hedging Vault to obtain Shares of that Vault
- **Potion Provider:** an actor of the system that has a Liquidity Pool to provide liquidity for Potions of a certain type (Asset, Duration)
- **Operator:** an actor of the system that manages the Vault rounds. It also receives a management fee on each Investment Round
- **Strategist:** an actor of the system that has privileged access to change the Configuration Parameters of the Vault for fine tune the investment strategy
- **Counterparties:** actor of the system that provide liquidity in the Potion Protocol and participate by selling Potions to Users
- **Hedging Vault**: a vault that implements a rolling-options strategy for all Users that participate in it. The Vault returns Hedged Assets to the Users that can be trade in secondary markets or retained by the Users
- **Hedged Asset:** the type of asset that the Vault is managing on behalf of the Users
- **Deposit:** an action by which a User locks a certain amount of Hedged Asset in to the Hedging Vault and makes it available for the next Investment Round
- **Deposit Receipt:** an ERC-1155 token representing an amount of Deposited Assets for a certain Round N
- **Withdrawal:** an action by which a User retrieves a certain amount of Hedged Asset from the Hedging Vault thus making it unavailable for the next Investment Round
- **Withdrawal Receipt:** an ERC-1155 token representing an amount of Deposited Shares for a certain Round N
- **Principal:** the total amount of Hedged Asset that the Hedging Vault is managing at a specific moment in time
- **Shares:** a token representing the percentage of Principal that is owned by a User. Each User will receive Shares upon making a Deposit. These Shares can be later exchanged back to the Hedged Asset in proportion to the total number of Shares and the Principal.
- **Investment Round**: each cycle for the Hedging Vault in which deposits made by users are added to the hedged principal, withdrawals from users are processed and the resulting Principal is protected
- **Round Duration**: the duration of each Investment Round
- **Gain/Losses:** the amount of gain or losses that the investment yields each Investment Round
- **Premium:** the amount of money paid in order to purchase a Potion
- **Maximum Premium:** the maximum amount of Principal that will be used to pay the Potion’s Premium. It allows to implement slippage protection.
- **Strike Price:** minimum price insured by the Potion. If the Potion expires below this price, the Potion can be exercised. If it expires above this price, then the Potion cannot be exercised
- **Insured Percent:** the percentage of the Principal that will be used for investment on each Investment Round
- **Keep3r Network:** network that matches keepers with contracts that need keeping. The contract offers incentives in return
- **Management Fee**: a fixed fee paid on each Investment Round to the Operator for managing the Vault
- **Performance Fee**: a variable fee paid to the Operator on the gains of each Investment Round for choosing profitable strategies
- **Fallback Strategy:** a set of Actions executed when the main investment strategy has reverted

Author Roberto Cano (robercano)
