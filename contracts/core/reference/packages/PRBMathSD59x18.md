# PRBMathSD59x18

Smart contract library for advanced fixed-point math. It works with int256 numbers considered to have 18
trailing decimals. We call this number representation signed 59.18-decimal fixed-point, since the numbers can have
a sign and there can be up to 59 digits in the integer part and up to 18 decimals in the fractional part. The numbers
are bound by the minimum and the maximum values permitted by the Solidity type int256.

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var                             | Type    |
| ------------------------------- | ------- |
| LOG2_E                          | int256  |
| HALF_SCALE                      | int256  |
| MAX_SD59x18                     | int256  |
| MAX_WHOLE_SD59x18               | int256  |
| MIN_SD59x18                     | int256  |
| MIN_WHOLE_SD59x18               | int256  |
| SCALE                           | int256  |
| MAX_UINT_CONVERTIBLE_TO_SD59x18 | uint256 |

## Functions

### abs

Calculate the absolute value of x.

> Requirements:

-   x must be greater than MIN_SD59x18.

#### Declaration

```solidity
  function abs(
    int256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                     |
| -------- | ------ | ----------------------------------------------- |
| `x`      | int256 | The number to calculate the absolute value for. |
| `result` |        | The absolute value of x.                        |

### avg

Calculates arithmetic average of x and y, rounding down.

#### Declaration

```solidity
  function avg(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                      |
| --- | ------ | ---------------------------------------------------------------- |
| `x` | int256 | The first operand as a signed 59.18-decimal fixed-point number.  |
| `y` | int256 | The second operand as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                                          |
| -------- | -------------------------------------------------------------------- |
| `result` | The arithmetic average as a signed 59.18-decimal fixed-point number. |

### ceil

Yields the least greatest signed 59.18 decimal fixed-point number greater than or equal to x.

> Optimised for fractional value inputs, because for every whole value there are (1e18 - 1) fractional counterparts.
> See https://en.wikipedia.org/wiki/Floor_and_ceiling_functions.

Requirements:

-   x must be less than or equal to MAX_WHOLE_SD59x18.

#### Declaration

```solidity
  function ceil(
    int256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                                                                 |
| -------- | ------ | ------------------------------------------------------------------------------------------- |
| `x`      | int256 | The signed 59.18-decimal fixed-point number to ceil.                                        |
| `result` |        | The least integer greater than or equal to x, as a signed 58.18-decimal fixed-point number. |

### div

Divides two signed 59.18-decimal fixed-point numbers, returning a new signed 59.18-decimal fixed-point number.

> Variant of "mulDiv" that works with signed numbers. Works by computing the signs and the absolute values separately.

Requirements:

-   All from "PRBMathCommon.mulDiv".
-   None of the inputs can be type(int256).min.
-   y cannot be zero.
-   The result must fit within int256.

Caveats:

-   All from "PRBMathCommon.mulDiv".

#### Declaration

```solidity
  function div(
    int256 x,
    int256 y,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                                   |
| -------- | ------ | ------------------------------------------------------------- |
| `x`      | int256 | The numerator as a signed 59.18-decimal fixed-point number.   |
| `y`      | int256 | The denominator as a signed 59.18-decimal fixed-point number. |
| `result` |        | The quotient as a signed 59.18-decimal fixed-point number.    |

### e

// @notice Returns Euler's number as a signed 59.18-decimal fixed-point number.

> See https://en.wikipedia.org/wiki/E_(mathematical_constant).

#### Declaration

```solidity
  function e(
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

### exp

// @notice Calculates the natural exponent of x.

> Based on the insight that e^x = 2^(x \* log2(e)).

Requirements:

-   All from "log2".
-   x must be less than 88.722839111672999628.

Caveats:

-   All from "exp2".
-   For any x less than -41.446531673892822322, the result is zero.

#### Declaration

```solidity
  function exp(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                |
| --- | ------ | ---------------------------------------------------------- |
| `x` | int256 | The exponent as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### exp2

// @notice Calculates the binary exponent of x using the binary fraction method.

> See https://ethereum.stackexchange.com/q/79903/24693.

Requirements:

-   x must be 128e18 or less.
-   The result must fit within MAX_SD59x18.

Caveats:

-   For any x less than -59.794705707972522261, the result is zero.

#### Declaration

```solidity
  function exp2(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                |
| --- | ------ | ---------------------------------------------------------- |
| `x` | int256 | The exponent as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### floor

// @notice Yields the greatest signed 59.18 decimal fixed-point number less than or equal to x.

> Optimised for fractional value inputs, because for every whole value there are (1e18 - 1) fractional counterparts.
> See https://en.wikipedia.org/wiki/Floor_and_ceiling_functions.

Requirements:

-   x must be greater than or equal to MIN_WHOLE_SD59x18.

#### Declaration

```solidity
  function floor(
    int256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                                                                 |
| -------- | ------ | ------------------------------------------------------------------------------------------- |
| `x`      | int256 | The signed 59.18-decimal fixed-point number to floor.                                       |
| `result` |        | The greatest integer less than or equal to x, as a signed 58.18-decimal fixed-point number. |

### frac

// @notice Yields the excess beyond the floor of x for positive numbers and the part of the number to the right
of the radix point for negative numbers.

> Based on the odd function definition. https://en.wikipedia.org/wiki/Fractional_part

#### Declaration

```solidity
  function frac(
    int256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                                                |
| -------- | ------ | -------------------------------------------------------------------------- |
| `x`      | int256 | The signed 59.18-decimal fixed-point number to get the fractional part of. |
| `result` |        | The fractional part of x as a signed 59.18-decimal fixed-point number.     |

### fromInt

// @notice Converts a number from basic integer form to signed 59.18-decimal fixed-point representation.

> Requirements:

-   x must be greater than or equal to MIN_SD59x18 divided by SCALE.
-   x must be less than or equal to MAX_SD59x18 divided by SCALE.

#### Declaration

```solidity
  function fromInt(
    int256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type   | Description                                                         |
| -------- | ------ | ------------------------------------------------------------------- |
| `x`      | int256 | The basic integer to convert.                                       |
| `result` |        | The same number in signed 59.18-decimal fixed-point representation. |

### gm

// @notice Calculates geometric mean of x and y, i.e. sqrt(x \* y), rounding down.

> Requirements:

-   x \* y must fit within MAX_SD59x18, lest it overflows.
-   x \* y cannot be negative.

#### Declaration

```solidity
  function gm(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                      |
| --- | ------ | ---------------------------------------------------------------- |
| `x` | int256 | The first operand as a signed 59.18-decimal fixed-point number.  |
| `y` | int256 | The second operand as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### inv

// @notice Calculates 1 / x, rounding towards zero.

> Requirements:

-   x cannot be zero.

#### Declaration

```solidity
  function inv(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                     |
| --- | ------ | ------------------------------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number for which to calculate the inverse. |

#### Returns:

| Type     | Description                                               |
| -------- | --------------------------------------------------------- |
| `result` | The inverse as a signed 59.18-decimal fixed-point number. |

### ln

// @notice Calculates the natural logarithm of x.

> Based on the insight that ln(x) = log2(x) / log2(e).

Requirements:

-   All from "log2".

Caveats:

-   All from "log2".
-   This doesn't return exactly 1 for 2718281828459045235, for that we would need more fine-grained precision.

#### Declaration

```solidity
  function ln(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                               |
| --- | ------ | ----------------------------------------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number for which to calculate the natural logarithm. |

#### Returns:

| Type     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| `result` | The natural logarithm as a signed 59.18-decimal fixed-point number. |

### log10

// @notice Calculates the common logarithm of x.

> First checks if x is an exact power of ten and it stops if yes. If it's not, calculates the common
> logarithm based on the insight that log10(x) = log2(x) / log2(10).

Requirements:

-   All from "log2".

Caveats:

-   All from "log2".

#### Declaration

```solidity
  function log10(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                              |
| --- | ------ | ---------------------------------------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number for which to calculate the common logarithm. |

#### Returns:

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| `result` | The common logarithm as a signed 59.18-decimal fixed-point number. |

### log2

// @notice Calculates the binary logarithm of x.

> Based on the iterative approximation algorithm.
> https://en.wikipedia.org/wiki/Binary_logarithm#Iterative_approximation

Requirements:

-   x must be greater than zero.

Caveats:

-   The results are not perfectly accurate to the last decimal, due to the lossy precision of the iterative approximation.

#### Declaration

```solidity
  function log2(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                              |
| --- | ------ | ---------------------------------------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number for which to calculate the binary logarithm. |

#### Returns:

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| `result` | The binary logarithm as a signed 59.18-decimal fixed-point number. |

### mul

// @notice Multiplies two signed 59.18-decimal fixed-point numbers together, returning a new signed 59.18-decimal
fixed-point number.

> Variant of "mulDiv" that works with signed numbers and employs constant folding, i.e. the denominator is
> alawys 1e18.

Requirements:

-   All from "PRBMathCommon.mulDivFixedPoint".
-   The result must fit within MAX_SD59x18.

Caveats:

-   The body is purposely left uncommented; see the NatSpec comments in "PRBMathCommon.mulDiv" to understand how this works.

#### Declaration

```solidity
  function mul(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                    |
| --- | ------ | -------------------------------------------------------------- |
| `x` | int256 | The multiplicand as a signed 59.18-decimal fixed-point number. |
| `y` | int256 | The multiplier as a signed 59.18-decimal fixed-point number.   |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### pi

// @notice Returns PI as a signed 59.18-decimal fixed-point number.

#### Declaration

```solidity
  function pi(
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

### pow

// @notice Raises x to the power of y.

> Based on the insight that x^y = 2^(log2(x) \* y).

Requirements:

-   All from "exp2", "log2" and "mul".
-   z cannot be zero.

Caveats:

-   All from "exp2", "log2" and "mul".
-   Assumes 0^0 is 1.

#### Declaration

```solidity
  function pow(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                     |
| --- | ------ | ------------------------------------------------------------------------------- |
| `x` | int256 | Number to raise to given power y, as a signed 59.18-decimal fixed-point number. |
| `y` | int256 | Exponent to raise x to, as a signed 59.18-decimal fixed-point number.           |

#### Returns:

| Type     | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| `result` | x raised to power y, as a signed 59.18-decimal fixed-point number. |

### powu

// @notice Raises x (signed 59.18-decimal fixed-point number) to the power of y (basic unsigned integer) using the
famous algorithm "exponentiation by squaring".

> See https://en.wikipedia.org/wiki/Exponentiation_by_squaring

Requirements:

-   All from "abs" and "PRBMathCommon.mulDivFixedPoint".
-   The result must fit within MAX_SD59x18.

Caveats:

-   All from "PRBMathCommon.mulDivFixedPoint".
-   Assumes 0^0 is 1.

#### Declaration

```solidity
  function powu(
    int256 x,
    uint256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                                            |
| --- | ------- | ------------------------------------------------------ |
| `x` | int256  | The base as a signed 59.18-decimal fixed-point number. |
| `y` | uint256 | The exponent as an uint256.                            |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### scale

// @notice Returns 1 as a signed 59.18-decimal fixed-point number.

#### Declaration

```solidity
  function scale(
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

### sqrt

// @notice Calculates the square root of x, rounding down.

> Uses the Babylonian method https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method.

Requirements:

-   x cannot be negative.
-   x must be less than MAX_SD59x18 / SCALE.

Caveats:

-   The maximum fixed-point number permitted is 57896044618658097711785492504343953926634.992332820282019729.

#### Declaration

```solidity
  function sqrt(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                                         |
| --- | ------ | ----------------------------------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number for which to calculate the square root. |

#### Returns:

| Type     | Description                                        |
| -------- | -------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point . |

### toInt

// @notice Converts a signed 59.18-decimal fixed-point number to basic integer form, rounding down in the process.

#### Declaration

```solidity
  function toInt(
    int256 x
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                             |
| --- | ------ | ------------------------------------------------------- |
| `x` | int256 | The signed 59.18-decimal fixed-point number to convert. |

#### Returns:

| Type     | Description                            |
| -------- | -------------------------------------- |
| `result` | The same number in basic integer form. |

### fromUint

// @notice Converts a number from basic integer form to signed 59.18-decimal fixed-point representation.

> Created for convenience to allow creation of signed decimals from unsiged ints.
> Requirements:

-   x must be greater than or equal to MIN_SD59x18 divided by SCALE.
-   x must be less than or equal to MAX_SD59x18 divided by SCALE.

#### Declaration

```solidity
  function fromUint(
    uint256 x,
     result
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type    | Description                                                         |
| -------- | ------- | ------------------------------------------------------------------- |
| `x`      | uint256 | The basic integer to convert.                                       |
| `result` |         | The same number in signed 59.18-decimal fixed-point representation. |

### add

// @notice Adds two signed 59.18-decimal fixed-point numbers together, returning a new signed 59.18-decimal fixed-point number.

> Created for convenience, to allow use of the `x.add(y)` notation. Solidity V0.8's overflow checks are sufficient to ensure safety.

#### Declaration

```solidity
  function add(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                             |
| --- | ------ | ------------------------------------------------------- |
| `x` | int256 | An addend as a signed 59.18-decimal fixed-point number. |
| `y` | int256 | An addend as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                              |
| -------- | -------------------------------------------------------- |
| `result` | The result as a signed 59.18-decimal fixed-point number. |

### sub

// @notice Subtracts one signed 59.18-decimal fixed-point number from another signed 59.18-decimal fixed-point number, returning a new signed 59.18-decimal fixed-point number.

> Created for convenience, to allow the `x.sub(y)` notation. Solidity V0.8's overflow checks are sufficient to ensure safety.

#### Declaration

```solidity
  function sub(
    int256 x,
    int256 y
  ) internal returns (int256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                  |
| --- | ------ | ------------------------------------------------------------ |
| `x` | int256 | The minuend as a signed 59.18-decimal fixed-point number.    |
| `y` | int256 | The subtrahend as a signed 59.18-decimal fixed-point number. |

#### Returns:

| Type     | Description                                                  |
| -------- | ------------------------------------------------------------ |
| `result` | The difference as a signed 59.18-decimal fixed-point number. |

### toUint

// @notice Converts a non-negative, signed 59.18-decimal fixed-point number to basic integer form, rounding down in the process.

#### Declaration

```solidity
  function toUint(
    int256 x
  ) internal returns (uint256 result)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                                                           |
| --- | ------ | --------------------------------------------------------------------- |
| `x` | int256 | The signed, non-negative 59.18-decimal fixed-point number to convert. |

#### Returns:

| Type     | Description                            |
| -------- | -------------------------------------- |
| `result` | The same number in basic integer form. |
