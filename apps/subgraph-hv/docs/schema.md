# Subgraph Entities

This project uses entities to track data in a subgraph. Each entity has a unique ID that is derived from the contract address and/or deterministic properties of each entity.

## Note on number formatting

Currently, all values are stored as BigInt without formatting the decimals. For example, if an ERC-20 token uses FixedPoint with two decimal places, the subgraph would store `250` instead of `2.50`.

## Entities

### HedgingVault

This entity is used to track a hedging vault. The ID is the contract address of the InvestmentVault.

### PotionBuyAction

This entity stores the settings used by a vault to execute hedging rounds on the Potion Protocol. The ID is the contract address of the PotionBuyAction.

### Round

This entity tracks a single hedging round of a hedging vault. The ID is derived from the contract address of the InvestmentVault and the round number.

### Investor

This entity is used to keep track of all addresses that have provided liquidity at least once (can be a wallet or a contract). The ID is derived from the address.

### Deposit

This entity tracks all deposits performed by an InvestmentVault. The ID is derived from the contract address of the InvestmentVault and the round number.

### Withdrawal

This entity tracks all withdrawals performed by an InvestmentVault. The ID is derived from the contract address of the InvestmentVault and the round number.

### DepositTicket
This entity tracks a deposit request made by an Investor; The ID is composed of the vault address, round number, and investor address. 
There can only be one DepositTicket per Investor in a round: if an Investor requests multiple deposits in the same round, the ticket will be updated with the latest information.

### WithdrawalTicket
This entity tracks a withdrawal request made by an Investor; the ID is composed of the vault address, round number, and investor address. 
There can only be one WithdrawalTicket per Investor in a round: if an Investor requests multiple withdawals in the same round, the ticket will be updated with the latest information.

### Token
This entity is used to track both the underlying asset protected by a vault and the vault token itself. The ID is the contract address.
