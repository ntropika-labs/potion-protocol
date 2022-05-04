# SignedConverter

A library to convert an unsigned integer to signed integer or signed integer to unsigned integer.

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Functions

### uintToInt

convert an unsigned integer to a signed integer

#### Declaration

```solidity
  function uintToInt(
    uint256 a
  ) internal returns (int256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type    | Description                           |
| --- | ------- | ------------------------------------- |
| `a` | uint256 | uint to convert into a signed integer |

#### Returns:

| Type        | Description    |
| ----------- | -------------- |
| `converted` | signed integer |

### intToUint

convert a signed integer to an unsigned integer

#### Declaration

```solidity
  function intToUint(
    int256 a
  ) internal returns (uint256)
```

#### Modifiers:

No modifiers

#### Args:

| Arg | Type   | Description                             |
| --- | ------ | --------------------------------------- |
| `a` | int256 | int to convert into an unsigned integer |

#### Returns:

| Type        | Description      |
| ----------- | ---------------- |
| `converted` | unsigned integer |
