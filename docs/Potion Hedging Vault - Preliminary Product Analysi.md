# Potion Hedging Vault - Preliminary Product Analysis

# DISCLAIMER

This document is a preliminary document used when designing the Hedging Vault and DOES NOT represent the final product, but just a conversation that led to the final design. Please refer to the Potion Hedging Vault - Product Analysis v0.2 document for a version describing the implementation.

# Introduction

This document discusses a potential design for the Hedging Vault from a product perspective. It is meant to guide the technical development of the product and it needs to be agreed upon all product owners.

# 1. Motivation

In the Potion Protocol there are currently two main actors participating in the system: the LP provider and the Buyer of potions (put options). Currently the LP provider enjoys a set and forget approach in which the LP adds collateral to the liquidity pool and then the system automatically uses the pool each time a Buyer wants to buy a Potion. The LP can add liquidity or remove liquidity, but they don’t necessarily need to actively manage the pool, unless they want to update its internal parameters such as the bonding curve.

However for the Buyer it is different. A Potion has an expiration date, and once this date is due, the Potion does not cover the insured assets anymore. If the Buyer wants to keep the assets insured they must manually buy a new Potion for the same assets with a new expiration date.

Besides this, all Potions are paid in USDC, meaning that the Buyer has to keep some USDC available at all times to be able to buy Potions.

# 2. Product Proposal

To have a rolling-option smart contract called the **Hedging Vault.** This vault has the following main characteristics:

- Insures one asset only, called the **Hedged Asset.**
  - Assets can be any ERC-20, including LP tokens like those of Balancer, allowing for more complex strategies to be implemented.
- A **Hedging Vault** product is defined by the following characteristics:
  - **Hedged Asset**: the asset to be insured
  - **Premium Slippage**: a slippage allowed when buying Potions
  - **Swap Slippage**: a slippage allowed when swapping the hedged asset for USDC and viceversa
  - **Cycle Duration**: the duration of the Cycle Investment
  - **OTM Percentage**: the percentage of the Spot price of the Hedge Asset that will be used to calculate the Strike Price
  - **Hedging Percentage**: the percentage of the deposited asset that is insured on each cycle
- Several **Buyers** can participate in this Vault at the same time.
  - Each Buyer can **Deposit** an amount of the **Hedged Asset** into the Vault, and they receive a **Share** token in return, which represents their share of the Vault.
  - The Buyers can also trade their received Shares in a secondary market if they want to do so.
- The Vault will continuously insure a certain percentage (the **Hedging Percentage)** of the deposited Hedged Asset, using put options for a certain **Strike Price**, calculated from the OTM Percentage \***\*and a certain **Duration,\*\* the Cycle Duration:
  - The set of Hedged Asset, Hedging Percentage, Strike Price and Duration defines the particular **Investment Strategy** of the vault.
  - The investment strategy is clear to the participants of the Vault in advance, so they can always know what will be done with their assets
  - There can be infinitely many Vaults, each with its own investment strategy.
- The Vault auto-purchases new insurance (put options) once the previous is expired, using **Investment Cycles.**
  - The Vault uses the Potion Protocol on the background to purchase put options for the Hedged Asset in the Vault.
  - In order to do so, it converts part of the Assets into USDC to pay for premiums.
  - After each cycle the vault will realize any gain/losses derived from the selected investment strategy.
  - After each Cycle the Buyers can decide to **Withdraw** all or part of their investment by redeeming their Shares, thus realizing their own gain/losses, or even **Deposit** more Hedged Asset into the vault.
  - This Cycle continues forever and the Buyers enjoy a **set and forget** experience by being permanently insured.

# 3. User Flow

The main flow of the Hedging Vault goes as follows:

1. A **Buyer** can access the list of **Vaults** available in the system through a Web3 frontend and choose the one that suits them best.
2. Along the information they can see for each **Vault**, they can check:
   1. The **Hedged Asset** being insured by the Vault
   2. The **Investment Cycle** **Duration** in days
   3. The **OTM Percentage** used by the vault in % of the spot price (e.g. 80% being 20% OTM)
   4. The **Hedging Percentage,** the percentage of the Hedged Assets that will be insured
   5. The maximum **Cycle Premium**, calculated from:
      1. Max Premium for the put option Premium paid to Potion LPs, as % of order size
      2. Max Slippage for the USDC swap in Uniswap. The USDC is used to pay for the Potion premium
   6. Whether the Vault is currently open for **Deposits** or it is executing an **Investment Cycle**
   7. **Management** and **Success** **Percentage Fees** charged each cycle by the vault.
