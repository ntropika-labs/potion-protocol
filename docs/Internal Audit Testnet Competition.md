# Internal Audit Testnet Competition

This document compiles all the information that has been reviewed and found during the internal audit for the Testnet Competition:

# Documents

[Potion Hedging Vault - Technical Description v0.2 (draft)](./Potion%20Hedging%20Vault%20-%20Technical%20Description%20v0%202.md8) 

[Potion Hedging Vault - Product Description v0.2 (draft)](./Potion%20Hedging%20Vault%20-%20Product%20Description%20v0%202.md) 

[Hedging Vault Security And Operation Notes](./Hedging%20Vault%20Security%20And%20Operation%20Notes.md) 

# Static Analysis

| Function | Severity | Type | Comment |
| --- | --- | --- | --- |
|  |  |  |  |
| InvestmentVault.canPositionBeExited | Low | https://github.com/crytic/slither/wiki/Detector-Documentation/#calls-inside-a-loop | The external call to action.canPositionBeExited is trusted but the action will eventually call some other external contracts that may not be trusted. This needs further analysis but for the Testnet Competition it should be fine as we control all the contracts in the system |
| InvestmentVault.exitPosition | Low | https://github.com/crytic/slither/wiki/Detector-Documentation/#calls-inside-a-loop | The external call to action.exitPosition is trusted but the action will eventually call some other external contracts that may not be trusted. This needs further analysis but for the Testnet Competition it should be fine as we control all the contracts in the system. |
| PotionBuyAction:_isNexCycleStarted
PotionBuyAction.canPositionBeEntered
PotionBuyAction.canPositionBeExited
PotionBuyAction.enterPosition
PotionBuyAction.exitPosition
PotionBuyAction.initialize | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp | If a miner would tamper with the block timestamp, it could indeed alter the beginning
of the next cycle, taking advantage of this to perhaps extract more value from the protocol.
Unfortunately, there is no way to prevent this, as the block timestamp is needed to calculate
when the round starts |
| BaseRoundsVaultUpgradeable._redeemExchangeAsset | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | The external call through safeTransfer is done at the end of the function,
following the CEI pattern to prevent out-of-order execution. This function is only called
from redeemExchangeAsset and it is called at the end of that function as well. |
| BaseRoundsVaultUpgradeable._redeemExchangeAssetBatch | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | The external call through `safeTransfer` is done at the end of the function,
following the CEI pattern to prevent out-of-order execution. This function is only called
from `redeemExchangeAssetBatch` and it is called at the end of that function as well. |
| PotionBuyAction.enterPosition
PotionBuyAction.exitPosition
SwapToUSDCAction.enterPosition
SwapToUSDCAction.exitPosition | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | It is protected with the nonReentrant modifier to avoid re-entrancy. In any case
the only contract allowed to call this function is the InvestmentVault and the call would only happen
upon instruction of the operator. A possible attack vector would be for a malicious actor to deposit
some assets in the RoundsInputVault when the PotionBuyAction is trying to enter the position, but
that is countermeasure by the fact that assets have been already transferred to the PotionBuyContract
before doing any external call. And considering the ERC-777, although deprecated, the owner of the tokens
is the InvestmentVault which will not use the ERC-777 callback. |
| PotionBuyAction.initialize | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp | The use of block.timestamp here is required to calculate the next cycle start time |
| BaseRoundsVaultUpgradeable._redeemExchangeAsset | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | This function follows the CEI pattern to avoid out-of-order execution. The only
external call is safeTransfer that is done at the end of the function where the state
of the contract is consistent and a reentrancy is protected by the _burn function that
will check the balance of the user |
| BaseRoundsVaultUpgradeable._redeemExchangeAssetBatch | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | This function follows the CEI pattern to avoid out-of-order execution. The only
external call is safeTransfer that is done at the end of the function where the state
of the contract is consistent and a reentrancy is protected by the burnBatch function that
will check the balance of the user |
| RoundsInputVault._operate
RoundsOutputVault._operate | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | This function is protected for re-entrancy by two mechanisms: only the Operator can call
_nextRound which is the function that in turn calls this function, and the Operator is a trusted
entity. Also, even if the operator would call nextRound in a re-entrancy attack, the funds are being
moved from this contract to the InvestmentVault contract and no more funds would be left, leading
the following code to be a no-op |
| VaultWithReceiptsUpgradeable._deposit | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | If _asset is ERC777, transferFrom can trigger a reenterancy BEFORE the transfer happens through thetokensToSend hook. On the other hand, the tokenReceived hook, that is triggered after the transfer, calls the vault, which is assumed not malicious.
Conclusion: we need to do the transfer before we mint so that any reentrancy would happen before the assets are transfered and before the shares are minted, which is a valid state. |
| VaultWithReceiptsUpgradeable._redeem
VaultWithReceiptsUpgradeable._redeemBatch |  | https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3 | If _asset is ERC777, transfer can trigger trigger a reentrancy AFTER the transfer happens through the tokensReceived hook. On the other hand, the tokensToSend hook, that is triggered before the transfer, calls the vault, which is assumed not malicious.
Conclusion: we need to do the Setransfer after the burn so that any reentrancy would happen after the shares are burned and after the assets are transfered, which is a valid state. |
| UniswapV3SwapLib.swapOutput | Low | https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp | block.timestamp is used to calculate the deadline, which is a timestamp in seconds. This is not vulnerable to
to the timestamp vulnerability, as the block.timestamp is not used to calculate anything random |
| PotionBuyAction
SwapToUSDCAction | Informational | https://github.com/crytic/slither/wiki/Detector-Documentation#missing-inheritance | The contract misses inheritance because there is a linearization issue with inheriting from the interface. Waiting for the new compiler to fix this issue |
| UniswapV3Path.getFirstPool
UniswapV3Path.hasMultiplePools
UniswapV3Path.numPools
UniswapV3Path.skipToken
VaultDeferredOperationUpgradeable.__VaultDeferredOperation_init
VaultWithReceiptsUpgradeable.__VaultWithReceipts_init
VaultWithReceiptsUpgradeable._getMintId | Informational | https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code | The code could be removed if we want to decrease the contract size |

