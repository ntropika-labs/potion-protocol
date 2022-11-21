import { describe, expect, it } from "vitest";
import * as exchangeInputForOutput from "../src/exchangeInputForOutput";

describe("exchangeInputForOutput", () => {
    const depositTickets = [
        {
            id: 1,
            amount: 100,
            amountRedeemed: 50,
            shares: 100,
            sharesRemaining: 50,
        },
        {
            id: 2,
            amount: 10,
            amountRedeemed: 0,
            shares: 50,
            sharesRemaining: 13,
        },
        {
            id: 3,
            amount: 15,
            amountRedeemed: 0,
            shares: 35,
            sharesRemaining: 35,
        },
    ];

    it("calculates the remaining shares correctly", () => {
        expect(exchangeInputForOutput.calculateTotalRemainingShares(depositTickets)).toBe(98);
    });

    it("calculates the correct withdrawal request amount in shares", () => {
        const totalRemainingShares = exchangeInputForOutput.calculateTotalRemainingShares(depositTickets);
        const withdrawalTicketAmountInShares = exchangeInputForOutput.calculateWithdrawalTicketAmountInShares(
            totalRemainingShares,
            50,
        );
        expect(withdrawalTicketAmountInShares).toBe(49);
    });

    it("calculates the correct withdrawal request amount in underlyings", () => {
        const totalRemainingShares = exchangeInputForOutput.calculateTotalRemainingShares(depositTickets);
        const withdrawalTicketAmountInUnderlyings = exchangeInputForOutput.calculateWithdrawalTicketAmountInUnderlyings(
            totalRemainingShares,
            50,
            1.5,
        );
        expect(withdrawalTicketAmountInUnderlyings).toBe(73.5);
    });

    it("calculates the correct share to ticket amount rate", () => {
        const shareToTicketAmountRate = exchangeInputForOutput.calculateShareToTicketAmountRate(100, 100);
        expect(shareToTicketAmountRate).toBe(1);
    });

    it("calculates the correct amount to burn", () => {
        const amountToBurn = exchangeInputForOutput.calculateAmountToBurn(100, 0.5);
        expect(amountToBurn).toBe(50);
    });

    it("calculates the correct remaining amount", () => {
        const remainingAmount = exchangeInputForOutput.calculateRemainingAmount(100, 50);
        expect(remainingAmount).toBe(50);
    });

    it("sorts the deposit tickets correctly", () => {
        const sortedDepositTickets = exchangeInputForOutput.sortDepositTickets(depositTickets);
        expect(sortedDepositTickets).toEqual([
            {
                id: 1,
                amount: 100,
                amountRedeemed: 50,
                shares: 100,
                sharesRemaining: 50,
            },
            {
                id: 3,
                amount: 15,
                amountRedeemed: 0,
                shares: 35,
                sharesRemaining: 35,
            },
            {
                id: 2,
                amount: 10,
                amountRedeemed: 0,
                shares: 50,
                sharesRemaining: 13,
            },
        ]);
    });

    it("gets the deposit tickets burn info correctly", () => {
        const burnInfo = exchangeInputForOutput.getDepositTicketsBurnInfo(depositTickets, 50);
        expect(burnInfo).toEqual({
            ids: [1],
            amounts: [49],
        });

        const burnInfo2 = exchangeInputForOutput.getDepositTicketsBurnInfo(depositTickets, 100);
        expect(burnInfo2).toEqual({
            ids: [1, 3, 2],
            amounts: [50, 15, 10],
        });
    });
});
