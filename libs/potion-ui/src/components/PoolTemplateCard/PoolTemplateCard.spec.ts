import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import PoolTemplateCard from "./PoolTemplateCard.vue";
import { shortDigitFormatter } from "../../helpers";

const tokens = [
  {
    name: "Hello Vitest",
    address: "0xMOCKED",
    symbol: "MOCKED",
    image: "https://mocked.com/placeholder.png",
    selected: false,
  },
  {
    name: "Hello Vitest 2",
    address: "0xMOCKED2",
    symbol: "MOCKED2",
    image: "https://mocked.com/placeholder.png",
    selected: true,
  },
];

describe("PoolTemplateCard", () => {
  it("compiles properly", () => {
    expect(PoolTemplateCard).toBeTruthy();
  });

  const props = {
    creator: {
      label: "0xd34d...b33f",
      link: "/link-to-creator",
    },
    tokens: tokens,
    totalSize: "599000000",
    currencySymbol: "USDC",
    timesCloned: "10",
    totalPnl: "60",
    pnlTrend: "up",
    templateId: "1337",
  };

  const wrapper = mount(PoolTemplateCard, {
    props: props,
  });

  it("renders properly", () => {
    expect(wrapper.text()).toContain(props.creator.label);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];

      expect(wrapper.text()).toContain(t.symbol);
    }

    expect(wrapper.text()).toContain(
      shortDigitFormatter(parseFloat(props.totalSize))
    );
    expect(wrapper.text()).toContain(props.currencySymbol);
    expect(wrapper.text()).toContain(props.timesCloned);
    expect(wrapper.text()).toContain(props.totalPnl);

    expect(wrapper.html()).toContain(props.creator.link);
  });

  it("emit events", async () => {
    await wrapper.get("[test-card-navigate-button]").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("navigate-template", [
      [props.templateId],
    ]);
  });
});
