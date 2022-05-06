# CriteriaManager

Keeps a registry of all Criteria and CriteriaSet instances that are know to the Potion protocol.

## Contents

<!-- START doctoc -->
<!-- END doctoc -->

## Globals

> Note this contains internal vars as well due to a bug in the docgen procedure

| Var                | Type                                                    |
| ------------------ | ------------------------------------------------------- |
| registeredCriteria | mapping(bytes32 => bool)                                |
| criteriaSetByHash  | mapping(bytes32 => struct ICriteriaManager.CriteriaSet) |

## Modifiers

### onlyValidCriteria

No description

> Neither a zero maxDuration nor a zero maxStrikePercent makes any sense

#### Declaration

```solidity
  modifier onlyValidCriteria
```

## Functions

### addCriteriaSet

Add the specified set of Criteria to the registry of CriteriaSets that are known to our contract.

#### Declaration

```solidity
  function addCriteriaSet(
    bytes32[] _hashes
  ) external returns (bytes32 criteriaSetHash)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type      | Description                                                                                                               |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `_hashes` | bytes32[] | A sorted list of bytes32 values, each being the hash of a known Criteria. No duplicates, so this can be considered a set. |

#### Returns:

| Type              | Description                           |
| ----------------- | ------------------------------------- |
| `criteriaSetHash` | The identifier for this criteria set. |

### isCriteriaSetHash

Check whether the specified hash is the hash of a CriteriaSet that is known to our contract.

#### Declaration

```solidity
  function isCriteriaSetHash(
    bytes32 _criteriaSetHash
  ) public returns (bool valid)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                | Type    | Description           |
| ------------------ | ------- | --------------------- |
| `_criteriaSetHash` | bytes32 | The hash to look for. |

#### Returns:

| Type    | Description                                                          |
| ------- | -------------------------------------------------------------------- |
| `valid` | True if the hash is that of a known CriteriaSet; false if it is not. |

### addCriteria

Add the specified Criteria to the registry of Criteria that are known to our contract.

#### Declaration

```solidity
  function addCriteria(
    struct ICriteriaManager.Criteria _criteria
  ) external onlyValidCriteria returns (bytes32 hash)
```

#### Modifiers:

| Modifier          |
| ----------------- |
| onlyValidCriteria |

#### Args:

| Arg         | Type                             | Description               |
| ----------- | -------------------------------- | ------------------------- |
| `_criteria` | struct ICriteriaManager.Criteria | The Criteria to register. |

#### Returns:

| Type   | Description                    |
| ------ | ------------------------------ |
| `hash` | The keccak256 of the Criteria. |

### hashCriteria

Get the hash of given Criteria

#### Declaration

```solidity
  function hashCriteria(
    struct ICriteriaManager.Criteria _criteria
  ) public returns (bytes32)
```

#### Modifiers:

No modifiers

#### Args:

| Arg         | Type                             | Description                |
| ----------- | -------------------------------- | -------------------------- |
| `_criteria` | struct ICriteriaManager.Criteria | The Criteria to be hashed. |

#### Returns:

| Type  | Description                     |
| ----- | ------------------------------- |
| `The` | keccak256 hash of the Criteria. |

### hashOfSortedHashes

Get the hash of an ordered list of hash values.

#### Declaration

```solidity
  function hashOfSortedHashes(
    bytes32[] _hashes
  ) public returns (bytes32)
```

#### Modifiers:

No modifiers

#### Args:

| Arg       | Type      | Description                                                                                                                                    |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `_hashes` | bytes32[] | The list of bytes32 values to be hashed. This list must be sorted according to solidity's ordering, and must not contain any duplicate values. |

#### Returns:

| Type  | Description                          |
| ----- | ------------------------------------ |
| `The` | keccak256 hash of the set of hashes. |

### isInCriteriaSet

Check whether the specified Criteria hash exists within the specified CriteriaSet.

> Clients should be responsible of passing correct parameters(\_criteriaSetHash and \_criteriaHash), otherwise we revert.

#### Declaration

```solidity
  function isInCriteriaSet(
    bytes32 _criteriaSetHash,
    bytes32 _criteriaHash
  ) external returns (bool isInSet)
```

#### Modifiers:

No modifiers

#### Args:

| Arg                | Type    | Description                                   |
| ------------------ | ------- | --------------------------------------------- |
| `_criteriaSetHash` | bytes32 | The criteria list to be checked.              |
| `_criteriaHash`    | bytes32 | The criteria we are looking for on that list. |

#### Returns:

| Type      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `isInSet` | true if the criteria exists in the criteriaSet; false if it does not. |

### requireOtokenMeetsCriteria

Check that a given token matches some specific Criteria.

#### Declaration

```solidity
  function requireOtokenMeetsCriteria(
    struct ICriteriaManager.Criteria _criteria,
    struct ICriteriaManager.OtokenProperties _otokenCache
  ) external
```

#### Modifiers:

No modifiers

#### Args:

| Arg            | Type                                     | Description                        |
| -------------- | ---------------------------------------- | ---------------------------------- |
| `_criteria`    | struct ICriteriaManager.Criteria         | The criteria to be checked against |
| `_otokenCache` | struct ICriteriaManager.OtokenProperties | The otoken to check                |
