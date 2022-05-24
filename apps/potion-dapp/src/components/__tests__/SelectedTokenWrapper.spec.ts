import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import SelectedTokenWrapper from "../CustomPool/SelectedTokenWrapper.vue";

const price = 0;
const formattedPrice = `US$${price}`;

describe("SelectedTokenWrapper", () => {
  it("compiles properly", () => {
    expect(SelectedTokenWrapper).toBeTruthy();
  });

  const wrapper = mount(SelectedTokenWrapper, {
    props: {
      underlying: {
        name: "Hello Vitest",
        address: "0xMOCKED",
        symbol: "MOCKED",
        image: "https://mocked.com/placeholder.png",
        decimals: 18,
      },
      priceInfo: {
        loading: true,
        price: price,
        formattedPrice: formattedPrice,
        success: false,
      },
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-wrapper-card");
    expect(wrapper.html()).toContain("test-wrapper-icon");
    expect(wrapper.html()).toContain("test-wrapper-button");
    expect(wrapper.text()).toContain("MOCKED");
    expect(wrapper.text()).toContain("Loading..");
  });

  it("emits remove selection event", async () => {
    await wrapper.get("[test-wrapper-button]").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("removeSelection");
  });

  it("emits strike and duration events", async () => {
    await wrapper.get("[test-wrapper-strike]").trigger("input");
    expect(wrapper.emitted()).toHaveProperty("update:strikeDuration");

    await wrapper.get("[test-wrapper-duration]").trigger("input");
    expect(wrapper.emitted()).toHaveProperty("update:strikeDuration");
  });
});
