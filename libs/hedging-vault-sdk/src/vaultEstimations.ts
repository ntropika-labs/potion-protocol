// The file has all the methods we need to estimate the underlying size of the vault at a given time

/** This method is used to get the estimated Underlying Balance of the Action that triggered the round
 * @param {number} usdcBalanceActionContract - The USDC balance of the contract
 * @param {number} underlyingBalanceActionContract - The Underlying Balance of the contract
 * @param {number} underlyingPrice - The Underlying Price in USDC
 * @returns {number} - The estimated Underlying Balance of the Action that triggered the round
 */
export const calculateEstimatedUnderlyingBalanceActionContract = (
    usdcBalanceActionContract: number,
    underlyingBalanceActionContract: number,
    underlyingPrice: number,
): number => {
    return usdcBalanceActionContract / underlyingPrice + underlyingBalanceActionContract;
};

/**
 * It calculates the unit payout in USDC of the Potion given the current underlyingPrice in USDC.
 * Unit Payout means the payout of the option per unit of Potion ( 1 otoken/potion = 1 unit)
 * @param {number} strikePrice - The Strike Price of the option, in USDC
 * @param {number} underlyingPrice - The underlying price in USDC
 * @returns {number}
 */
export const calculatePotionUnitPayoutInUsdc = (strikePrice: number, underlyingPrice: number): number => {
    const result = strikePrice - underlyingPrice;
    return result > 0 ? result : 0;
};

/**
 *  It calculates the total payout in USDC of the Potion given the current underlyingPrice in USDC and the amount of Potions bought.
 * @param {number} strikePrice  - The Strike Price of the option, in USDC
 * @param {number} underlyingPrice - The underlying price in USDC
 * @param {number} potionsQuantity - The amount of potions bought
 * @returns {number} - The total payout in USDC of the Potion given the current underlyingPrice in USDC and the amount of Potions bought.
 */
export const calculatePotionPayoutInUsdc = (
    strikePrice: number,
    underlyingPrice: number,
    potionsQuantity: number,
): number => {
    return calculatePotionUnitPayoutInUsdc(strikePrice, underlyingPrice) * potionsQuantity;
};

/**
 *  It calculates the total payout in Underlyings of the Potion given the current underlyingPrice in USDC and the amount of Potions bought.
 * @param {number} strikePrice - The Strike Price of the option, in USDC
 * @param {number} underlyingPrice  - The underlying price in USDC
 * @param {number} potionsQuantity  - The amount of potions bought
 * @returns {number}   - The total payout in Underlying of the Potion given the current underlyingPrice in USDC and the amount of Potions bought.
 */
export const calculatePotionPayoutInUnderlying = (
    strikePrice: number,
    underlyingPrice: number,
    potionsQuantity: number,
): number => {
    return calculatePotionPayoutInUsdc(strikePrice, underlyingPrice, potionsQuantity) / underlyingPrice;
};

/**
 *
 * @param {number} usdcBalanceActionContract - The USDC balance of the action contract
 * @param {number} underlyingBalanceActionContract - The Underlying Balance of the action contract
 * @param {number} underlyingPrice - The Underlying Price in USDC
 * @param {number} strikePrice - The Strike Price of the option, in USDC
 * @param {number} potionsQuantity - The amount of potions bought
 * @returns {number} - The estimated Underlying Balance of the Vault at the current underlying price
 */
export const calculateCurrentTotalUnderlyings = (
    usdcBalanceActionContract: number,
    underlyingBalanceActionContract: number,
    underlyingPrice: number,
    strikePrice: number,
    potionsQuantity: number,
): number => {
    return (
        calculateEstimatedUnderlyingBalanceActionContract(
            usdcBalanceActionContract,
            underlyingBalanceActionContract,
            underlyingPrice,
        ) + calculatePotionPayoutInUnderlying(strikePrice, underlyingPrice, potionsQuantity)
    );
};

/**
 * @param {number} investmentVaultContractShares - the amount of shares emitted by the vault
 * @param {number} usdcBalanceActionContract - The USDC balance of the action contract
 * @param {number} underlyingBalanceActionContract - The Underlying Balance of the action contract
 * @param {number} underlyingPrice - The Underlying Price in USDC
 * @param {number} strikePrice - The Strike Price of the option, in USDC
 * @param {number} potionsQuantity - The amount of potions bought
 * @returns {number} - The estimated Share To Underlying Rate of the Vault at the current underlying price, at the end of the current round
 */
export const calculateCurrentShareToUnderlyingRate = (
    usdcBalanceActionContract: number,
    underlyingBalanceActionContract: number,
    underlyingPrice: number,
    strikePrice: number,
    potionsQuantity: number,
    investmentVaultContractShares: number,
): number => {
    const currentTotalUnderlyings = calculateCurrentTotalUnderlyings(
        usdcBalanceActionContract,
        underlyingBalanceActionContract,
        underlyingPrice,
        strikePrice,
        potionsQuantity,
    );
    return currentTotalUnderlyings / investmentVaultContractShares;
};
