# NonStandardToken

> Version of ERC20 with no return values for `transfer` and `transferFrom`
> See https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var         | Type                                            |
| ----------- | ----------------------------------------------- |
| name        | string                                          |
| decimals    | uint8                                           |
| symbol      | string                                          |
| totalSupply | uint256                                         |
| allowance   | mapping(address => mapping(address => uint256)) |
| balanceOf   | mapping(address => uint256)                     |

## Functions

### constructor

No description

#### Declaration

```solidity
  function constructor(
  ) public
```

#### Modifiers:

No modifiers

### transfer

No description

#### Declaration

```solidity
  function transfer(
  ) external
```

#### Modifiers:

No modifiers

### transferFrom

No description

#### Declaration

```solidity
  function transferFrom(
  ) external
```

#### Modifiers:

No modifiers

### approve

No description

#### Declaration

```solidity
  function approve(
  ) external returns (bool)
```

#### Modifiers:

No modifiers
