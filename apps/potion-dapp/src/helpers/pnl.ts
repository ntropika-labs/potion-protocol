/**
 * Used to calculate the pnl of expired options
 * @param premium the price paid to the LP for this option
 * @param collateral the amount of stable coin provided by the LP for this option
 * @param reclaimable the amount of stable coin that the LP can reclaim from this option
 * @throws an error if reclaimable > collateral
 * @returns PnL as a pure number (should be multiplied by 100 to obtain a percentage)
 */
const calculatePnL = (
  premium: number,
  collateral: number,
  reclaimable: number
): number => {
  if (reclaimable > collateral) {
    throw new Error("reclaimable > collateral");
  }
  return (premium - collateral + reclaimable) / collateral;
};

/**
 * Used to estimate the pnl of active options
 * @param premium the price paid to the LP for this option
 * @param collateral the amount of stable coin provided by the LP for this option
 * @param strikePrice the strike price used to sell this option
 * @param currentPrice the current price of the asset covered by this option
 * @returns PnL as a pure number (should be multiplied by 100 to obtain a percentage)
 */
const estimatePnL = (
  premium: number,
  collateral: number,
  strikePrice: number,
  currentPrice: number
): number => {
  const amountOfOtokens = collateral / strikePrice;
  const otokenValue = Math.max(strikePrice - currentPrice, 0);
  return (premium - amountOfOtokens * otokenValue) / collateral;
};

export { calculatePnL, estimatePnL };