3. If the Vault is **Open** for Deposits they can continue, otherwise they need to wait until the current Investment Cycle is over
   - _Note: this could be improved on a second iteration of the product by allowing for queued deposits or withdrawals, but it is removed from first iteration for simplicity._
4. The Buyer **Selects** a Vault and decides to Deposit a certain amount of the Asset
5. The Buyer **Approves** the Vault for the specific amount to be Deposited
6. The Buyer **Deposits** the amount into the Vault and **Receives** an amount of **Shares** representing their share in the Vault, as ERC20 tokens in their Ethereum wallet.
7. The Vault **Executes** the next **Investment Cycle** and the assets are locked in the Vault until it is finished
8. The **Investment Cycles** ends and the assets are **Unlocked**
9. At this moment the Buyer can perform two actions:
   1. **Redeem** all or part of their Shares to retrieve their corresponding assets back. At that moment all gains/losses are realized.
   2. **Deposit** more assets into the vault to participate more in the investment strategy

# 4. System Overview

## 4.1 Introduction

The system will have at its center an element called the Hedging Vault. This Vault will be composed of several Smart Contracts, but for the scope of this document we will consider it a single piece of code living in the Blockchain and having all the characteristics and limitations of a Smart Contract.

As detailed below, the **automated** nature required for the Vault, in which the strategy is renovated cyclically, must be actioned by an agent of the system, typically external to the user. The Vault needs three main actions to be executed cyclically:

- Specifying/committing some parameters of the Strategy
- Executing the Strategy, i.e. swapping for USDC and purchasing corresponding put options
- Realizing the Payout, i.e. exercising put options

The first action is critical as it will affect the performance of the Vault in the long term. Well chosen Strategy parameters can make the Vault perform very well, while poorly chosen parameters could be detrimental for the Vault.

- _Note: it is still unclear which parameters will be fixed for the vault at deployment (e.g. asset, duration, strike, %hedge?) and which will be variable/committable each cycle (e.g. specific LP counter-parties)._

The second and third action, however, are trustless and could be executed by anyone, given that the execution is based upon the parameters configured in the first action. Nonetheless it is important that the second and third actions ARE executed, otherwise the asset could remain un-insured for the intended period until somebody executes the strategy.

Precisely because of this, it seems reasonable to think that the three actions would be executed by the same agent. We will call this agent the **Keeper**, which will be in charge of setting the parameter of the investment strategy, executing the strategy, and realizing the payout. The Keeper has a very important role in the system and Trust must be ensured, as the Keeper has the power to make the Vault perform well or bad.

We will divide the system between Agents, which are active users of the system, and Components, which are passive elements of the system.

## 4.2 Agents

There are three active agents participating in the Hedging Vault product:

- The **Liquidity Provider,** which is the agent of the Potion protocol providing the necessary collateral for insuring the assets through the selling of Potions
- The **Buyer,** which is the agent participates in the Vault and is interested in insuring a specific amount of a specific asset. This specific asset is called the **Hedged Asset.**
- The **Keeper,** which is the agent interested in managing the Hedging Vault and selecting certain parameters of the investment strategy in order to improve the Vault performance for the **Buyers**. It also executes the strategy and realizes the payout. In exchange they receive an incentive (management & success fee) for doing so.

**NOTE**: there is a fourth (typically non-active) agent, the **Admin/Owner,** which deploys the Vault, specifies the hard-coded parameters of the Vault, elects the Keeper, and has the ability to emergency pause or upgrade the Vault contracts.

## 4.3 **Components**

- The **Potion Protocol**, which allows the Liquidity Provider to provide liquidity and sell Potions
- The Hedging Vault, which buys Potions on behalf of its users in order to insure the Hedged Asset
- The **Swap Protocol** (like Uniswap) which allows to swap the Hedge Asset for USDC in order to pay for the Potion Premium. It is used in the background without direct interaction with the user.
- The **DApp**, that allows LPs to easily add liquidity, and Buyers to participate in the Hedging Vaults. It could also even provide an easy interface restricted to the Keeper to select and execute the strategy.

## 4.4 System Flow

