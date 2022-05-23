import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import SelectedTokenWrapper from "../SelectedTokenWrapper/SelectedTokenWrapper.vue";
import { ref, type Ref } from "vue";

const price = ref(0);
const formattedPrice = (price: Ref<number>): Ref<string> =>
  ref(`US$${price.value}`);

describe("SelectedTokenWrapper", () => {
  it("compiles properly", () => {
    expect(SelectedTokenWrapper).toBeTruthy();
  });

  const wrapper = mount(SelectedTokenWrapper, {
    props: {
      token: {
        name: "Hello Vitest",
        address: "0xMOCKED",
        symbol: "MOCKED",
        image: "https://mocked.com/placeholder.png",
        selected: false,
      },
      priceInfo: {
        loading: ref(true),
        price: price,
        formattedPrice: formattedPrice(price),
        success: ref(false),
      },
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-wrapper-card");
    expect(wrapper.html()).toContain("test-wrapper-icon");
    expect(wrapper.html()).toContain("test-wrapper-button");
    expect(wrapper.text()).toContain("MOCKED");
  });

  it("emits remove selection event", async () => {
    await wrapper.get("[test-wrapper-button]").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("removeSelection");
  });

  it("emits strike and duration events", async () => {
    await wrapper.get("[test-wrapper-strike]").trigger("input");
    expect(wrapper.emitted()).toHaveProperty("removeSelection");

    await wrapper.get("[test-wrapper-duration]").trigger("input");
    expect(wrapper.emitted()).toHaveProperty("removeSelection");
  });
});