# Surface Attack

## Functions

| Contract | Function | Modifier | Accessed By | Comment |
| --- | --- | --- | --- | --- |
| PotionBuyAction | initialize | initializer | Everyone | OPEN |
|  | enterPosition | onlyVault
onlyUnlocked
onlyAfterCycleStart
nonReentrant | InvestmentVault | Vault is set to the InvestmentVault |
|  | exitPosition | onlyVault
onlyLocked
onlyAfterCycleStart
nonReentrant | InvestmentVault | Vault is set to the InvestmentVault |
|  | setMaximumPremiumPercentage
setSwapSlippage
setMaxSwapDuration
setCycleDuration
setStrikePercentage
setHedgingRate
setHedgingRateSlippage | onlyStrategist | Strategist | Strategist is set currently to the Deployer address |
|  | setSwapInfo | onlyOperator | Operator | Operator is set currently to the Deployer address |
|  | setPotionBuyInfo | onlyOperator | Operator | Operator is set currently to the Deployer address |
|  | setVaultCap | onlyAdmin | Admin | Admin is set currently to the Deployer address |
| SwapToUSDCAction | initialize | initializer | Everyone | OPEN |
|  | enterPosition | onlyVault
onlyUnlocked
nonReentrant | InvestmentVault | Vault is set to the InvestmentVault |
|  | exitPosition | onlyVault
onlyLocked
nonReentrant | InvestmentVault | Vault is set to the InvestmentVault |
|  | setSwapSlippage
setMaxSwapDuration
setSwapPercentage | onlyStrategist | Strategist | Strategist is set currently to the Deployer address |
| InvestmentVault | initialize | initializer | Everyone | OPEN |
|  | enterPosition
enterPositionWith
exitPosition | onlyOperator
onlyUnlocked
nonReentrant | Operator |  |
|  | deposit
mint
withdraw
redeem | onlyUnlocked
onlyInvestor | Investor | RoundsInputVault and RoundsOutputVault have the role Investor |
|  | setManagementFee
setPerformanceFee
setFeesReceipient | onlyAdmin | Admin | Admin is set currently to the Deployer address |
|  | pause
unpause | onlyAdmin | Admin | Admin is set currently to the Deployer address |
|  | grantRole
revokeRole | onlyRole(ROLE_ADMIN)
onlyRole(ROLE_ADMIN) | Admin | Initially all role admins are set to the same address as the Deployer |
|  | renounceRole | - | Everyone | Only holders of the role to be renounced can call this function |
|  | refund
refundETH | onlyAdmin | Admin | Admin is set currently to the Deployer address |
| RoundsInputVault | initialize | initializer | Everyone | OPEN |
|  | deposit
redeem
redeemBatch
redeemExchangeAsset
redeemExchangeAssetBatch | onlyInvestor | Everyone | OPEN
The Investor role is set to the zero address signaling that anybody can call these functions, which is the desired behaviour |
|  | nextRound | onlyOperator | Operator | Operator is set currently to the Deployer address |
| RoundsOutputVault | initialize | initializer | Everyone | OPEN |
|  | deposit
redeem
redeemBatch
redeemExchangeAsset
redeemExchangeAssetBatch | onlyInvestor | Everyone | OPEN
The Investor role is set to the zero address signaling that anybody can call these functions, which is the desired behaviour |
|  | nextRound | onlyOperator | Operator | Operator is set currently to the Deployer address |
| HedgingVaultOrchestrator | nextRound
setSystemAddresses | onlyOwner | Operator | Owner is set currently to the Deployer address |
| RoundsVaultExchanger | exchangeInputForOutput
exchangeInputForOutputBatch | - | Everyone | OPEN
These two functions are unprotected as the contract as a helper for users to do only one transaction |

