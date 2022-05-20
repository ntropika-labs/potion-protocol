// @unocss-include

import { HyperbolicCurve } from "contracts-math";
import { random as _random, times as _times } from "lodash-es";
import { getTokenList } from "potion-tokenlist";

import BondingCurve from "./BondingCurve.vue";

import type { Args, Story } from "@storybook/vue3";

const tokenList = getTokenList("ganache");
const curvePoints = 100;
const getCurvePoints = (curve: HyperbolicCurve) =>
  _times(curvePoints, (x: number) => curve.evalAt(x / curvePoints));

export default {
  component: BondingCurve,
  excludeStories: /.*Data$/,
  title: "Potion UI/Charts/Bonding Curve",
  argTypes: {
    aParam: { control: { type: "number", min: 0, max: 10, step: 0.01 } },
    bParam: { control: { type: "number", min: 0, max: 10, step: 0.01 } },
    cParam: { control: { type: "number", min: 0, max: 10, step: 0.01 } },
    dParam: { control: { type: "number", min: 0, max: 10, step: 0.01 } },
    maxUtilization: { control: { type: "number", min: 0, max: 1, step: 0.01 } },
  },
};

const Template: Story<Args> = (args: Args) => ({
  components: { BondingCurve },
  setup() {
    const getRandomCurve = () =>
      new HyperbolicCurve(
        _random(args.aParam * 0.5, args.aParam * 1.5, true),
        _random(args.bParam * 0.5, args.bParam * 1.5, true),
        _random(args.cParam * 0.5, args.cParam * 1.5, true),
        _random(args.dParam * 0.5, args.dParam * 1.5, true),
        _random(0, 1, true)
      );

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
      emergingCurves: tokenList.map(({ symbol }) => ({
        data: getCurvePoints(getRandomCurve()),
        tokenSymbol: symbol,
      })),
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
