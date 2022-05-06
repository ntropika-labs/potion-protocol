# PotionLiquidityPool

It allows LPs to deposit, withdraw and configure Pools Of Capital. Buyer can buy OTokens.

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var                      | Type                                                                             |
| ------------------------ | -------------------------------------------------------------------------------- |
| STRIKE_PRICE_DECIMALS    | uint256                                                                          |
| ORACLE_PRICE_DECIMALS    | uint256                                                                          |
| OTOKEN_QTY_DECIMALS      | uint256                                                                          |
| SECONDS_IN_A_DAY         | uint256                                                                          |
| MAX_INT                  | uint256                                                                          |
| maxTotalValueLocked      | uint256                                                                          |
| vaultCount               | uint256                                                                          |
| vaults                   | mapping(address => struct PotionLiquidityPool.VaultInfo)                         |
| lpPools                  | mapping(address => mapping(uint256 => struct PotionLiquidityPool.PoolOfCapital)) |
| sumOfAllUnlockedBalances | uint256                                                                          |
| sumOfAllLockedBalances   | uint256                                                                          |
| opynController           | contract ControllerInterface                                                     |
| opynAddressBook          | contract AddressBookInterface                                                    |
| crv                      | contract ICurveManager                                                           |
| crit                     | contract ICriteriaManager                                                        |
| poolCollateralToken      | contract IERC20Upgradeable                                                       |

## Functions

### initialize

Initialize this implementation contract

> Function initializer for the upgradeable proxy.

#### Declaration

```solidity
  function initialize(
    address _opynAddressBook,
    address _poolCollateralToken,
    address _curveManager,
    address _criteriaManager
  ) external initializer
```

#### Modifiers:

| Modifier    |
| ----------- |
| initializer |

#### Args:

| Arg                    | Type    | Description                                          |
| ---------------------- | ------- | ---------------------------------------------------- |
| `_opynAddressBook`     | address | The address of the OpynAddressBook contract.         |
| `_poolCollateralToken` | address | The address of the collateral used in this contract. |
| `_curveManager`        | address | The address of the CurveManager contract.            |
| `_criteriaManager`     | address | The address of the CriteriaManager contract.         |

### setMaxTotalValueLocked

Set the total max value locked per user in a Pool of Capital.

#### Declaration

```solidity
  function setMaxTotalValueLocked(
    uint256 _newMax
  ) external onlyOwner whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| onlyOwner     |
| whenNotPaused |

#### Args:

| Arg       | Type    | Description                     |
| --------- | ------- | ------------------------------- |
| `_newMax` | uint256 | The new total max value locked. |

### pause

Allows the admin to pause the whole system

#### Declaration

```solidity
  function pause(
  ) external onlyOwner whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| onlyOwner     |
| whenNotPaused |

### unpause

Allows the admin to unpause the whole system

#### Declaration

```solidity
  function unpause(
  ) external onlyOwner whenPaused
```

#### Modifiers:

| Modifier   |
| ---------- |
| onlyOwner  |
| whenPaused |

### setCurveManager

Update the contract used to manage curves, and curve hashes, and the calculation of prices based on curves

> To ensure continued operation for all users, any new CurveManager must be pre-populated with the same data as the existing CurveManager (for reasons of gas efficiency, we do not use an upgradable proxy mechanism)
> The `CurveManager` can be changed while paused, in case this is required to address security issues

#### Declaration

```solidity
  function setCurveManager(
    contract ICurveManager _new
  ) external onlyOwner
```

#### Modifiers:

| Modifier  |
| --------- |
| onlyOwner |

#### Args:

| Arg    | Type                   | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| `_new` | contract ICurveManager | The new address of the CurveManager |

### setCriteriaManager

Update the contract used to manage criteria, and sets of criteria, and hashes thereof

> Note To ensure continued operation for all users, any new CriteriaManager must be pre-populated with the same data as the existing CriteriaManager (for reasons of gas efficiency, we do not use an upgradable proxy mechanism)
> The `CriteriaManager` can be changed while paused, in case this is required to address security issues

#### Declaration

```solidity
  function setCriteriaManager(
    contract ICriteriaManager _new
  ) external onlyOwner
```

#### Modifiers:

| Modifier  |
| --------- |
| onlyOwner |

#### Args:

| Arg    | Type                      | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| `_new` | contract ICriteriaManager | The new address of the CriteriaManager |

### getVaultId

