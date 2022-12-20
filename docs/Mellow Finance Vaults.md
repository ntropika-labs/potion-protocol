# Mellow Finance Vaults

# Introduction

Mellow Finance Vaults provides a system of Multi-Token Vaults including Governance that allow for Liquidity Providers to participate in the Vault. The Vault is managed by a Strategist through the Governance layer. This allows the Vault participants to validate the strategy changes made by the Strategist.

Each Vault is focused on one product only, typically investing the funds into a single other protocol like AAVE, Yearn Finance, Uniswap, etc…, and supports multiple-token deposits. This is, the Vault is not tied to a specific ERC-20 and allows LPs to deposit multiple tokens at the same time.

# Architecture

![Untitled](Mellow%20Finance%20Vaults/Untitled.png)

In the image above the system architecture of the Mellow Vaults can be seen.

The Liquidity Providers can deposit multi-tokens into the ERC20Root Vault contract. This contract will validate the operation with the ERC20Root Vault Governance contract to make sure it is allowed. If it is a valid operation, it will then talk to the assigned vault, for example, UniV3 Vault. This Vault in turn will further verify the operation against its Governance contract, UniV3 Vault Governance, and if valid, it will execute the deposit on behalf of the root contract. The root contract, once the operation has been executed, will yield LP tokens to the depositor.

The ERC20Root Contract implements a Vault Aggregator functionality that allows the contract to manage several vaults at once (Meta-Vault). When an LP deposits into the ERC20Root Contract, it pushes the assets into the first Vault of the list of vaults available to it. Then, as a separate transaction, a Strategy contract will rebalance the assets among the different Vaults to achieve a certain strategy goal. The way this Strategy is triggered and how it fits into the whole architecture is not completely clear without doing an in-deep analysis of the system.

# Conclusions

As of the writing of this document, the Mellow Vaults are not interesting for us for implementing a Deferred Deposits and Withdrawals module, as they are using protocols like Uniswap V3, AAVE and Yearn, where there is no locked period, thus, the deposits and withdrawals can be done at any point in time and the operations are immediate.

The architecture is quite interesting though, and the Governance part of it plus the independent strategy approach could be useful when implementing Meta-Vaults. The code quality is good, although the separation of responsibilities is not always clear. Code is quite documented though and it should be reasonable to perform a full system analysis when required.

Author Roberto Cano (robercano)