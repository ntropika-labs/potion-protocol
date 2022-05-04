# StandardToken

> Implementation of the basic standard token.
> See https://github.com/ethereum/EIPs/issues/20

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var         | Type                                            |
| ----------- | ----------------------------------------------- |
| name        | string                                          |
| symbol      | string                                          |
| decimals    | uint8                                           |
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
  ) external returns (bool)
```

#### Modifiers:

No modifiers

### transferFrom

No description

#### Declaration

```solidity
  function transferFrom(
  ) external returns (bool)
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
