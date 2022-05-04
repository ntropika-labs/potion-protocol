# FixedPointInt256

FixedPoint library

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Functions

### fromUnscaledInt

constructs an `FixedPointInt` from an unscaled int, e.g., `b=5` gets stored internally as `5**27`.

#### Declaration

```solidity
  function fromUnscaledInt(
    int256 a
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                       |
| --- | ------ | --------------------------------- |
| `a` | int256 | int to convert into a FixedPoint. |

#### Returns:

| Type  | Description           |
| ----- | --------------------- |
| `the` | converted FixedPoint. |

### fromScaledUint

constructs an FixedPointInt from an scaled uint with {\_decimals} decimals
Examples:
(1) USDC decimals = 6
Input: 5 _ 1e6 USDC => Output: 5 _ 1e27 (FixedPoint 8.0 USDC)
(2) cUSDC decimals = 8
Input: 5 _ 1e6 cUSDC => Output: 5 _ 1e25 (FixedPoint 0.08 cUSDC)

#### Declaration

```solidity
  function fromScaledUint(
    uint256 _a,
    uint256 _decimals
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg         | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| `_a`        | uint256 | uint256 to convert into a FixedPoint. |
| `_decimals` | uint256 | original decimals \_a has             |

#### Returns:

| Type  | Description                             |
| ----- | --------------------------------------- |
| `the` | converted FixedPoint, with 27 decimals. |

### toScaledUint

convert a FixedPointInt number to an uint256 with a specific number of decimals

#### Declaration

```solidity
  function toScaledUint(
    struct FixedPointInt256.FixedPointInt _a,
    uint256 _decimals,
    bool _roundDown
  ) internal returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg          | Type                                  | Description                                             |
| ------------ | ------------------------------------- | ------------------------------------------------------- |
| `_a`         | struct FixedPointInt256.FixedPointInt | FixedPointInt to convert                                |
| `_decimals`  | uint256                               | number of decimals that the uint256 should be scaled to |
| `_roundDown` | bool                                  | True to round down the result, False to round up        |

#### Returns:

| Type  | Description       |
| ----- | ----------------- |
| `the` | converted uint256 |

### add

add two signed integers, a + b

#### Declaration

```solidity
  function add(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type  | Description                |
| ----- | -------------------------- |
| `sum` | of the two signed integers |

### sub

subtract two signed integers, a-b

#### Declaration

```solidity
  function sub(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type         | Description            |
| ------------ | ---------------------- |
| `difference` | of two signed integers |

### mul

multiply two signed integers, a by b

#### Declaration

```solidity
  function mul(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type  | Description            |
| ----- | ---------------------- |
| `mul` | of two signed integers |

### div

divide two signed integers, a by b

#### Declaration

```solidity
  function div(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type  | Description            |
| ----- | ---------------------- |
| `div` | of two signed integers |

### min

minimum between two signed integers, a and b

#### Declaration

```solidity
  function min(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type  | Description            |
| ----- | ---------------------- |
| `min` | of two signed integers |

### max

maximum between two signed integers, a and b

#### Declaration

```solidity
  function max(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (struct FixedPointInt256.FixedPointInt)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type  | Description            |
| ----- | ---------------------- |
| `max` | of two signed integers |

### isEqual

is a is equal to b

#### Declaration

```solidity
  function isEqual(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type   | Description            |
| ------ | ---------------------- |
| `True` | if equal, False if not |

### isGreaterThan

is a greater than b

#### Declaration

```solidity
  function isGreaterThan(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type   | Description            |
| ------ | ---------------------- |
| `True` | if a > b, False if not |

### isGreaterThanOrEqual

is a greater than or equal to b

#### Declaration

```solidity
  function isGreaterThanOrEqual(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type   | Description             |
| ------ | ----------------------- |
| `True` | if a >= b, False if not |

### isLessThan

is a is less than b

#### Declaration

```solidity
  function isLessThan(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type   | Description            |
| ------ | ---------------------- |
| `True` | if a < b, False if not |

### isLessThanOrEqual

is a less than or equal to b

#### Declaration

```solidity
  function isLessThanOrEqual(
    struct FixedPointInt256.FixedPointInt a,
    struct FixedPointInt256.FixedPointInt b
  ) internal returns (bool)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type                                  | Description   |
| --- | ------------------------------------- | ------------- |
| `a` | struct FixedPointInt256.FixedPointInt | FixedPointInt |
| `b` | struct FixedPointInt256.FixedPointInt | FixedPointInt |

#### Returns:

| Type   | Description             |
| ------ | ----------------------- |
| `True` | if a <= b, False if not |
