import { MockOtoken } from "../../typechain";

export class OtokenPropertiesForValidation {
    constructor(
        public percentStrikeValue: number,
        public wholeDaysRemaining: number,
        public underlyingAsset: string,
        public strikeAsset: string,
        public isPut = true,
    ) {}

    public static async fromOtokenAssets(
        otoken: MockOtoken,
        percentStrikeValue: number,
        wholeDaysRemaining: number,
    ): Promise<OtokenPropertiesForValidation> {
        return new OtokenPropertiesForValidation(
            percentStrikeValue,
            wholeDaysRemaining,
            await otoken.underlyingAsset(),
            await otoken.strikeAsset(),
            await otoken.isPut(),
        );
    }
}
