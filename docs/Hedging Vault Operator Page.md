# Hedging Vault Operator Page

The Operator needs to prepare 5 different routes for the Hedging Vault operation:

- Exit Uniswap Route for the Potion Buy Action current Round
- Enter Uniswap Route for the Potion Buy Action next Round
- Enter Potion Router for the Potion Buy Action next Round
- Exit Uniswap Route for the Swap To USDC Action current Round
- Enter Uniswap Route for the Swap To USDC Action next Round

The Hedging Vault Orchestrator contract receives all five Routes at the same time through the `nextRound` call. This also implies that the Uniswap enter route MUST be calculated in order to understand how much USDC will be swapped. This is because in a single transaction the Vault exits AND enters the position, so the Vault will always be in the Locked state seen from outside, and the whole exit swap/enter swap will happen in the same block. In order to calculate the routes, the Operator needs to:

# Potion Buy Action

## Exit Swap Route

- Call `calculateCurrentPayout` on PotionBuyAction AFTER the expiration timestamp to get the current payout in USDC `currentPayoutInUSDC`
- Get `USDC.balanceOf(PotionBuyAction.address)` to get the USDC leftovers that are still in the contract from paying the premium `leftoversActonInUSDC`
- Add up the two numbers to calculate `exitSwapAmountInUSDC` and use the result as the swap amount to get the Uniswap route

## Potion Protocol Route

- Use the `exitSwapAmountInUSDC` amount calculated in the previous step and convert it to Underlying using the current Spot price, let's call this `exitSwapAmountInUnderlying`
- Get the Underlying balance of the PotionBuyAction contracts with  `Underlying.balanceOf(PotionBuyAction.address)`. Let’s call this amount `potionBuyActionBalanceInUnderlying`
- Get the total amount of deposits made in the last round with `Underlying.balanceOf(RoundsInputVault.address)`. Let’s call this amount `roundsInputVaultBalanceInUnderlying`
- Calculate the share price of the last Round:
    - Get the total number of shares available in the Investment Vault with `InvestmentVault.totalSupply()`. Let’s call this `investmentVaultTotalShares`
    - Calculate the total number of assets in the Vault with `totalPrincipalBeforeWithdrawalAndDepositsInUnderlying = exitSwapAmountInUnderlying + potionBuyActionBalanceInUnderlying`
    - Calculate the share price as `sharePrice = totalPrincipalBeforeWithdrawalAndDepositsInUnderlying/investmentVaultTotalShares`
- Get the total amount of shares to be withdrawn with `totalSharesToWithdraw = InvestmentVault.balanceOf(RoundsOutputVault.address)`
- Calculate the total amount of assets that will be withdrawn with: `totalAssetsToWithdrawInUnderlying = totalSharesToWithdraw * sharePrice`
- Then calculate the new principal amount that will be available in the Vault after the Round changes: `totalPrincipalInUnderlying = totalPrincipalBeforeWithdrawalAndDepositsInUnderlying + roundsInputVaultBalanceInUnderlying - totalAssetsToWithdrawInUnderlying` which is the total amount that will be used to enter the new position
- Finally calculate the hedged amount that will be protected by the Vault. For this the`hedgingRate` parameter from the Potion Buy Action must be used. This rate can be applied by using `percentageUtils` from the `hedging-vault-sdk` to get the hedged amount. You can get it with `percentageUtils.applyPercentage(totalPrincipalInUnderlying, hedgingRate)` . Let's called this the `principalHedgedAmountInUnderlying`
- Use this `principalHedgedAmountInUnderlying` to calculate the Potion Route and the estimated Premium `estimatedPotionPremiumInUSDC`
- Call the `calculateOrderSize` function available in the `hedging-vault-sdk` package with the `estimatedPotionPremiumInUSDC`, the Strike Percentage, the Hedging Rate and the Spot Price. It will return the effective vault size to be used in the next call to the router, `actualVaultSizeInUnderlying`
- Use this new Vault size to call the Potion Router again and get the final Potion Route to be passed to the Orchestrator. From the Router the actual premium is also received, let’s call this `potionActualPremiumInUSDC`

## Enter Swap Route

- Using the `potionActualPremiumInUSDC` calculated in the previous step, add the Premium Slippage (as done in the previous version), and use this amount as the amount for the Uniswap enter route. You can also use `percentageUtils` here to apply the slippage. In this case you want to use `addPercentage` to calculate the upper bound premium
- Use this `premiumWithSlippage` as the amount for the Uniswap enter route

# Fallback Strategies

For this feature the Operator will need to call Uniswap for 2 extra routes to swap Underlying to USDC and USDC to underlying:

## Fallback Exit Route

