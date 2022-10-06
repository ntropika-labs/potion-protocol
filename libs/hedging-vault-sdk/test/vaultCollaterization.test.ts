import { describe, expect, it } from "vitest";
import { calculateOrderSize } from "../src/vaultCollateralization";
import { toSolidityPercentage } from "../src/percentageUtils";
import { parseUnits } from "ethers/lib/utils";

describe.only("vault collaterization", () => {
    it("calculate order size number", () => {
        expect(calculateOrderSize(1000, 18, 90.0, 100.0, 500, 100.0)).toBe(762.7118644067797);
        expect(calculateOrderSize(1035.98, 18, 90.5, 80.0, 590, 120.55)).toBe(951.9250780096808);

        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        expect(calculateOrderSize(33.8978, 6, 75.89, 45.89, 15894.987, 458.899)).toBe(53.503551974513112);
    });
    it("calculate order size string", () => {
        expect(calculateOrderSize("1000", 18, "90.0", "100.0", "500", "100.0")).toBe(762.7118644067797);
        expect(calculateOrderSize("1035.98", 18, "90.5", "80.0", "590", "120.55")).toBe(951.9250780096808);

        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        expect(calculateOrderSize("33.8978", 6, "75.89", "45.89", "15894.987", "458.899")).toBe(53.503551974513112);
    });
    it("calculate order size bignumber", () => {
        expect(
            calculateOrderSize(
                parseUnits("1000", 18),
                18,
                toSolidityPercentage(90),
                toSolidityPercentage(100),
                parseUnits("500", 6),
                parseUnits("100", 6),
            ),
        ).toBe(762.7118644067797);
        expect(
            calculateOrderSize(
                parseUnits("1035.98", 18),
                18,
                toSolidityPercentage(90.5),
                toSolidityPercentage(80.0),
                parseUnits("590", 6),
                parseUnits("120.55", 6),
            ),
        ).toBe(951.9250780096808);

        expect(
            calculateOrderSize(
                parseUnits("33.8978", 6),
                6,
                toSolidityPercentage(75.89),
                toSolidityPercentage(45.89),
                parseUnits("15894.987", 6),
                parseUnits("458.899", 6),
            ),
        ).toBe(53.503551974513112); // eslint-disable-line @typescript-eslint/no-loss-of-precision
    });
});