# Gas Costs

| Contract | Caller | Method | Min | Max | Avg | # calls | usd (avg) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ERC1155Upgradeable | User | setApprovalForAll | - | - | 53576 | 1 | 0.82 |
| ERC20PresetMinterPauser | Admin | grantRole | 108598 | 125710 | 119519 | 141 | 1.84 |
| ERC4626CapUpgradeable | RoundsInputVault | deposit | 129288 | 170576 | 155630 | 10 | 2.39 |
| ERC4626CapUpgradeable | RoundsOuputVault | redeem | - | - | 77616 | 1 | 1.19 |
| HedgingVaultOrchestrator | Operator | nextRound | 1147318 | 1383582 | 1289062 | 10 | 19.81 |
| HedgingVaultOrchestrator | Operator | setSystemAddresses | 136516 | 136528 | 136525 | 30 | 2.10 |
| HedgingVaultOrchestrator | Operator | transferOwnership | - | - | 25785 | 30 | 0.40 |
| InvestmentVault | Orchestrator | enterPosition | 209267 | 503188 | 385620 | 5 | 5.93 |
| InvestmentVault | Orchestrator | exitPosition | 148003 | 291763 | 234259 | 5 | 3.60 |
| PotionBuyAction | Operator | setPotionBuyInfo | 376248 | 416156 | 402849 | 3 | 6.19 |
| PotionBuyAction | Operator | setSwapInfo | 167479 | 167575 | 167527 | 6 | 2.58 |
| RoundsInputVault | User | deposit | 116362 | 167674 | 161259 | 8 | 2.48 |
| RoundsInputVault | Deployer | initialize | - | - | 371191 | 8 | 5.71 |
| RoundsInputVault | Orchestrator | nextRound | 69425 | 139737 | 102977 | 13 | 1.58 |
| RoundsInputVault | User | redeem | - | - | 60520 | 1 | 0.93 |
| RoundsInputVault | User | redeemBatch | - | - | 68014 | 1 | 1.05 |
| RoundsInputVault | User | redeemExchangeAsset | 52747 | 86385 | 79217 | 7 | 1.22 |
| RoundsInputVault | User | redeemExchangeAssetBatch | - | - | 69667 | 1 | 1.07 |
| RoundsOutputVault | User | deposit | 96639 | 150739 | 143977 | 8 | 2.21 |
| RoundsOutputVault | Deployer | initialize | 371168 | 371180 | 371177 | 8 | 5.71 |
| RoundsOutputVault | Orchestrator | nextRound | 64606 | 87332 | 76427 | 13 | 1.17 |
| RoundsOutputVault | User | redeem | - | - | 50601 | 1 | 0.78 |
| RoundsOutputVault | User | redeemBatch | - | - | 58115 | 1 | 0.89 |
| RoundsOutputVault | User | redeemExchangeAsset | - | - | 76345 | 1 | 1.17 |
| RoundsOutputVault | User | redeemExchangeAssetBatch | - | - | 93284 | 1 | 1.43 |
| RoundsVaultExchanger | User | exchangeInputForOutput | - | - | 229815 | 3 | 3.53 |