1. The **LPs** create **Pools** in the **Potion Protocol** with USDC collateral to be able to sell Potions. This is already part of the existing protocol.
2. A new **Hedging Vault** is deployed in the system by the protocol owner to provide rolling options for a certain asset. Each vault will manage one asset only, the **Hedged Asset** and it defines the following product parameters in it:
   1. **Cycle Duration**: the duration of the investment cycle
   2. **Strike Percentage:** the strike price of purchased put options as % of spot price
   3. **Insured Percentage**: \*\*\*\*the percentage of the deposited principal that will insured each cycle
   4. **Max Uniswap Slippage: :** percentage of slippage that is allowed when swapping the hedged asset for USDC and back
   5. **Max** **Premium / Potion**: maximum premium as percentage of order size slippage that is allowed when paying the premium for the Potions
3. **Buyers** discover this **Hedging Vault** and decide to participate in it. For this they deposit a certain amount of the **Hedged Asset** into the vault and, in exchange, they receive an amount of **Shares** of the vault.
4. The **Keeper** commits the **LP** counter-parties that will be used to purchase potions from.
5. The **Buyers** can see the committed counter-parties and decide whether they want to stay in the vault for the next cycle or they perceive the Keeper’s choice as malicious. For this there is a Cool-down period in which Shares can be redeemed for the Hedged Asset, in case Buyers do not want to participate in the strategy.
6. Once the **Cool-down** period is over, the investment strategy is executed by the **Keeper** and the Hedged Asset is locked in the vault until the cycle expires. The necessary part of the assets will be converted to USDC to pay for premiums. Only the **Keeper** can perform this action.
   - _Note: we need a fallback for the scenario premium > maxPremium._
7. Once the **Investment Cycle** expires, the potions must be exercised, the USDC payout swapped back to the Hedged Asset, and thus assets become unlocked. This can be done by the **Keeper** or by any user interested in doing so.
8. Go to Step 4 for a new investment cycle

# 5. Keeper Trust Model

The **Keeper** has a key role in the system. It is an agent that will choose the investment strategy and execute it after the Cool-down has passed. A correct investment strategy is key to the performance of the vault.

This **Keeper** is just an agent that is able to smartly choose the parameters for the strategy of the next Investment Cycle, and that timely executes this strategy. It also timely realizes the payout.

There are several options for this Keeper:

- The **Keeper** is also the **Owner** of the protocol (single wallet) and they run the investment strategy as part of their daily operations. In this case if the **Buyers** trust the Potion Protocol they should also trust the **Keeper**
- The **Keeper** is a multi-sig operated by several people. A proposal to set certain strategy parameters can be set up for vote and if it is accepted the strategy can be executed.
- The **Keeper** is a smart-contract with strategy selection abilities that can accurately choose the right strategy for the next investment cycle, and it only needs some user to pay for the transaction in order to execute it.
- The **Keeper** is an incentivized third-party that will earn management and performance fees for choosing a good strategy for the vault and paying for the gas of the transactions. The incentive is there to keep the Keeper honest.

In general the technical implementation of the Vault should not change much whatever type of Keeper is chosen. In particular an implementation that:

- Limits the ability of the Keeper to interact with the contract (by allowing only to set some strategy parameters like LPs, execute the strategy and realize the payout)
- Allows to define the incentive percentages (management and performance)
- Define which wallet will receive the incentives (recipient)

can cover all the different Keeper cases:

- If the **Keeper** is the **Owner** then, themselves, can already execute all functions in the Vault, and they could incentivize themselves, or set the fees to 0% if desired. The recipient, if needed, would also be the Owner address
- If the **Keeper** is a **Multi-Sig**, the Keeper \*\*\*\*is set to the multi-sig address, the incentives can be set to any desired value, and the recip
- ient of the fees can be set to any address (for example the Treasury address if the multi-sig is a DAO), even to the multi-sig address itself
- If the **Keeper** is a **smart-contract** with strategy selection capabilities, the Keeper can be set to the address of that contract, the incentives to whatever is needed, and the recipient to either the smart-contract, or to the user that pays for the transaction to execute the strategy, for example.
- Finally if the **Keeper** is an incentivized **third-party**, the Keeper is set the address of the third-party, the fees are set accordingly to properly incentivize the role, and the recipient is also set to the address of the third-party

Properly incentivizing the Keeper is critical for the Trust Model to work. The exact model is not clear at this point, but the technical implementation should allow for any model that we come up with, without impacting the implementation too much.

## 5.1 Risk Assessment for the Keeper Role

### Malicious Investment Parameters

The Keeper will choose the investment parameters such as the LP counter-parties (**\*[TBD1]** if also Cycle Duration, Strike Price, Potion Slippage, Uniswap Slippage and Principal Percentages\*). If any of the parameters is malicious or skewed to benefit the Keeper, the current system provides the following two mechanisms to mitigate it:

