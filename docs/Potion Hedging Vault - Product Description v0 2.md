# Potion Hedging Vault - Product Description v0.2

# Summary

The **Hedging Vault** implements a hedging strategy for the investors of the Vault in which the hedged assets are protected for a certain period of time called the **Round.** On each Round, the available assets in the vault are hedged by purchasing Put options from the **Potion Protocol**. Once the round ends, the gain/losses from the previous round are realized and the Vault enters the next **Round**. This Rounds are almost back-to-back and the transition happens in a single transaction.

Users can **Deposit** funds at any point in time while a **Round** is active. They will receive back a **Deposit Receipt** represented by an ERC-1155 token. This **Deposit Receipt** contains the amount of deposited assets and the Round in which the assets where deposited.

Once the Vault ends the current **Round** and starts the next one, the funds deposited by **Users** in the previous Round are **Locked** in the Vault and hedged by purchasing put options with the specified strike and duration using the **Potion Protocol**. 

The User can keep these **Deposit Receipt** until they decide to retrieve their Assets back, including any profit and loss. A User can exchange a Deposit Receipt for a **Withdrawal Receipt.** This Withdrawal Receipt is another ERC-1155 token that contains the amount of Shares available for the User and the Round in which the Withdrawal Request was made.

At the end of the **Round** where the user made the **Withdrawal Request**, the Vault will **Unlock** the required amount of funds for the User. Once the funds are Unlocked, the User can retrieve the Assets back using the **Withdrawal Receipt**

The **Deposit Receipt** can also be exchanged for **Shares**, in case the user wants to trade the Shares in a wider secondary market. This exchange can only happen after the user funds have been effectively Locked in the Vault. This is, a User with **Deposit Receipt** for **Round N**, can only exchange it for **Shares** on **Round N+1** or greater.

The **Shares** can also be used to mint a **Withdrawal Request,** same as with the **Deposit Receipt**, but they cannot be exchanged back into **Deposit Receipt** anymore.

# Life Cycle

The system runs in cycles called **Rounds**. A Round extends for the duration configured in the **Vault** and is equal to the **Hedging Duration** (i.e. the duration of the put options purchased)**.** Rounds run almost back-to-back and are triggered by an external **Operator.**

# **Normal User Experience**

**0. Approve** (if not previously) → **1. Deposit** → **2. Request** → **3. Retrieve**

- The User **Approves** the Vault through a transaction to use her funds (this could be done only once in a lifetime by approving the Vault for Infinite Assets)
- Makes a transaction to **Deposit** the funds in the Vault
    - The Vault will **Mint** a **Deposit Receipt** for the current round to the User to represent her deposit in the Vault
- After several Vault Rounds, the User wants to withdraw her funds
    - The User exchanges a **Deposit Receipt** for a **Withdrawal Receipt** through a transaction**,** and locks the corresponding amount of Shares into the vault.
    - When **Round N** finishes the Assets corresponding to the locked amount of Shares are **Unlocked,** and the Shares are burned
- The User can retrieve her funds by making a **Retrieval** transaction using her **Withdrawal Receipt**

# Advanced User Experience

**0. Approve** (if not previously) → **1. Deposit** → **2. Exchange** → **3. Sell** → **4. Request** → **5. Retrieve**

- The User **Approves** the Vault through a transaction to use her funds (this could be done only once in a lifetime by approving the Vault for Infinite Assets)
- Makes a transaction to **Deposit** the Assets in the Vault
    - The Vault will **Mint** a **Deposit Receipt** for the current round to the User to represent her deposit in the Vault
- After several Vault Rounds, the User decides to trade her Shares in a secondary market
    - The User immediately **Exchanges** her **Deposit Receipt** for Vault Shares through a transaction
- The User disposes of her Vault Shares freely, and sells a fraction of them in a secondary market (e.g. Uniswap) through an external transaction
- The User requests to withdraw her funds from her remaining Vault Shares
    - The User makes a **Withdrawal Request** in **Round N** through a transaction by using her **Vault Shares** and mints a **Withdrawal Receipt** for that same round and for the amount of deposited Shares
    - The **Vault Shares** are deposited in the Vault and the Assets are marked for **Withdrawal**
    - When **Round N** finishes the Assets are **Unlocked** and the deposited Shares are burnt
