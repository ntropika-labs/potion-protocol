// @unocss-include

import { random as _random, times as _times } from "lodash-es";
import PerformanceChart from "./PerformanceChart.vue";

import type { Args, Story } from "@storybook/vue3";

const dayInSeconds = 24 * 60 * 60;

export default {
  component: PerformanceChart,
  excludeStories: /.*Data$/,
  title: "Potion UI/Charts/Performance",
  argTypes: {
    intraday: { control: "boolean" },
    showLiquidity: { control: "boolean" },
    showUtilization: { control: "boolean" },
    showPnl: { control: "boolean" },
    mode: {
      control: { type: "select", options: ["week", "month", "year", "all"] },
    },
    todayTimestamp: { control: "number" },
    numberOfPoints: { control: "number" },
    minPnl: { control: "number" },
    maxPnl: { control: "number" },
    minUtilization: { control: "number" },
    maxUtilization: { control: "number" },
    minLiquidity: { control: "number" },
    maxLiquidity: { control: "number" },
  },
};

const Template: Story<Args> = (args: Args) => ({
  components: { PerformanceChart },
  setup() {
    return {
      intraday: args.intraday,
      mode: args.mode,
      performanceData: _times(args.numberOfPoints, (n: number) => ({
        timestamp: args.todayTimestamp - n * dayInSeconds,
        liquidity: args.minLiquidity + _random(0, args.maxLiquidity),
        utilization: args.minUtilization + _random(0, args.maxUtilization),
        pnl: args.minPnl + _random(0, args.maxPnl),
      })),
      todayTimestamp: args.todayTimestamp,
      visibility: {
        liquidity: args.showLiquidity,
        utilization: args.showUtilization,
        pnl: args.showPnl,
      },
    };
  },
  template: `<div class="max-w-[64rem]">
    <PerformanceChart :intraday="intraday" :visibility="visibility" :mode="mode" :today-timestamp="todayTimestamp" :performance-data="performanceData" />
    </div>`,
});

export const interactable = Template.bind({});
interactable.args = {
  intraday: false,
  showLiquidity: true,
  showUtilization: true,
  showPnl: true,
  mode: "week",
  todayTimestamp: Math.ceil(Date.now() / 1000),
  numberOfPoints: 365,
  minPnl: -100,
  maxPnl: 100,
  minUtilization: 0,
  maxUtilization: 100,
  minLiquidity: 0,
  maxLiquidity: 1000,
};