- The **Owner** can always execute an emergency lock in case it is detected that something is wrong with the vault or the investment strategy
- The **Buyers** have a Cool-down period in which they can decide to Withdraw their assets if they don’t want to participate in the next cycle

Other considerations:

- Keeper trust can be minimized by limiting the amount of parameters that the Keeper can change.
- The Owner might need to be able to change the rest of the parameters in case that is needed in an emergency (e.g. via smart contract upgrade).
- The incentive system should be strong enough for the Keeper to fear somebody taking notice of foul-play and thus loosing the long term revenue stream from the Vault.
- The Keeper could further be disincentivized by being required a stake by the Owner.

### Tampering with the list of Counterparties

- The Router is the piece of software that provides the list of LPs that will be used in a particular Potion sell. It aims to optimize the utilization of the LPs and, in turn, minimize the premium paid by the Buyer. The Router is currently run in the Buyer’s browser which has no incentive to tamper with it, as then the Premium would be higher.

- However for the **Keeper this** is different, as Keeper runs the investment strategy on behalf of the Buyers. Although there is an incentive for the Keeper to behave correctly, they could decide to benefit certain LPs because they themselves benefit from it. In such case the Keeper could tamper with the list of counterparties.

- To prevent such a scenario, the Router should be run by the protocol owner behind a private server. This Router would sign the list of counterparties and send it to the Keeper. The Keeper is not able anymore to tamper with this list, because it would change the signature, and the Keeper does not have access to the signing keys. The list is sent to the Hedging Vault which will validate the signature and accept only valid ones.
  - Note: this is an advanced feature, so ideally it should be placed in a second iteration for the product roadmap. Initially, more trust can be given to the Keeper (by equating it to the Owner, for instance). Same idea could apply to Uniswap swap params.

# 7. Other Risks

## Uncovered Assets

The assets that are insured every cycle, will be insured for a certain duration, which means the insurance will finish at a specific block timestamp, and thus a specific block number. The potions cannot be settled until they are expired, and the vault expects to get the payout back before it executes the next cycle. Because we cannot control at which block the Keeper transaction is going to be executed, it is likely that there will be several blocks at which the assets are uncovered between the Potion expiration block number and the block number where the new investment cycle transaction is mined.

## Failed Investment Cycle Execution

It could be that due to market conditions, the investment cycle cannot be executed. For example, when the premium is greater than the maximum premium allowed. In such case a **Fallback Strategy** could be implemented in which the assets are swapped into USDC to preserve their value. This means no downside, but also no upside. However it is better than the price of the asset going to zero and losing all the value of the investment in the cycle.

## **Fallback Strategy Failure**

It could be that the fallback strategy cannot be executed either, due to Uniswap (for example) not having enough liquidity, having a slippage too big or some other unforeseen error. In such a case the Vault would stall and cannot do anything with the assets in it. This would be considered a **Critical Error.** In such case the Vault would be in Withdrawal mode indefinitely so the investors can retrieve their assets if they want.

# 8. Roadmap

## MVP (V0)

The MVP includes the following functionality:

- The Vault has fixed parameters set at deploy time by the Admin. This investment parameters are applied all cycles (for security reasons, the admin of the vault can change this parameters in case it is needed)
- The Keeper job is done manually, executed by a person through a wallet
- The Keeper has the following responsibilities:
  - ~~Choose the Vault investment parameters for each Cycle~~ (left here for reference)
  - Retrieve a Uniswap Route to do the Asset → USDC swap
  - Retrieve the list of Counterparties from the Potion Router in order to buy the Potions
  - Pay for the transaction to enter the investment cycle
  - Retrieve a Uniswap Route to do the USDC → Asset swap
  - Pay for the transaction to exit the investment cycle
- The investors have a small time window (Investment Window) in which they can deposit and withdraw funds
- The investors cannot move their funds (deposit or withdrawal) outside of the aforementioned time window
- On entering the investment cycle, the vault executes the following steps:
  - Swap part of the principal to USDC in order to pay for the Potion premiums
  - Make sure that the Maximum Premium configured in the Vault is not surpassed
  - Make sure that the Maximum Swap Slippage configured in the Vault is not surpassed
  - Make sure that the Maximum Potion Buy Slippage configured in the Vault is not surpassed
  - Buy a number of Potions determined by the Hedging Percentage configured in the Vault
- On exiting the investment cycle, the vault executes the following steps:
  - Exercise the Potions if possible and retrieve the Payout
  - If there was Payout, Swap the payout in USDC back to the hedging asset
  - Make all the principal + payout available to investors for withdrawal until next cycle starts