# Contracts Size

| Contract Name | Size (KiB) | Select |
| --- | --- | --- |
| Address | 0.084 | Internal Contract |
| SafeERC20 | 0.084 | Internal Contract |
| Math | 0.084 | Internal Contract |
| SafeERC20Upgradeable | 0.084 | Internal Contract |
| AddressUpgradeable | 0.084 | Internal Contract |
| CountersUpgradeable | 0.084 | Internal Contract |
| StringsUpgradeable | 0.084 | Internal Contract |
| MathUpgradeable | 0.084 | Internal Contract |
| EnumerableSetUpgradeable | 0.084 | Internal Contract |
| Strings | 0.084 | Internal Contract |
| EnumerableSet | 0.084 | Internal Contract |
| PRBMath | 0.084 | Internal Contract |
| PRBMathUD60x18 | 0.084 | Internal Contract |
| TransferHelper | 0.084 | Internal Contract |
| OpynProtocolLib | 0.084 | Internal Contract |
| PriceUtils | 0.084 | Internal Contract |
| UniswapV3SwapLib | 0.084 | Internal Contract |
| BytesLib | 0.084 | Internal Contract |
| UniswapV3Path | 0.084 | Internal Contract |
| PotionProtocolLib | 0.132 | Internal Contract |
| LifecycleStatesUpgradeable | 0.166 | Internal Contract |
| TimeUtils | 0.220 | Internal Contract |
| PercentageUtils | 0.504 | Internal Contract |
| ERC20 | 2.131 | Internal Contract |
| ERC20Upgradeable | 2.131 | Internal Contract |
| RoundsVaultExchanger | 2.462 | Top Level Contract |
| RolesManagerUpgradeable | 2.845 | Internal Contract |
| ActionsManagerUpgradeable | 2.939 | Internal Contract |
| EmergencyLockUpgradeable | 3.220 | Internal Contract |
| FeeManagerUpgradeable | 3.889 | Internal Contract |
| UniswapV3OracleUpgradeable | 4.016 | Internal Contract |
| HedgingVaultOrchestrator | 4.038 | Top Level Contract |
| RefundsHelperUpgreadable | 4.459 | Internal Contract |
| PotionProtocolOracleUpgradeable | 4.784 | Internal Contract |
| UniswapV3HelperUpgradeable | 4.805 | Internal Contract |
| PotionProtocolHelperUpgradeable | 4.862 | Internal Contract |
| ERC1155Upgradeable | 4.891 | Internal Contract |
| ERC20PresetMinterPauser | 6.234 | Internal Contract |
| ERC1155UpgradeableMock | 7.146 | Internal Contract |
| ERC1155FullSupplyUpgradeableMock | 8.615 | Internal Contract |
| ERC4626CapUpgradeable | 8.724 | Internal Contract |
| SwapToUSDCAction | 11.357 | Top Level Contract |
| RoundsOutputVault | 17.911 | Top Level Contract |
| InvestmentVault | 18.043 | Top Level Contract |
| RoundsInputVault | 18.228 | Top Level Contract |
| PotionBuyAction | 21.615 | Top Level Contract |

# Conclusion

Currently there are no major issues found in the contracts that could affect the operation of the Testnet Competition. A more complete pre-audit will be needed before the actual audit happens towards the release of the product.

Author Roberto Cano (robercano)