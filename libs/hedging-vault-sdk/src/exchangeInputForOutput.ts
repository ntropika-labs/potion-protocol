export interface DepositTicket {
    id: number;
    amount: number;
    amountRedeemed: number;
    shares: number;
    remainingShares: number;
}

export const calculateTotalRemainingShares = (depositTickets: DepositTicket[]) => {
    return depositTickets.reduce((acc, ticket) => acc + ticket.remainingShares, 0);
};

export const calculateWithdrawalRequestAmountInShares = (totalRemainingShares: number, percentage: number): number => {
    return (totalRemainingShares * percentage) / 100;
};
export const calculateWithdrawalRequestAmountInAssets = (
    totalRemainingShares: number,
    percentage: number,
    currentShareToAssetRate: number,
): number => {
    const withdrawalRequestAmountInShares = calculateWithdrawalRequestAmountInShares(totalRemainingShares, percentage);
    return withdrawalRequestAmountInShares * currentShareToAssetRate;
};

export const calculateShareToTicketAmountRate = (amount: number, shares: number): number => {
    return amount / shares;
};

export const calculateAmountToBurn = (
    withdrawalRequestAmountInShares: number,
    shareToTicketAmountRate: number,
): number => {
    return withdrawalRequestAmountInShares * shareToTicketAmountRate;
};

export const calculateRemainingAmount = (amount: number, amountRedeemed: number): number => {
    return amount - amountRedeemed;
};

export const sortDepositTickets = (depositTickets: DepositTicket[]): DepositTicket[] => {
    return depositTickets.sort((a, b) => b.remainingShares - a.remainingShares);
};

export const getDepositTicketsBurnInfo = (depositTickets: DepositTicket[], percentage: number) => {
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
