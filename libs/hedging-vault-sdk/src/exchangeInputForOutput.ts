export interface DepositTicket {
    id: number;
    amount: number;
    amountRedeemed: number;
    shares: number;
    remainingShares: number;
}

/**
 *
 * @param {DepositTicket} depositTickets - The deposit tickets to filter.
 * @returns the total amount of shares in the deposit tickets that have not been redeemed yet.
 */
export const calculateTotalRemainingShares = (depositTickets: DepositTicket[]): number => {
    return depositTickets.reduce((acc, ticket) => acc + ticket.remainingShares, 0);
};

/**
 * Calculates the amount of shares to redeem for a given percentage of the remaining shares.
 * @param {DepositTicket[]} depositTickets - The deposit tickets to filter.
 * @param {number} percentage - The percentage of the remaining shares to redeem.
 * @returns the amount of shares to redeem.
 */
export const calculateWithdrawalRequestAmountInShares = (totalRemainingShares: number, percentage: number): number => {
    return (totalRemainingShares * percentage) / 100;
};

/**
 * Calculates the amount of assets requested to be redeemed for a given percentage of the remaining shares.
 * @param {number} totalRemainingShares - The amount of shares not redeemed yet.
 * @param {number} percentage - The percentage of the remaining shares to redeem.
 * @param {number} currentShareToAssetRate - The current share to asset rate.
 * @returns the amount of assets to redeem.
 */
export const calculateWithdrawalRequestAmountInAssets = (
    totalRemainingShares: number,
    percentage: number,
    currentShareToAssetRate: number,
): number => {
    const withdrawalRequestAmountInShares = calculateWithdrawalRequestAmountInShares(totalRemainingShares, percentage);
    return withdrawalRequestAmountInShares * currentShareToAssetRate;
};

/**
 * Calculates the share to ticket amount rate.
 * @param {number} amount - The balance of the ticket.
 * @param {number} shares - The amount of shares the ticket produced.
 * @returns the share to ticket amount rate.
 */
export const calculateShareToTicketAmountRate = (amount: number, shares: number): number => {
    return amount / shares;
};

/**
 *
 * @param withdrawalRequestAmountInShares - The amount of shares to redeem.
 * @param shareToTicketAmountRate - The share to ticket amount rate.
 * @returns the amount of tickets to burn.
 */

export const calculateAmountToBurn = (
    withdrawalRequestAmountInShares: number,
    shareToTicketAmountRate: number,
): number => {
    return withdrawalRequestAmountInShares * shareToTicketAmountRate;
};

/**
 * calculate the remaining amount of tickets.
 * @param {number} amount - The balance of the ticket.
 * @param {number} amountRedeemed - The amount of the ticket that has been redeemed.
 * @return the remaining amount of tickets available to redeem.
 */
export const calculateRemainingAmount = (amount: number, amountRedeemed: number): number => {
    return amount - amountRedeemed;
};

/**
 *
 * @param {DepositTicket[]} depositTickets - The deposit tickets to sort.
 * @returns a sorted DepositTicket array by the amount of remaining shares in the ticket.
 */
export const sortDepositTickets = (depositTickets: DepositTicket[]): DepositTicket[] => {
    return depositTickets.sort((a, b) => b.remainingShares - a.remainingShares);
};

/**
 *
 * @param depositTickets - The deposit tickets to work with.
 * @param percentage - The percentage of the remaining shares to redeem.
 * @returns {ids: number[], amounts: number[]} - An object with the ids and amounts of tickets to burn.
 */
export const getDepositTicketsBurnInfo = (
    depositTickets: DepositTicket[],
    percentage: number,
): { ids: number[]; amounts: number[] } => {
    const totalRemainingShares = calculateTotalRemainingShares(depositTickets);
    const withdrawalRequestAmountInShares = calculateWithdrawalRequestAmountInShares(totalRemainingShares, percentage);
    const sortedDepositTickets = sortDepositTickets(depositTickets);

    const burnInfo: { ids: number[]; amounts: number[] } = { ids: [], amounts: [] };
    sortedDepositTickets.every((ticket: DepositTicket) => {
        const shareToTicketAmountRate = calculateShareToTicketAmountRate(ticket.amount, ticket.shares);
        const remainingAmount = calculateRemainingAmount(ticket.amount, ticket.amountRedeemed);
        const amountToBurn = calculateAmountToBurn(withdrawalRequestAmountInShares, shareToTicketAmountRate);
        if (remainingAmount >= amountToBurn) {
            burnInfo.ids.push(ticket.id);
            burnInfo.amounts.push(amountToBurn);
            return false;
        } else {
            burnInfo.ids.push(ticket.id);
            burnInfo.amounts.push(remainingAmount);
            return true;
        }
    });
    return burnInfo;
};
