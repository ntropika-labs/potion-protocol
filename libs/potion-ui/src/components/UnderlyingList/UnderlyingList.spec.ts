import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import UnderlyingList from "./UnderlyingList.vue";

describe("UnderlyingList", () => {
  it("compiles properly", () => {
    expect(UnderlyingList).toBeTruthy();
  });

  const wrapper = mount(UnderlyingList, {
    props: {
      assetsFlat: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          id: "1",
          isPut: false,
          duration: "101",
          strike: "46",
        },
        {
          name: "Hello Vitest 2",
          address: "0xMOCKED2",
          symbol: "MOCKED2",
          image: "https://mocked.com/placeholder.png",
          id: "2",
          isPut: false,
          duration: "102",
          strike: "47",
        },
      ],
      priceMap: new Map([
        ["0xMOCKED", "1001"],
        ["0xMOCKED2", "1002"],
      ]),
      stableCoinCollateral: "COLLATERAL",
    },
  });

  it("renders properly", () => {
    console.log(wrapper.text());
    expect(wrapper.text()).toContain("COLLATERAL");

    expect(wrapper.text()).toContain("MOCKED");
    expect(wrapper.text()).toContain("1.001K");
    expect(wrapper.text()).toContain("101");
    expect(wrapper.text()).toContain("46");

    expect(wrapper.text()).toContain("MOCKED2");
    expect(wrapper.text()).toContain("1.002K");
    expect(wrapper.text()).toContain("102");
    expect(wrapper.text()).toContain("47");
  });
});
