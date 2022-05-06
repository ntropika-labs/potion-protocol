# PRBMathCommon

> Common mathematical functions used in both PRBMathSD59x18 and PRBMathUD60x18. Note that this shared library
> does not always assume the signed 59.18-decimal fixed-point or the unsigned 60.18-decimal fixed-point

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var           | Type    |
| ------------- | ------- |
| SCALE         | uint256 |
| SCALE_LPOTD   | uint256 |
| SCALE_INVERSE | uint256 |

## Functions

### exp2

Calculates the binary exponent of x using the binary fraction method.

> Uses 128.128-bit fixed-point numbers, which is the most efficient way.
> See https://ethereum.stackexchange.com/a/96594/24693.

#### Declaration

```solidity
  function exp2(
    uint256 x
  ) internal returns (uint256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                                                 |
| --- | ------- | ----------------------------------------------------------- |
| `x` | uint256 | The exponent as an unsigned 128.128-bit fixed-point number. |

#### Returns:

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `result` | The result as an unsigned 60x18 decimal fixed-point number. |

### mostSignificantBit

Finds the zero-based index of the first one in the binary representation of x.

> See the note on msb in the "Find First Set" Wikipedia article https://en.wikipedia.org/wiki/Find_first_set

#### Declaration

```solidity
  function mostSignificantBit(
    uint256 x
  ) internal returns (uint256 msb)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                                                                 |
| --- | ------- | --------------------------------------------------------------------------- |
| `x` | uint256 | The uint256 number for which to find the index of the most significant bit. |

#### Returns:

| Type  | Description                                          |
| ----- | ---------------------------------------------------- |
| `msb` | The index of the most significant bit as an uint256. |

### mulDiv

Calculates floor(x\*y÷denominator) with full precision.

> Credit to Remco Bloemen under MIT license https://xn--2-umb.com/21/muldiv.

Requirements:

-   The denominator cannot be zero.
-   The result must fit within uint256.

Caveats:

-   This function does not work with fixed-point numbers.

#### Declaration

```solidity
  function mulDiv(
    uint256 x,
    uint256 y,
    uint256 denominator
  ) internal returns (uint256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg           | Type    | Description                     |
| ------------- | ------- | ------------------------------- |
| `x`           | uint256 | The multiplicand as an uint256. |
| `y`           | uint256 | The multiplier as an uint256.   |
| `denominator` | uint256 | The divisor as an uint256.      |

#### Returns:

| Type     | Description               |
| -------- | ------------------------- |
| `result` | The result as an uint256. |

### mulDivFixedPoint

// @notice Calculates floor(x\*y÷1e18) with full precision.

> Variant of "mulDiv" with constant folding, i.e. in which the denominator is always 1e18. Before returning the
> final result, we add 1 if (x \* y) % SCALE >= HALF_SCALE. Without this, 6.6e-19 would be truncated to 0 instead of
> being rounded to 1e-18. See "Listing 6" and text above it at https://accu.org/index.php/journals/1717.

Requirements:

-   The result must fit within uint256.

Caveats:

-   The body is purposely left uncommented; see the NatSpec comments in "PRBMathCommon.mulDiv" to understand how this works.
-   It is assumed that the result can never be type(uint256).max when x and y solve the following two queations:
    1. x _ y = type(uint256).max _ SCALE
    2. (x \* y) % SCALE >= SCALE / 2

#### Declaration

```solidity
  function mulDivFixedPoint(
    uint256 x,
    uint256 y
  ) internal returns (uint256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                                                       |
| --- | ------- | ----------------------------------------------------------------- |
| `x` | uint256 | The multiplicand as an unsigned 60.18-decimal fixed-point number. |
| `y` | uint256 | The multiplier as an unsigned 60.18-decimal fixed-point number.   |

#### Returns:

| Type     | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `result` | The result as an unsigned 60.18-decimal fixed-point number. |

### mulDivSigned

/ @notice Calculates floor(x\*y÷denominator) with full precision.

> An extension of "mulDiv" for signed numbers. Works by computing the signs and the absolute values separately.

Requirements:

-   None of the inputs can be type(int256).min.
-   The result must fit within int256.

#### Declaration

```solidity
  function mulDivSigned(
    int256 x,
    int256 y,
    int256 denominator
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg           | Type   | Description                    |
| ------------- | ------ | ------------------------------ |
| `x`           | int256 | The multiplicand as an int256. |
| `y`           | int256 | The multiplier as an int256.   |
| `denominator` | int256 | The divisor as an int256.      |

#### Returns:

| Type     | Description              |
| -------- | ------------------------ |
| `result` | The result as an int256. |

### sqrt

Calculates the square root of x, rounding down.

> Uses the Babylonian method https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method.

Caveats:

-   This function does not work with fixed-point numbers.

#### Declaration

```solidity
  function sqrt(
    uint256 x
  ) internal returns (uint256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                                                |
| --- | ------- | ---------------------------------------------------------- |
| `x` | uint256 | The uint256 number for which to calculate the square root. |

#### Returns:

| Type     | Description               |
| -------- | ------------------------- |
| `result` | The result as an uint256. |
