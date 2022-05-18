// @unocss-include

import { HyperbolicCurve } from "contracts-math";
import { times as _times } from "lodash-es";
import BondingCurve from "./BondingCurve.vue";
import type { Args, Story } from "@storybook/vue3";

const curvePoints = 100;
const getCurvePoints = (curve: HyperbolicCurve) =>
  _times(curvePoints, (x: number) => curve.evalAt(x / curvePoints));

export default {
  component: BondingCurve,
  excludeStories: /.*Data$/,
  title: "Potion UI/Charts/Bonding Curve",
  argTypes: {
    aParam: { control: "number" },
    bParam: { control: "number" },
    cParam: { control: "number" },
    dParam: { control: "number" },
    maxUtilization: { control: "number" },
  },
};

const Template: Story<Args> = (args: Args) => ({
  components: { BondingCurve },
  setup() {
    return {
      bondingCurve: getCurvePoints(
        new HyperbolicCurve(
          args.aParam,
          args.bParam,
          args.cParam,
          args.dParam,
          args.maxUtilization
        )
      ).map((p: number) => p * 100),
      emergingCurves: [
        {
          data: getCurvePoints(new HyperbolicCurve(1.5, 2.5, 2.5, 2.5, 1)),
          underlyingSymbol: "WETH",
        },
        {
          data: getCurvePoints(new HyperbolicCurve(2.5, 1.5, 2.5, 2.5, 1)),
          underlyingSymbol: "UNI",
        },
        {
          data: getCurvePoints(new HyperbolicCurve(2.5, 2.5, 1.5, 2.5, 1)),
          underlyingSymbol: "AAVE",
        },
        {
          data: getCurvePoints(new HyperbolicCurve(2.5, 2.5, 2.5, 1.5, 1)),
          underlyingSymbol: "WBTC",
        },
      ],
    };
  },
  template: `<div class="max-w-[64rem]">
    <BondingCurve :bonding-curve="bondingCurve" :emerging-curves="emergingCurves" />
    </div>`,
});

export const interactable = Template.bind({});
interactable.args = {
  aParam: 2.5,
  bParam: 2.5,
  cParam: 2.5,
  dParam: 2.5,
  maxUtilization: 1,
};