- Get the current USDC balance of the Swap To USDC Action, which is the new action for the fallback strategy with `swapToUSDCActionBalanceInUSDC = USDC.balanceOf(SwapToUSDCAction.address)`
- Use `swapToUSDCActionBalanceInUSDC` as the amount to be swapped to Underlying to calculate the Uniswap exit route

## Fallback Enter Route

- Use the `principalHedgedAmountInUnderlying` calculated for the Potion Protocol Route above as the amount to be swapped to USDC to calculate the Uniswap enter route

# Implementation Validation

## Exit Swap Route

```tsx
// 6 decimals converted to number
currentPayout_USDC = parseFloat(
   formatUnits(potionBuyActionContract.calculateCurrentPayout(underlyingAsset), 6)
)
// 6 decimals converted to number
potionBuyActionBalance_USDC = parseFloat(
   formatUnits(erc20USDCContract.getTokenBalance(potionBuyAction), 6)
)

exitSwapAmount_USDC = currentPayout_USDC + potionBuyActionBalance_USDC
```

## Potion Protocol Route

```tsx
// 6 decimals converted to number
hedgingRate = parseFloat(
   formatUnits(potionBuyActionContract.getHedgingRate(), 6)
)
// 6 decimals converted to number
premiumSlippage = parseFloat(
   formatUnits(potionBuyActionContract.getPremiumSlippage(), 6)
)
// 6 decimals converted to number
strikePercentage = parseFloat(
   formatUnits(potionBuyActionContract.strikePercentage(), 6)
)
// 6 decimals converted to number
spotPrice_USDC = parseFloat(
   formatUnits(oracleContract.getPrice(), 6)
)
strikePrice_USDC = spotPrice_USDC * (strikePercentage / 100)

exitSwapAmount_Underlying = exitSwapAmount_USDC / spotPrice_USDC
// 18 decimals converted to number
potionBuyActionBalance_Underlying = parseFloat(
   formatUnits(underlyingTokenContract.getTokenBalance(potionBuyAction), 18)
)
// 18 decimals converted to number
inputVaultBalance_Underlying = parseFloat(
   formatUnits(underlyingTokenContract.	getTokenBalance(roundsInputVault), 18)
)
vaultTotalSupply_Shares = investmentVaultContract.totalSupply()
outputVaultTotalSupply_Shares = investmentVaultContract
	.balanceOf(roundsOutputVault)

totalPrincipalBeforeWithdrawal_Underlying = 
	exitSwapAmount_Underlying +
  potionBuyActionBalance_Underlying +
  inputVaultBalance_Underlying

shareToUnderlyingPrice = 1
if(vaultTotalSupply_Shares > 0) {
	shareToUnderlyingPrice = totalPrincipalBeforeWithdrawal_Underlying 
		/ vaultTotalSupply_Shares
}

totalAssetsToWithdraw_Underlying = outputVaultTotalSupply_Shares * sharePrice;
totalPrincipal_Underlying = totalPrincipalBeforeWithdrawal_Underlying 
	- totalAssetsToWithdraw_Underlying

principalHedgedAmount_Underlying =
  (totalPrincipal_Underlying * hedgingRate) / 100

principalHedgedAmount_USDC =
  principalHedgedAmount_Underlying *
  strikePrice_USDC

// dynamic parameters are hidden
estimatedPotionPremium_USDC = potionDepthRouter.getPotionRoute(
  principalHedgedAmount_USDC
).premium

// 18 decimals converted to number
actualVaultSize_Underlying = parseFloat(
   formatUnits(calculateOrderSize(
        principalHedgedAmount_Underlying,
        underlyingTokenValue.decimals,
        hedgingRate,
        strikePercent,
        oraclePrice,
        estimatedPotionPremium_USDC
	), 18)
)

effectiveVaultSize_USDC = actualVaultSize_Underlying
	* potionRouterParameters.strikePrice_USDC

// dynamic parameters are hidden
potionActualPremium_USDC = potionDepthRouter.getPotionRoute(
  effectiveVaultSize_USDC
).premium

```

## Enter Swap Route

```tsx
// 6 decimals converted to number
premiumSlippage = parseFloat(
  formatUnits(potionBuyActionContract.premiumSlippage(), 6)
)
premiumWithSlippage_USDC =
  ((100 + premiumSlippage) * potionActualPremium_USDC) / 100

uniswapResult = alphaRouter.getRoute(premiumWithSlippage_USDC)
```

## Fallback Exit Route

```tsx
// 6 decimals converted to number
fallbackSwapAmount_USDC = parseFloat(
   formatUnits(erc20USDCContract.getTokenBalance(swapToUSDCAction), 6)
)

uniswapResult = alphaRouter.getRoute(fallbackSwapAmount_USDC)
```

## Fallback Enter Route

```tsx
uniswapResult = alphaRouter.getRoute(principalHedgedAmount_Underlying)
```