Get the ID of the existing Opyn vault that Potion uses to collateralize a given OToken.

#### Declaration

```solidity
  function getVaultId(
    contract OtokenInterface _otoken
  ) public returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                                                                                            |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `_otoken` | contract OtokenInterface | The identifier (token contract address) of the OToken. Not checked for validity in this view function. |

#### Returns:

| Type  | Description                                                                   |
| ----- | ----------------------------------------------------------------------------- |
| `The` | unique ID of the vault, > 0. If no vault exists, the returned value will be 0 |

### lpLockedAmount

Query the locked capital in a specified pool of capital

> \_poolId is generated in the client side.

#### Declaration

```solidity
  function lpLockedAmount(
    address _lp,
    uint256 _poolId
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                            |
| --------- | ------- | -------------------------------------- |
| `_lp`     | address | The address of the liquidity provider. |
| `_poolId` | uint256 | An (LP-specific) pool identifier.      |

#### Returns:

| Type  | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| `The` | amount of capital locked in the pool, denominated in collateral tokens. |

### lpTotalAmount

Query the total capital (locked + unlocked) in a specified pool of capital.

#### Declaration

```solidity
  function lpTotalAmount(
    address _lp,
    uint256 _poolId
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                            |
| --------- | ------- | -------------------------------------- |
| `_lp`     | address | The address of the liquidity provider. |
| `_poolId` | uint256 | An (LP-specific) pool identifier.      |

#### Returns:

| Type  | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| `The` | amount of capital in the pool, denominated in collateral tokens. |

### collateralNeededForPuts

The amount of capital required to collateralize a given quantitiy of a given OToken.

#### Declaration

```solidity
  function collateralNeededForPuts(
    contract OtokenInterface _otoken,
    uint256 _otokenQty
  ) external returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg          | Type                     | Description                                                                                                                 |
| ------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `_otoken`    | contract OtokenInterface | The identifier (token contract address) of the OToken to be collateralized. Not checked for validity in this view function. |
| `_otokenQty` | uint256                  | The number of OTokens we wish to collateralize.                                                                             |

#### Returns:

| Type  | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| `The` | amount of collateral required, denominated in collateral tokens. |

### premiums

Calculate the premiums for a particular OToken from the provided sellers.

#### Declaration

```solidity
  function premiums(
    contract OtokenInterface _otoken,
    struct PotionLiquidityPool.CounterpartyDetails[] _sellers
  ) external returns (uint256 totalPremiumInCollateralTokens, uint256[] perLpPremiumsInCollateralTokens)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type                                             | Description                                                                                                                                                                       |
| ---------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_otoken`  | contract OtokenInterface                         | The `OToken` for which we calculate the premium charged for a purchase. This is not checked for validity in this view function, nor is it checked for compatibility with sellers. |
| `_sellers` | struct PotionLiquidityPool.CounterpartyDetails[] | The details of the counterparties and counterparty pricing, for which we calculate the premiums. These are assumed (not checked) to be compatibile with the `Otoken`.             |

#### Returns:

| Type                              | Description                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| `totalPremiumInCollateralTokens`  | The total premium in collateral tokens.                                                    |
| `perLpPremiumsInCollateralTokens` | The premiums per LP in collateral tokens, ordered in the same way as the `_sellers` param. |

### util

Calculates the utilization before and after locking new collateral amount.

#### Declaration

```solidity
  function util(
    address _lp,
    uint256 _poolId,
    uint256 _collateralToLock
  ) public returns (int256 utilBeforeAs59x18, int256 utilAfterAs59x18, uint256 lockedAmountBefore, uint256 lockedAmountAfter)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                 | Type    | Description                            |
| ------------------- | ------- | -------------------------------------- |
| `_lp`               | address | The address of the liquidity provider. |
| `_poolId`           | uint256 | An (LP-specific) pool identifier.      |
| `_collateralToLock` | uint256 | The amount of collateral to lock.      |

#### Returns:

| Type                 | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `utilBeforeAs59x18`  | Utilization before locking the collateral specified.                 |
| `utilAfterAs59x18`   | Utilization after locking the collateral specified.                  |
| `lockedAmountBefore` | The total collateral locked before locking the collateral specified. |
| `lockedAmountAfter`  | The total collateral locked after locking the collateral specified.  |

### percentStrike

The specified OToken's strike price as a percentage of the current market spot price.

> In-The-Money put options will return a value > 100; Out-Of-The-Money put options will return a value <= 100.

#### Declaration

```solidity
  function percentStrike(
    contract OtokenInterface _otoken
  ) public returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                                                                                                                    |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `_otoken` | contract OtokenInterface | The identifier (token contract address) of the OToken to get the strike price. Not checked for validity in this view function. |

#### Returns:

| Type  | Description                                                                             |
| ----- | --------------------------------------------------------------------------------------- |
| `The` | strike price as a percentage of the current price, rounded up to an integer percentage. |

        E.g. if current price is $100, then a strike price of $94.01 returns a strikePercent of 95,
        and a strike price of $102.99 returns a strikePercent of 103.

### durationInDays

It calculates the number of days (including all partial days) until the specified Otoken expires.

> reverts if the otoken already expired

#### Declaration

```solidity
  function durationInDays(
    contract OtokenInterface _otoken
  ) public returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                                                                             |
| --------- | ------------------------ | --------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface | The identifier (address) of the Otoken. Not checked for validity in this view function. |

#### Returns:

| Type  | Description                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| `The` | number of days remaining until OToken expiry, rounded up if necessary to make to an integer number of days. |

### createNewVaultId

Create an Opyn vault, which Potion will use to collateralize a given OToken.

> `_otoken` is implicitly checked for validity when we call `_getOrCreateVaultInfo`.

#### Declaration

```solidity
  function createNewVaultId(
    contract OtokenInterface _otoken
  ) external whenNotPaused returns (uint256)
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type                     | Description                                            |
| --------- | ------------------------ | ------------------------------------------------------ |
| `_otoken` | contract OtokenInterface | The identifier (token contract address) of the OToken. |

#### Returns:

| Type  | Description                  |
| ----- | ---------------------------- |
| `The` | unique ID of the vault, > 0. |

### deposit

Deposit collateral tokens from the sender into the specified pool belonging to the caller.

#### Declaration

```solidity
  function deposit(
    uint256 _poolId,
    uint256 _amount
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type    | Description                                                                                         |
| --------- | ------- | --------------------------------------------------------------------------------------------------- |
| `_poolId` | uint256 | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_amount` | uint256 | The amount of collateral tokens to deposit.                                                         |

### depositAndConfigurePool

Deposit collateral tokens from the sender into the specified pool belonging to the caller and configures the Curve and CriteriaSet.

#### Declaration

```solidity
  function depositAndConfigurePool(
    uint256 _poolId,
    uint256 _amount,
    bytes32 _curveHash,
    bytes32 _criteriaSetHash
  ) external whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg                | Type    | Description                                                                                         |
| ------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| `_poolId`          | uint256 | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_amount`          | uint256 | The amount of collateral tokens to deposit.                                                         |
| `_curveHash`       | bytes32 | The hash of the new Curve to be set in the specified pool.                                          |
| `_criteriaSetHash` | bytes32 | The hash of the new CriteriaSet to be set in the specified pool.                                    |

### setCurveCriteria

Set the "set of criteria" associated with a given pool of capital. These criteria will be used to determine which otokens this pool of capital is prepared to collateralize. If any Criteria in the set is a match, then the otoken can potentially be colalteralized by this pool of capital, subject to the premium being paid and sufficient liquidity being available.

#### Declaration

```solidity
  function setCurveCriteria(
    uint256 _poolId,
    bytes32 _criteriaSetHash
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg                | Type    | Description                                                                                         |
| ------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| `_poolId`          | uint256 | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_criteriaSetHash` | bytes32 | The hash of the immutable CriteriaSet to be associated with this PoolOfCapital.                     |

### setCurve

Set the curve associated with a given pool of capital. The curve will be used to price the premiums charged for any otokens that this pool of capital is prepared to collateralize.

#### Declaration

```solidity
  function setCurve(
    uint256 _poolId,
    bytes32 _curveHash
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg          | Type    | Description                                                                                         |
| ------------ | ------- | --------------------------------------------------------------------------------------------------- |
| `_poolId`    | uint256 | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_curveHash` | bytes32 | The hash of the immutable Curve to be associated with this PoolOfCapital.                           |

### withdraw

Withdraw unlocked collateral tokens from the specified pool belonging to the caller, and send them to the caller's address.

#### Declaration

```solidity
  function withdraw(
    uint256 _poolId,
    uint256 _amount
  ) external whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type    | Description                                                                                         |
| --------- | ------- | --------------------------------------------------------------------------------------------------- |
| `_poolId` | uint256 | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_amount` | uint256 | The amount of collateral tokens to withdraw.                                                        |

### createAndBuyOtokens

Creates a new otoken, and then buy it from the specified list of sellers.

#### Declaration

```solidity
  function createAndBuyOtokens(
    address _underlyingAsset,
    address _strikeAsset,
    address _collateralAsset,
    uint256 _strikePrice,
    uint256 _expiry,
    bool _isPut,
    struct PotionLiquidityPool.CounterpartyDetails[] _sellers,
    uint256 _maxPremium
  ) external whenNotPaused returns (uint256 premium)
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg                | Type                                             | Description                                                                                                                    |
| ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `_underlyingAsset` | address                                          | A property of the otoken that is to be created.                                                                                |
| `_strikeAsset`     | address                                          | A property of the otoken that is to be created.                                                                                |
| `_collateralAsset` | address                                          | A property of the otoken that is to be created.                                                                                |
| `_strikePrice`     | uint256                                          | A property of the otoken that is to be created.                                                                                |
| `_expiry`          | uint256                                          | A property of the otoken that is to be created.                                                                                |
| `_isPut`           | bool                                             | A property of the otoken that is to be created.                                                                                |
| `_sellers`         | struct PotionLiquidityPool.CounterpartyDetails[] | The LPs to buy the new otokens from. These LPs will charge a premium to collateralize the otoken.                              |
| `_maxPremium`      | uint256                                          | The maximum premium that the buyer is willing to pay, denominated in collateral tokens (wei) and aggregated across all sellers |

#### Returns:

| Type      | Description             |
| --------- | ----------------------- |
| `premium` | The total premium paid. |

### buyOtokens

Buy a OTokens from the specified list of sellers.

> `_otoken` is implicitly checked for validity when we call `_getOrCreateVaultInfo`.

#### Declaration

```solidity
  function buyOtokens(
    contract OtokenInterface _otoken,
    struct PotionLiquidityPool.CounterpartyDetails[] _sellers,
    uint256 _maxPremium
  ) public whenNotPaused returns (uint256 premium)
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg           | Type                                             | Description                                                                                                                    |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `_otoken`     | contract OtokenInterface                         | The identifier (address) of the OTokens being bought.                                                                          |
| `_sellers`    | struct PotionLiquidityPool.CounterpartyDetails[] | The LPs to buy the new OTokens from. These LPs will charge a premium to collateralize the otoken.                              |
| `_maxPremium` | uint256                                          | The maximum premium that the buyer is willing to pay, denominated in collateral tokens (wei) and aggregated across all sellers |

#### Returns:

| Type      | Description                  |
| --------- | ---------------------------- |
| `premium` | The aggregated premium paid. |

### settleAfterExpiry

Retrieve unused collateral from Opyn into this contract. Does not redistribute it to our (unbounded number of) LPs

> `_otoken` is implicitly checked for validity when we call `_getVaultInfo`.
> Redistribution can be done by calling redistributeSettlement(addresses).

#### Declaration

```solidity
  function settleAfterExpiry(
    contract OtokenInterface _otoken
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type                     | Description                                                                                     |
| --------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface | The identifier (address) of the expired OToken for which unused collateral should be retrieved. |

### outstandingSettlement

Calculates the outstading settlement from the PoolIdentifier in OTokens.

> Redistribution can be done by calling redistributeSettlement(addresses).
> `_otoken` is implicitly checked for validity when we call `_getVaultInfo`.

#### Declaration

```solidity
  function outstandingSettlement(
    contract OtokenInterface _otoken,
    struct PotionLiquidityPool.PoolIdentifier _pool
  ) public returns (uint256 collateralDueBack)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                                      | Description                                                                                     |
| --------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface                  | The identifier (address) of the expired OToken for which unused collateral should be retrieved. |
| `_pool`   | struct PotionLiquidityPool.PoolIdentifier | The pool information which the outstanding settlement is calculated.                            |

#### Returns:

| Type                | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `collateralDueBack` | The amount of collateral that can be removed from a vault. |

### isSettled

Check whether a give OToken has been settled.

> Settled OTokens may not have had funds redistributed to all (or any) contributing LPs.
> `_otoken` is implicitly checked for validity when we call `_getVaultInfo`.

#### Declaration

```solidity
  function isSettled(
    contract OtokenInterface _otoken
  ) public returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                        |
| --------- | ------------------------ | ---------------------------------- |
| `_otoken` | contract OtokenInterface | the (settled or unsettled) OToken. |

#### Returns:

| Type   | Description                       |
| ------ | --------------------------------- |
| `True` | if it is settled, otherwise false |

### redistributeSettlement

Redistribute already-retrieved collateral amongst the specified pools. This function must be called after settleAfterExpiry.

> If the full list of PoolIdentifiers owed funds is too long, a partial list can be provided and additional calls to redistributeSettlement() can be made.
> `_otoken` is implicitly checked for validity when we call `_getVaultInfo`.

#### Declaration

```solidity
  function redistributeSettlement(
    contract OtokenInterface _otoken,
    struct PotionLiquidityPool.PoolIdentifier[] _pools
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type                                        | Description                                                                                                                                                          |
| --------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface                    | The identifier (address) of the settled otoken for which retrieved collateral should be redistributed.                                                               |
| `_pools`  | struct PotionLiquidityPool.PoolIdentifier[] | The pools of capital to which the collateral should be redistributed. These pools must be (a subset of) the pools that provided collateral for the specified otoken. |

### settleAndRedistributeSettlement

Retrieve unused collateral from Opyn, and redistribute it to the specified LPs.

> If the full list of PoolIdentifiers owed funds is too long, a partial list can be provided and additional calls to redistributeSettlement() can be made.
> `_otoken` is implicitly checked for validity when we call `settleAfterExpiry`.

#### Declaration

```solidity
  function settleAndRedistributeSettlement(
    contract OtokenInterface _otoken,
    struct PotionLiquidityPool.PoolIdentifier[] _pools
  ) external whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type                                        | Description                                                                                                                                                          |
| --------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface                    | The identifier (address) of the expired otoken for which unused collateral should be retrieved.                                                                      |
| `_pools`  | struct PotionLiquidityPool.PoolIdentifier[] | The pools of capital to which the collateral should be redistributed. These pools must be (a subset of) the pools that provided collateral for the specified otoken. |

### depositAndCreateCurveAndCriteria

Deposit and create a curve and criteria set if they don't exist.

> This function also sets the curve and criteria set in the specified pool.

#### Declaration

```solidity
  function depositAndCreateCurveAndCriteria(
    uint256 _poolId,
    uint256 _amount,
    struct ICurveManager.Curve _curve,
    struct ICriteriaManager.Criteria[] _criterias
  ) external whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg          | Type                               | Description                                                                                         |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `_poolId`    | uint256                            | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_amount`    | uint256                            | The amount of collateral tokens to deposit.                                                         |
| `_curve`     | struct ICurveManager.Curve         | The Curve to add and set in the pool.                                                               |
| `_criterias` | struct ICriteriaManager.Criteria[] | A sorted array of Criteria, ordered by Criteria hash.                                               |

### addAndSetCurve

Add and set a curve.

> If the curve already exists, it won't be added

#### Declaration

```solidity
  function addAndSetCurve(
    uint256 _poolId,
    struct ICurveManager.Curve _curve
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg       | Type                       | Description                                                                                         |
| --------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `_poolId` | uint256                    | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_curve`  | struct ICurveManager.Curve | The Curve to add and set in the pool.                                                               |

### addAndSetCriterias

Add criteria, criteria set and set the criteria set in the specified pool.

> If the criteria and criteria set already exists, it won't be added.

#### Declaration

```solidity
  function addAndSetCriterias(
    uint256 _poolId,
    struct ICriteriaManager.Criteria[] _criterias
  ) public whenNotPaused
```

#### Modifiers:

| Modifier      |
| ------------- |
| whenNotPaused |

#### Args:

| Arg          | Type                               | Description                                                                                         |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `_poolId`    | uint256                            | The identifier for a PoolOfCapital belonging to the caller. Could be an existing pool or a new one. |
| `_criterias` | struct ICriteriaManager.Criteria[] | A sorted array of Criteria, ordered by Criteria hash.                                               |

### \_debit

Debits unlocked collateral tokens from the specified PoolOfCapital

> \_PoolId is generated on the client side.

#### Declaration

```solidity
  function _debit(
    address _lp,
    uint256 _poolId,
    uint256 _amount
  ) internal
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                                              |
| --------- | ------- | -------------------------------------------------------- |
| `_lp`     | address | The Address of the Liquidity provider.                   |
| `_poolId` | uint256 | An (LP-specific) pool identifier..                       |
| `_amount` | uint256 | The amount to credit to the corresponding PoolOfCapital. |

### \_credit

Credits unlocked collateral tokens to the specified PoolOfCapital

> \_PoolId is generated on the client side.

#### Declaration

```solidity
  function _credit(
    address _lp,
    uint256 _poolId,
    uint256 _amount
  ) internal
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                                              |
| --------- | ------- | -------------------------------------------------------- |
| `_lp`     | address | The Address of the Liquidity provider.                   |
| `_poolId` | uint256 | An (LP-specific) pool identifier..                       |
| `_amount` | uint256 | The amount to credit to the corresponding PoolOfCapital. |

### \_burnLocked

Burns collateral tokens from the specified PoolOfCapital

> \_PoolId is generated on the client side.

#### Declaration

```solidity
  function _burnLocked(
    address _lp,
    uint256 _poolId,
    uint256 _amount
  ) internal
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                                                               |
| --------- | ------- | ------------------------------------------------------------------------- |
| `_lp`     | address | The Address of the Liquidity provider.                                    |
| `_poolId` | uint256 | An (LP-specific) pool identifier.                                         |
| `_amount` | uint256 | The amount of collateral tokens to burn from the specified PoolOfCapital. |

### \_unlock

Unlocks collateral tokens within the specified PoolOfCapital

> \_PoolId is generated on the client side.

#### Declaration

```solidity
  function _unlock(
    address _lp,
    uint256 _poolId,
    uint256 _amount
  ) internal
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description                                            |
| --------- | ------- | ------------------------------------------------------ |
| `_lp`     | address | The Address of the Liquidity provider.                 |
| `_poolId` | uint256 | An (LP-specific) pool identifier.                      |
| `_amount` | uint256 | The amount to unlock from the specified PoolOfCapital. |

### \_getVaultInfo

No description

> Get the VaultInfo for the Opyn vault that Potion uses to collateralize a given otoken

#### Declaration

```solidity
  function _getVaultInfo(
    contract OtokenInterface _otoken
  ) internal returns (struct PotionLiquidityPool.VaultInfo)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                                                                                                                                                                                       |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface | The identifier (token contract address) of the otoken. The otoken must have a vault, or the function will throw. Note that only whitelisted (or previously-whitelisted) otokens can have a vault. |

#### Returns:

| Type  | Description                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| `The` | VaultInfo struct for the now-guaranteed-to-be-valid (i.e. is whitelisted or was previously whitelisted) otoken. |

### \_getOrCreateVaultInfo

Get the VaultInfo for the Opyn vault that Potion uses to collateralize a given otoken.

> A vault will be created only if the otoken is whitelisted and a vault does not already exist.

#### Declaration

```solidity
  function _getOrCreateVaultInfo(
    contract OtokenInterface _otoken
  ) internal returns (struct PotionLiquidityPool.VaultInfo)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                     | Description                                                      |
| --------- | ------------------------ | ---------------------------------------------------------------- |
| `_otoken` | contract OtokenInterface | The identifier (token contract address) of a whitelisted otoken. |

#### Returns:

| Type  | Description                                                                                                     |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| `The` | VaultInfo struct for the now-guaranteed-to-be-valid (i.e. is whitelisted or was previously whitelisted) otoken. |

### \_initiatePurchaseAndUpdateFundsForOneLP

Increments the locked and total collateral for the LP, on the assumption that the quote will be
exercized.

> Does NOT check that the supplied otoken is valid, or allowed by the LP. Does NOT check that the supplied curve is allowed by the LP.
> It must only be called by internal functions that ensure the order is subsequntly fulfilled.

#### Declaration

```solidity
  function _initiatePurchaseAndUpdateFundsForOneLP(
    struct PotionLiquidityPool.CounterpartyDetails _seller,
    struct PotionLiquidityPool.CollateralCalculationParams _collateralCalcParams
  ) internal returns (uint256 premium, uint256 collateralAmount)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                     | Type                                                   | Description                                                          |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| `_seller`               | struct PotionLiquidityPool.CounterpartyDetails         | The seller details(LP).                                              |
| `_collateralCalcParams` | struct PotionLiquidityPool.CollateralCalculationParams | Struct used to pass other inputs required for collateral calculation |

### \_collateralNeededForPuts

The amount of capital required to collateralize a given quantitiy of a given `OToken`.

> don't introduce rounding errors. this must match the value returned by Opyn's logic, or else options will be insufcciently collateralised

#### Declaration

```solidity
  function _collateralNeededForPuts(
    uint256 _otokenQty,
    struct PotionLiquidityPool.CollateralCalculationParams _collateralCalcParams
  ) internal returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                     | Type                                                   | Description                                                          |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| `_otokenQty`            | uint256                                                | The number of OTokens we wish to collateralize.                      |
| `_collateralCalcParams` | struct PotionLiquidityPool.CollateralCalculationParams | Struct used to pass other inputs required for collateral calculation |

#### Returns:

| Type  | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| `The` | amount of collateral required, denominated in collateral tokens. |

### \_premiumForLp

Calculates the Premium for the supplied counterparty details.

> Does NOT check that the supplied curve is allowed. Premium calculations involve some orunding and loss of accuracy due
> to the complex math at play. We expect the calculated premium to be within 0.1% of the correct value (i.e. the value we would
> get in, say, python with no loss of precision) in all but a few pathological cases (e.g. util below 0.1% and multiple curve
> parameters very near zero)

#### Declaration

```solidity
  function _premiumForLp(
    address _lp,
    uint256 _poolId,
    struct ICurveManager.Curve _curve,
    uint256 _collateralToLock
  ) internal returns (uint256 premiumInCollateralTokens)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                 | Type                       | Description                              |
| ------------------- | -------------------------- | ---------------------------------------- |
| `_lp`               | address                    | The Address of the Liquidity provider.   |
| `_poolId`           | uint256                    | An (LP-specific) pool identifier.        |
| `_curve`            | struct ICurveManager.Curve | The curve used to calculate the premium. |
| `_collateralToLock` | uint256                    | The amount of collateral to lock.        |

### \_getLivePrices

Return the spot prices of assets A and B, unless A and B are the same asset

#### Declaration

```solidity
  function _getLivePrices(
    address _assetA,
    address _assetB
  ) internal returns (bool identicalAssets, struct FixedPointInt256.FixedPointInt scaledPriceA, struct FixedPointInt256.FixedPointInt scaledPriceB)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type    | Description     |
| --------- | ------- | --------------- |
| `_assetA` | address | Asset A address |
| `_assetB` | address | Asset B address |

#### Returns:

| Type              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `identicalAssets` | whether the passed assets were identical; if so, prices of 0 are returned |
| `scaledPriceA`    | of asset A (not set if identicalAssets=true)                              |
| `scaledPriceB`    | of asset B (not set if identicalAssets=true)                              |

### \_convertAmountOnLivePrice

Convert an amount in asset A to equivalent amount of asset B, based on a live price.

> Function includes the amount and applies .mul() first to increase the accuracy.

#### Declaration

```solidity
  function _convertAmountOnLivePrice(
    struct FixedPointInt256.FixedPointInt _amount,
    struct FixedPointInt256.FixedPointInt _priceA,
    struct FixedPointInt256.FixedPointInt _priceB
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type                                  | Description                                                                                                               |
| --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `_amount` | struct FixedPointInt256.FixedPointInt | Amount in asset A.                                                                                                        |
| `_priceA` | struct FixedPointInt256.FixedPointInt | The price of asset A, as returned by Opyn's oracle (decimals = 8), in the FixedPointInt representation of decimal numbers |
| `_priceB` | struct FixedPointInt256.FixedPointInt | The price of asset B, as returned by Opyn's oracle (decimals = 8), in the FixedPointInt representation of decimal numbers |

## Events

### Deposited

Emits when an LP deposits (initially unlocked) funds into Potion.

### Withdrawn

Emits when an LP withdraws unlocked funds from Potion.

### CriteriaSetSelected

Emits when an LP associates a set of crtieria with a pool of their capital.

### CurveSelected

Emits when an LP associates a pricing curve with a pool of their capital.

### OptionsBought

Emits once per purchase, with details of the buyer and the aggregate figures involved.

### OptionsSold

Emits for every LP involved in collateralizing a purchase, with details of the LP and the figures involved in their part of the purchase.

### OptionSettled

Emits when all collateral for a given otoken (which must have reached expiry) is reclaimed from the Opyn contracts, into this Potion contract.

### OptionSettlementDistributed

Emits every time that some collateral (preciously reclaimed from the Opyn conracts into this Potion contract) is redistributed to one of the collateralising LPs.
