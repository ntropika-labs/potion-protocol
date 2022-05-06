# ICurveManager

Keeps a registry of all Curves that are known to the Potion protocol

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Functions

### addCurve

Add the specified Curve to the registry of Curves that are known to our contract

#### Declaration

```solidity
  function addCurve(
    struct ICurveManager.Curve _curve
  ) external returns (bytes32 hash)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type                       | Description           |
| -------- | -------------------------- | --------------------- |
| `_curve` | struct ICurveManager.Curve | The Curve to register |

#### Returns:

| Type   | Description                |
| ------ | -------------------------- |
| `hash` | The keccak256 of the Curve |

### hashCurve

Get the hash of given Curve

#### Declaration

```solidity
  function hashCurve(
    struct ICurveManager.Curve _curve
  ) external returns (bytes32)
```

#### Modifiers:

No modifiers

#### Args:

| Arg      | Type                       | Description             |
| -------- | -------------------------- | ----------------------- |
| `_curve` | struct ICurveManager.Curve | The Curve to be hashed. |

#### Returns:

| Type  | Description                 |
| ----- | --------------------------- |
| `The` | keccak256 hash of the Curve |

### isKnownCurveHash

Check whether the specified hash is the hash of a Curve that is known to our contract

#### Declaration

```solidity
  function isKnownCurveHash(
    bytes32 _hash
  ) external returns (bool valid)
```

#### Modifiers:

No modifiers

#### Args:

| Arg     | Type    | Description          |
| ------- | ------- | -------------------- |
| `_hash` | bytes32 | The hash to look for |

#### Returns:

| Type    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `valid` | True if the hash is that of a known Curve; false if it is not |

### cosh

Calculates hyperbolic cosine of an input x, using the formula:

           e^x + e^(-x)

cosh(x) = ------------
2

> The input and output are signed 59x18-bit fixed point number.

#### Declaration

```solidity
  function cosh(
    int256 _input59x18
  ) external returns (int256 output59x18)
```

#### Modifiers:

No modifiers

#### Args:

| Arg           | Type   | Description                         |
| ------------- | ------ | ----------------------------------- |
| `_input59x18` | int256 | Signed 59x18-bit fixed point number |

#### Returns:

| Type          | Description                                             |
| ------------- | ------------------------------------------------------- |
| `output59x18` | Result of computing the hyperbolic cosine of an input x |

### hyperbolicCurve

Evaluates the function defined by curve c at point x, example:

a _ x _ cosh(b\*x^c) + d

> x is typically utilisation as a fraction (1 = 100%).
> All inputs are signed 59x18-bit fixed point numbers, i.e. the numerator part of a number
> that has a fixed denominator of 2^64
> The output is a signed 59x18-bit fixed point number.

#### Declaration

```solidity
  function hyperbolicCurve(
    struct ICurveManager.Curve _curve,
    int256 _x_59x18
  ) external returns (int256 output59x18)
```

#### Modifiers:

No modifiers

#### Args:

| Arg        | Type                       | Description                                                                    |
| ---------- | -------------------------- | ------------------------------------------------------------------------------ |
| `_curve`   | struct ICurveManager.Curve | The Curve values to be used by the function expression mentioned above.        |
| `_x_59x18` | int256                     | The point at which the function expression mentioned above will be calculated. |

#### Returns:

| Type          | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `output59x18` | Result of the function expression mentioned above evaluated at point x. |

## Events

### CurveAdded

Emits when new curves are registered.

> Curves are immutable once added, so expect at most one log per curveHash.
