# ControllerInterface

For use by consumers and end users. Excludes permissioned (e.g. owner-only) functions

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Functions

### addressbook

No description

#### Declaration

```solidity
  function addressbook(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### whitelist

No description

#### Declaration

```solidity
  function whitelist(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### oracle

No description

#### Declaration

```solidity
  function oracle(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### calculator

No description

#### Declaration

```solidity
  function calculator(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### pool

No description

#### Declaration

```solidity
  function pool(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### partialPauser

No description

#### Declaration

```solidity
  function partialPauser(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### fullPauser

No description

#### Declaration

```solidity
  function fullPauser(
  ) external returns (address)
```

#### Modifiers:

No modifiers

### systemPartiallyPaused

No description

#### Declaration

```solidity
  function systemPartiallyPaused(
  ) external returns (bool)
```

#### Modifiers:

No modifiers

### systemFullyPaused

No description

#### Declaration

```solidity
  function systemFullyPaused(
  ) external returns (bool)
```

#### Modifiers:

No modifiers

### callRestricted

No description

#### Declaration

```solidity
  function callRestricted(
  ) external returns (bool)
```

#### Modifiers:

No modifiers

### donate

send asset amount to margin pool

> use donate() instead of direct transfer() to store the balance in assetBalance

#### Declaration

```solidity
  function donate(
    address _asset,
    uint256 _amount
  ) external
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description              |
| --------- | ------- | ------------------------ |
| `_asset`  | address | asset address            |
| `_amount` | uint256 | amount to donate to pool |

### setOperator

allows a user to give or revoke privileges to an operator which can act on their behalf on their vaults

> can only be updated by the vault owner

#### Declaration

```solidity
  function setOperator(
    address _operator,
    bool _isOperator
  ) external
```

#### Modifiers:

No modifiers

#### Args:

| Arg           | Type    | Description                                                                                    |
| ------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `_operator`   | address | operator that the sender wants to give privileges to or revoke them from                       |
| `_isOperator` | bool    | new boolean value that expresses if the sender is giving or revoking privileges for \_operator |

### operate

execute a number of actions on specific vaults

> can only be called when the system is not fully paused

#### Declaration

```solidity
  function operate(
    struct Actions.ActionArgs[] _actions
  ) external
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type                        | Description                |
| ---------- | --------------------------- | -------------------------- |
| `_actions` | struct Actions.ActionArgs[] | array of actions arguments |

### sync

sync vault latest update timestamp

> anyone can update the latest time the vault was touched by calling this function
> vaultLatestUpdate will sync if the vault is well collateralized

#### Declaration

```solidity
  function sync(
    address _owner,
    uint256 _vaultId
  ) external
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type    | Description         |
| ---------- | ------- | ------------------- |
| `_owner`   | address | vault owner address |
| `_vaultId` | uint256 | vault id            |

### isOperator

check if a specific address is an operator for an owner account

#### Declaration

```solidity
  function isOperator(
    address _owner,
    address _operator
  ) external returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg         | Type    | Description              |
| ----------- | ------- | ------------------------ |
| `_owner`    | address | account owner address    |
| `_operator` | address | account operator address |

#### Returns:

| Type   | Description                                                       |
| ------ | ----------------------------------------------------------------- |
| `True` | if the \_operator is an approved operator for the \_owner account |

### getConfiguration

returns the current controller configuration

#### Declaration

```solidity
  function getConfiguration(
  ) external returns (address, address, address, address)
```

#### Modifiers:

No modifiers

#### Returns:

| Type  | Description                      |
| ----- | -------------------------------- |
| `the` | address of the whitelist module  |
| `the` | address of the oracle module     |
| `the` | address of the calculator module |
| `the` | address of the pool module       |

### getProceed

return a vault's proceeds pre or post expiry, the amount of collateral that can be removed from a vault

#### Declaration

```solidity
  function getProceed(
    address _owner,
    uint256 _vaultId
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type    | Description                    |
| ---------- | ------- | ------------------------------ |
| `_owner`   | address | account owner of the vault     |
| `_vaultId` | uint256 | vaultId to return balances for |

#### Returns:

| Type     | Description                         |
| -------- | ----------------------------------- |
| `amount` | of collateral that can be taken out |

### isLiquidatable

check if a vault is liquidatable in a specific round id

#### Declaration

```solidity
  function isLiquidatable(
    address _owner,
    uint256 _vaultId,
    uint256 _roundId
  ) external returns (bool, uint256, uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type    | Description                                 |
| ---------- | ------- | ------------------------------------------- |
| `_owner`   | address | vault owner address                         |
| `_vaultId` | uint256 | vault id to check                           |
| `_roundId` | uint256 | chainlink round id to check vault status at |

#### Returns:

| Type   | Description                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------- |
| `true` | if vault is undercollateralized, the price of 1 repaid otoken and the otoken collateral dust amount |

### getPayout

get an oToken's payout/cash value after expiry, in the collateral asset

#### Declaration

```solidity
  function getPayout(
    address _otoken,
    uint256 _amount
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                                                                 |
| --------- | ------- | --------------------------------------------------------------------------- |
| `_otoken` | address | oToken address                                                              |
| `_amount` | uint256 | amount of the oToken to calculate the payout for, always represented in 1e8 |

#### Returns:

| Type     | Description              |
| -------- | ------------------------ |
| `amount` | of collateral to pay out |

### isSettlementAllowed

No description

> return if an expired oToken is ready to be settled, only true when price for underlying,
> strike and collateral assets at this specific expiry is available in our Oracle module

#### Declaration

```solidity
  function isSettlementAllowed(
    address _otoken
  ) external returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description |
| --------- | ------- | ----------- |
| `_otoken` | address | oToken      |

### canSettleAssets

No description

> return if underlying, strike, collateral are all allowed to be settled

#### Declaration

```solidity
  function canSettleAssets(
    address _underlying,
    address _strike,
    address _collateral,
    uint256 _expiry
  ) external returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg           | Type    | Description             |
| ------------- | ------- | ----------------------- |
| `_underlying` | address | oToken underlying asset |
| `_strike`     | address | oToken strike asset     |
| `_collateral` | address | oToken collateral asset |
| `_expiry`     | uint256 | otoken expiry timestamp |

#### Returns:

| Type   | Description                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------------- |
| `True` | if the oToken has expired AND all oracle prices at the expiry timestamp have been finalized, False if not |

### getAccountVaultCounter

get the number of vaults for a specified account owner

#### Declaration

```solidity
  function getAccountVaultCounter(
    address _accountOwner
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg             | Type    | Description           |
| --------------- | ------- | --------------------- |
| `_accountOwner` | address | account owner address |

#### Returns:

| Type     | Description |
| -------- | ----------- |
| `number` | of vaults   |

### hasExpired

check if an oToken has expired

#### Declaration

```solidity
  function hasExpired(
    address _otoken
  ) external returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description    |
| --------- | ------- | -------------- |
| `_otoken` | address | oToken address |

#### Returns:

| Type   | Description                             |
| ------ | --------------------------------------- |
| `True` | if the otoken has expired, False if not |

### getVault

return a specific vault

#### Declaration

```solidity
  function getVault(
    address _owner,
    uint256 _vaultId
  ) external returns (struct MarginVaultInterface.Vault)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type    | Description                 |
| ---------- | ------- | --------------------------- |
| `_owner`   | address | account owner               |
| `_vaultId` | uint256 | vault id of vault to return |

#### Returns:

| Type    | Description                                         |
| ------- | --------------------------------------------------- |
| `Vault` | struct that corresponds to the \_vaultId of \_owner |

### getVaultWithDetails

return a specific vault

#### Declaration

```solidity
  function getVaultWithDetails(
    address _owner,
    uint256 _vaultId
  ) external returns (struct MarginVaultInterface.Vault, uint256, uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type    | Description                 |
| ---------- | ------- | --------------------------- |
| `_owner`   | address | account owner               |
| `_vaultId` | uint256 | vault id of vault to return |

#### Returns:

| Type    | Description                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| `Vault` | struct that corresponds to the \_vaultId of \_owner, vault type and the latest timestamp when the vault was updated |