## Deferred Withdrawals Vault (V0.1)

- The Investment Window is removed and the investors can directly deposit and withdraw outside of the investment cycle
- They can request a deferred deposit while an investment Cycle is active. The deposited asset is kept in the vault in a separate ledger and will be made available as principal for the vault the moment the current cycle ends
- They can request a deferred withdrawal while an investment cycle is active. The requested amount will be made available once the current cycle ends. The investors will need to retrieve the amount set aside once it is made available. This in particular means that deferred withdrawals need 2 transactions from the investor.
- An investor can make any number of deferred deposits while an investment cycle is active. This creates a deferred credit for the investor, which is the amount that they have deposited while the investment was still active. If they request a withdrawal during that same time, of an amount that does not exceed the current deferred credit for the investor, then they can perform an immediate withdrawal, which means they decrease their deferred credit and they get back the hedged asset immediately. The remaining deferred credit will be made available as the vault principal as soon as the next investment cycle starts
- The transition from one investment cycle to the next still happens in 2 steps (2 internal transactions executed by the Vault helper contract): exit current investment cycle → enter new investment cycle. This is done to simplify the incremental in complexity in the Vault code. However it can be implemented using a single transaction from the point of view of the Keeper

## Fallback Strategy Vault (V0.2)

- The Vault allows to define Fallback actions, which is the list of actions to be executed in case a main Action fails to execute
- Each main Action (like Potion Buy Action) can have an unlimited list of fallback actions
- If the main Action fails, the first Fallback Action in the list executes
- If that fallback action fails, then the next in the list is executed. This continues until one of the fallback actions executes correctly or we run out of fallback actions to execute
- Using Fallback Actions the Vault defines a fallback for the Potion Buy in which the corresponding hedging percentage is swapped into USDC and kept in the Vault during the investment cycle

## Automated Keeper (V0.3)

- The 2 steps transition from a previous cycle to the next disappears and instead a single transition (1 transaction) is used to move from a previous cycle to a new cycle
- From the block where the potion expires no more deposits or withdrawals are allowed until the next cycle starts. This allows the Keeper to check the exact amount of principal in the vault, calculate the Payout and request a Potion Route for the exact amount of Principal that needs to be insured
- In the cycle transition, the following actions are executed:
  - Deferred deposits are made available to the Vault Principal
  - Deferred withdrawals are kept aside for investors to retrieve
  - Previous potions are exercised, payout retrieved and made available to the Vault Principal, and the new investment is executed.
- The Keeper only needs to do 1 transaction to move the Vault to the next cycle
- Because of this, the Keeper can be further automated by using a Relayer:
  - The Keeper becomes a Bot using a Relayer to pay for the transaction
  - It is configured so it transitions the Vault at the right time
  - The Relayer must be funded externally
- NOTE: Extra care must be put into understanding how much gas fees will be paid each time

## Self-Sustainable Vault (V0.4)

- The Relayer is set as the recipient of the Vault fees, receiving an amount of the principal each cycle. This self-funds the Relayer, which can then (in theory) run forever while there is enough principal in the Vault

## Miscellanous Ideas Vault (V0.x)

- The Uniswap Route is fetched off-chained and could be tampered with. The Keeper wallet (or Relayer in case of automated Keeper) could sign the Route data so the Vault contract can verify that the data is trusted
- The same applies for the Potion Counterparties list. it could be signed by the Keeper wallet so it can be verified by the Vault
- With the previous implementation there is a risk of uncovered assets because the Vault can only transition once the Potion has expired. It can try to buy the new Potions in the very same block that the previous Potions expired, but due to system restrictions (in particular the miners fees in the form of gas price), there is no assurance that this will happen. If it is a concern that the assets may be uncovered for a few blocks, we could implement a 2-off investment cycle:
  - Potions are bought at investment Cycle 1
  - Before Potions from Cycle 1 expire, we buy Potions for investment cycle 2 without taking into account the payout
  - Potions from Cycle 1 are exercised if possible and payout received. This Payout is made available for Cycle 3
  - Before Potions from Cycle 2 expire, we buy Potions for investment cycle 3 taking into account the payout from Cycle 1
  - Potions from Cycle 2 are exercised if possible and payout received. This Payout is made available for Cycle 4
  - And so on…
  This approach is quite complex and we need to understand if users REALLY want that kind of coverage before going forward with it

Author Roberto Cano (robercano)