- The User can retrieve her Assets by making a **Retrieval** transaction

# Dubitative User Experience

**0. Approve** (if not previously) → **1. Deposit** → **2. Immediate Withdraw**

- The User **Approves** the Vault through a transaction to use her funds (this could be done only once in a lifetime by approving the Vault for Infinite Assets)
- Makes a transaction to **Deposit** the funds in the Vault
    - The Vault will **Mint** a **Deposit Receipt** for the current round to the User to represent her deposit in the Vault
- Before the next Round starts, the User regrets the decision and wants to retrieve all their funds back
    - The user makes **Exchanges** her **Deposit Receipt** for the Assets in the Vault through a transaction. This kind of request can only be done in the same **Round** where the **Deposit Receipt** was minted

# Correcting Factor

The correcting factor is a formula that allows the Hedging Vault to correctly calculate the amount of Puts that must be bought to cover the Principal after some of the Principal has been used as a Premium. As the number of Puts and the Premium are interrelated, this is a complex calculation that could be asymptotically approached to yield the correct number.

However, an estimation suffices to get a number close enough that can be actioned. This calculation happens in the Operator side, when calculating the Potion Routes, and again in the contract in order to validate that the actual Hedging Rate after buying the Puts is inside a required range.

# Fallback Strategy

The main strategy for buying Potions could fail in case there is not enough liquidity in the Potion Protocol, or for other unforeseen reasons. In such case the Hedging Vault will try to execute a fallback strategy consisting of swapping the Hedged amount of Principal into USDC. This will effectively protect the hedged principal from the downside, but will also prevent the hedged principal from the upside. The swapped amount will be kept in the vault until the end of the cycle, and at that time, it will be swapped back into the Underlying.

This fallback strategy assumes that Uniswap has enough liquidity for the swap to happen. In case there is no liquidity in Uniswap then the transaction will fail and the Underlying will be kept unprotected in the Vault.

This strategy is executed inside the same transaction that tries to buy the Potions, meaning that, if it succeeds, the protection of the funds is kept back-to-back.

# Black Swan Events

In this new version the Rounds of the Vault are almost back-to-back, thus minimizing the duration of the periods where the Hedged Asset is not protected. However there are still some risks due to the mechanics of the Blockchain, the Potion Protocol, and Uniswap.

## Blockchain

A transaction takes an undetermined amount of time to be mined. The transaction to move to the next Round must arrive at the Vault only AFTER the current Round ends. The Operator could try to issue the transaction before the Round ends, but if it is mined too quickly, it could fail. If issued after the Round ends, it could take seconds or even minutes to be mined. During all that period, the funds would be unprotected.

Even if the Operator could issue the transaction before the Round ends and adjust it to be mined right after the Round has ended, the two following sections will also explain why issuing the transaction before the Round ends could cause problems.

## Potion Protocol

Using the Potion Protocol’s Router, the Operator needs to retrieve a list of Counterparties (LPs) that will be used for purchasing risk protection in the Potion AMM. This list depends on the state of the Potion Protocol and the amount of funds in the Vault. Due to this, the Operator must wait until a Round has finished to check how much funds are left in the Vault, and also to get a snapshot of the state of the LPs in the Potion Protocol. This means that the Operator needs to wait for the end of the protection period before we can retrieve the list of Counterparties from the Potion Protocol. Once retrieved, the Operator must issue a transaction to move to the next Round.

When retrieving the Counterparties list before the end of the Current Round, the Operator will not know the exact amount of assets to be Hedged, and therefore the list of Counterparties and the order size will not match exactly the amount to be Hedged, causing the vault to either over-collateralize or under-collateralize the Assets.

Furthermore the utilization of the Counterparties could different after the end of the round, depending on whether the Potions have expired ITM or OTM, adding another level of uncertainty into the calculation of the Premium and the expected slippage

## Uniswap

Uniswap has a similar problem to the Potion Protocol. In order to optimize the pools that will be used for the Swap, the Uniswap Alpha Router uses the amount to be swapped to calculate the pools to be used. If the Operator retrieves the pools for the swap before the current Round ends, then the amount to be swapped could be different, which could directly affect the swap slippage.

## Conclusion

The conclusion is that the system needs to accept that there will be unprotected periods in the vault. These periods can be minimized but not completely eliminated.

Author Roberto Cano (robercano)