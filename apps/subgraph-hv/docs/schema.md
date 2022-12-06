# Subgraph Entities

## Note on number formatting

As of now, all values are stored as BigInt, without formatting the decimals. EG if an ERC-20 uses FixedPoint and has 2 decimal places, the subgraph would store `250` instead of `2.50`.

## Entities

Entities are treated as individual entries in the subgraph, each entity comes from some type (described below), and has a unique ID. The ID is derived from the contract address and/or deterministic properties of each entity.

### HedgingVault

Used to track an Hedging Vault; id is the address of the InvestmentVault contract

### PotionBuyAction

The settings used by a vault to execute hedging rounds on the Potion Protocol; id is the address of the PotionBuyAction contract

### Round

A single hedging round of an HedgingVault; id is derived from the address of the InvestmentVault contract and the roundNumber

### Investor

This entity is used to keep track of all the addresses that have provided liquidity at least one time (can be a wallet or a contract); id is derived from the address

### Deposit

This entity is used to keep track of all the deposits that an InvestmentVault performed; id is derived from the address of the InvestmentVault contract and the roundNumber

### Withdrawal

This entity is used to keep track of all the withdrawals that an InvestmentVault performed; id is derived from the address of the InvestmentVault contract and the roundNumber

### DepositTicket
This entity keeps track of a deposit request that an Investor did; the id is composed using vault address + round number + investor addresses.
Only one DepositTicket per Investor can exist in a round, if an Investor request multiple deposits the ticket will be simply updated

### WithdrawalTicket
This entity keeps track of a withdrawal request that an Investor did; the id is composed using vault address + round number + investor addresses.
Only one WithdrawalTicket per Investor can exist in a round, if an Investor request multiple withdraws the ticket will be simply updated

### Token
Used to track both the underlying asset that is protected by a vault and the vault token itself, id is the contract address
