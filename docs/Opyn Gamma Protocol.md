# Opyn Gamma Protocol

# Introduction

The Opyn protocol provides with the basic building blocks to buy and sell Options. This is achieved by a combination of an ERC-20 token, called the OToken, and the Vaults, which hold the collateral used to insure the Option.

# Options

An Option is a financial instrument that allows a seller to sell the option to buy or sell an asset at a certain price after some period of time. The buyer can buy this option to try to buy or sell the asset after the specified period of time. If the buyer sells or buys the asset at the convened price, it is said that the Option is **Exercised.** The option can only be exercised in certain cases, explained below in the **[Put vs Call](#put-vs-call-options)** section.

An option is defined by the following parameters:

- **Underlying Asset** is the asset the option refers to, typically the asset that will be bought or sold if the option is exercised
- **Expiration Date** is the date that the option expires. Opyn uses European Option that can only be exercised after the expiration date
- **Strike Price** is the price at which the buyer could buy or sell the underlying asset after the expiration date
- **Strike Asset** is the asset that the strike price is denominated in, for example, US Dollar
- **Collateral Asset** is the asset used to secure the payment to the buyer in case the buyer wants to exercise the option
- **Margin** is the amount of collateral needed to secure an option

Typically the seller of the option is betting on exactly the opposite than the buyer is betting on. For example if a seller is betting that WETH will go up, then they will sell an option that only pays the buyer if the price of WETH goes down. On the other side, if the buyer is betting on the price of WETH to go down, then they will buy the option to get the profits.

# OToken

The OToken is an ERC-20 token that holds the information about the Option’s **underlying asset**, **collateral asset**, **strike price**, and **expiration date**. This OToken can only be minted through a Vault to ensure that the Option is properly collateralized. However the same OToken can be minted through different Vaults. This enables different collateralization strategies.

**One unit** of the **OToken** represents exactly **one unit** of the **underlying asset**.

# Vault

The Vault holds assets that can be used as collateral for a specific Option. The same Vault could hold many different assets. However as V2 of the Opyn protocol, only 1 asset is allowed in the Vault.

# Put vs. Call Options

Opyn allows to create both **Call** and **Put** options. Put options allow the buyer to **buy** the underlying assets at a certain price if the Option is exercised. Call options allow the buyer to **sell** the underlying asset at a certain price if the Option is exercised. Whether an Option can be exercised or not is defined by the relationship between the **Spot Price** of the asset and the **Strike Price** of the Option:

- **Spot Price** is the current market price of an asset for a specific market, or an average of several markets
- **At the Money** (**ATM**) means that the **Spot Price** of an Option’s underlying asset is exactly the **Strike Price.**
- **In the Money** (**ITM**) means that the price of an Option’s underlying asset is **in the range** where the Option can be exercised. For **Put** options this means that the **Spot Price** is **below** the **Strike Price** of the option. For **Call** options this means that the **Spot Price** is above the **Strike Price** of the option
- **Out of the Money** (**OTM**) means that the price of an Option’s underlying asset is **out of the range** where the Option can be exercised. For **Put** options this means that the **Spot Price** is **above** the **Strike Price** of the option. For **Call** options this means that the **Spot Price** is **below** the **Strike Price** of the option

A **Short Put** or **Short Call** is when you are selling **Put** or **Call** options respectively. A **Long Put** or **Long Call** is when you are buying a **Put** or **Call** options respectively

A **Put** option can be exercised by the buyer if the **Spot Price** is below or equal to the **Strike Price** (this is, the option is **Out of the Money** or **At the Money**)**.** A **Call** option can be exercised by the buyer if the **Spot Price** is above or equal to the **Strike Price** (this is, the option is **Out of the Money** or **At the Money**)

An option can only be exercised if it is **ITM** or **ATM**. When an option is **exercised**, the buyer receives a **payout.** The **payout** is the amount of collateral asset that the seller must pay to the buyer in case the option is exercised while being **ITM** or **ATM**. For a **Put** option it is the difference between the **Strike Price** and the **Spot Price**. The **payout** for a **Call** option is the difference between the **Spot Price** and the **Strike Price.**

Because Call Options pay the different between the current price and the strike price, and the current price is unbounded, the payout could be huge (theoretically infinite).

# Fully Collateralized vs. Naked Margin Options

The **Collateral** is the amount of an asset that is locked into a vault to secure that an option can be exercised. There are 2 ways of collateralize an Opyn Vault:

- **Fully collateralized (Vault Type 0)**: In this case the whole amount needed to cover the full price movement of the asset is deposited in the Vault
- **Naked Margin (Vault Type 1):** In this case not all the amount needed to cover the full price movement is deposited. If the price moves too much then the Vault would become undercollateralized and it would be **liquidated.** The process of liquidation is explained in the **[Liquidations](#liquidations)** section below.

**Put Options** can choose between this 2 strategies. In particular it can choose the **Fully Collateralized** strategy because the risk is limited as the price can only go down until **zero**. However for **Call Options** only the naked margin is possible, as the price could go up indefinitely, creating a theoretically infinite payout.

For **Call Options** the most common strategy is to use **Covered Calls**. A Covered Call is a Call Option in which the underlying asset is the same as the collateral asset. Remember that a Call Option has to pay the buyer if the Spot Price is above the Strike Price. If the Spot Price of the underlying asset is going up, and the collateral is denominated in the same asset, then the collateral also increases in value, covering the increase in price.

From the code it can be seen that Opyn assumes that when using a **Fully** **Collateralized** vault for a **Call** OToken, it will always be a **Covered Call**, as the calculation of the **Margin** just requests the same amount of collateral asset than the number of OTokens that are being emitted. Because 1 OToken represents exactly 1 underlying assets, this means that the option represents a **Covered Call**.

# Options vs. Spreads

Opyn supports 2 type of options:

- A **Normal** **Option** is an option in which an asset is used for the collateral. This asset could be the same as the **underlying asset** or any other asset of the same characteristics
- A **Spread** is an option in which **another option** is used as the collateral.This means that the Vault owner, and seller of the options, is both **longing** an option (buying the option) and **shorting** the option (selling the option). The 2 options involved in spread are typically of the same underlying asset but they use different collaterals

Opyn supports 4 types of **Spreads:**

- **Call Debit Spread** is a spread in which the seller **Longs** a **Call Option** for an asset with a certain **Strike Price** and a certain **Expiration Date.** Let’s call this **Call Option A**. Then uses those options to collateralize and **Short** another **Call Option** for the same underlying asset and the same expiration date, with a **Strike Price** **higher** than the first option’s strike price. Let’s call this **Call Option B**. By doing this the seller pays a premium for Option A but then earns a premium Option B. Typically the difference is negative for the trader, and thus it is called **Debit**. The hope is that the price of the asset rises and at least reaches the **Strike Price B.** Above Strike Price B the trader stops earning profits. The maximum profit the seller will earn is the difference between **Strike Price B** and **Strike Price A** (the **Spread**) minus the **Debit** (all the premiums earned by selling **Call Option B** minus the premium paid for **Call Option A)**
- **Call Credit Spread** is a spread in which the seller **Longs** a **Call Option** for an asset with a certain **Strike Price** and a certain **Expiration Date.** Let’s call this **Call Option A**. Then uses those options to collateralize and **Short** another **Call Option** for the same underlying asset and the same expiration date, with a **Strike Price** **lower** than the first option’s strike price. Let’s call this **Call Option B**. By doing this the seller pays a premium for the first option but then earns a premium for second option. Typically the difference is positive for the trader, and thus it is called **Credit.** The hope is that the price of the asset stays below **Strike Price B.** If so, the seller will get the difference between the premiums, this is, the **Credit**.
- **Put Debit Spread** is a spread in which the seller **Longs** a **Put Option** for an asset with a certain **Strike Price** and a certain **Expiration Date.** Let’s call this Put **Option A**. Then uses those options to collateralize and **Short** another **Put Option** for the same underlying asset and the same expiration date, with a **Strike Price** **lower** than the first option’s strike price. Let’s call this **Put Option B**. By doing this the seller pays a premium for the first option but then earns a premium for second option. Typically the difference is negative for the trader, and thus it is called **Debit.** The hope is that the price of the asset lowers and at least reaches the **Strike Price B.** Below Strike Price B the trader stops earning profits. The maximum profit the seller will earn is the difference between **Strike Price A** and **Strike Price B** (the **Spread**) minus the **Debit** (all the premiums earned by selling **Call Option B** minus the premium paid for **Call Option A)**
- **Put Credit Spread** is a spread in which the seller **Longs** a **Put Option** for an asset with a certain **Strike Price** and a certain **Expiration Date.** Let’s call this **Call Option A**. Then uses those options to collateralize and **Short** another **Put Option** for the same underlying asset and the same expiration date, with a **Strike Price** **higher** than the first option’s strike price. Let’s call this **Call Option B**. By doing this the seller pays a premium for the first option but then earns a premium for second option. Typically the difference is positive for the trader, and thus it is called **Credit.** The hope is that the price of the asset stays above **Strike Price B.** If so, the seller will get the difference between the premiums, this is, the **Credit**.

To do this the trader just have to buy some options for a certain OToken and then sell another OToken that has the same expiry date and underlying asset using a Vault that is collateralized using the first OToken.

# Liquidations

Liquidations may happen when the **collateral** of an option is **unable to cover** the minimum value of collateral (margin) that the system calculates that must be available in order to be solvent in a **Black Thursday** kind of event. This stems from a formula using a the Spot Price shock that could be caused in a crisis event:

```jsx
margin(Strike, Asset Price, t) = P(t) * min(Strike, (1-SpotShock) * *SpotPrice) +
                               max(Strike — (1-SpotShock) ** SpotPrice, 0)
```

Where:

- **SpotShock** is a percentage indicating how much the Spot Price could move if the crisis event happens
- **t** is the time of maturity of the option
- **P(t)** is a mapping with the shock values of ATM

At any moment, if the collateral in the Vault is less than the calculated margin, then the Vault is considered to be in **Liquidation**. Also at any moment, if the collateral in the Vault is less than the actual value of the Option, the Vault is considered **Insolvent.**

If the Vault is **Insolvent** then the system has failed and there will be unpaid debts. However, before reaching such a state, Opyn’s takes advantage of **Liquidation** to bring more collateral into the Vault.

### Reverse Dutch Auction

They mechanism used for this is a **Reverse Dutch Auction**. When a **Vault** is in the liquidation zone, the system auctions the collateral in exchange for the Options that the Vault minted.It starts with a small amount of the collateral. If nobody fills the order, then each block more collateral is auctioned until the Vault gets out of the Liquidation zone. This incentivizes **Liquidators** to buy the Options in the market and sell them to the Vault. This will happen more likely, when the auctioned collateral surpases the current value of the Options in the market. This way the Options are bought back and no debt is due to any buyer. Of course if the collateral in the Vault is less than the actual market value of the Options, no Liquidator will fill the auction orders and the Vault is considered insolvent. However the hope is that the market self-regulates and that the Liquidators take advantage of the discount price for the Options.

### **Virtual Reverse Dutch Auction**

Opyn actually offers a **Virtual Reverse Dutch Auction** mechanism in which a Dutch Auction can be started retroactively for a Vault in liquidation. If an agent of the system detects that a Vault was in liquidation at some point in the past, and can demonstrate this by providing the required on-chain oracle data (in case of Opyn, the Chainlink round-id), then the system considers that the Dutch Auction started at the block provided with the Oracle data, and then it calculates the auction current order size for the current block. Then any Liquidator can fill the order if they desire so.

### Validity Checks

To prevent an undercollateralized Vault from being liquidated, any agent can add collateral to it at any moment. To prevent a **transiently** undercollateralized Vault, this is, a Vault that was undercollateralized at some point in time but it is not anymore, from being liquidated, any agent can pay some gas to do a Vault check and mark the status of the Vault as collateralized as per the current block. Any Liquidator desiring to liquidate the Vault, must provide an Oracle price with a timestamp **greater** than the last validity check timestamp.

### Vault Dust

The Dust value is the minimum amount of collateral that a Vault must have in order to be able to mint options. In case that the calculated margin is too low, it could be that liquidations are not possible due to high gas prices, in which liquidators would not fund profitable to fill the auction order due to the gas price. To fight against this, a minimum collateral amount, called Dust is required for partially collateralized Vaults.

# Resources

- [https://opyn.gitbook.io/opyn/](https://opyn.gitbook.io/opyn/)
- [https://medium.com/opyn/how-to-trade-defi-options-opyn-v2-tutorial-aabc0a323430](https://medium.com/opyn/how-to-trade-defi-options-opyn-v2-tutorial-aabc0a323430)
- [https://medium.com/opyn/partially-collateralized-options-now-in-defi-b9d223eb3f4d](https://medium.com/opyn/partially-collateralized-options-now-in-defi-b9d223eb3f4d)
- [https://optionalpha.com/strategies/bull-call-debit-spread](https://optionalpha.com/strategies/bull-call-debit-spread)
- [https://optionalpha.com/strategies/bear-call-credit-spread](https://optionalpha.com/strategies/bear-call-credit-spread)
- [https://optionalpha.com/strategies/bull-put-credit-spread](https://optionalpha.com/strategies/bull-put-credit-spread)
- [https://optionalpha.com/strategies/bear-put-debit-spread](https://optionalpha.com/strategies/bear-put-debit-spread)
