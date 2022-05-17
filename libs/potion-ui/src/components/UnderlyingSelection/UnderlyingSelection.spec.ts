import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UnderlyingSelection from "./UnderlyingSelection.vue";

describe("UnderlyingSelection", () => {
  it("compiles properly", () => {
    expect(UnderlyingSelection).toBeTruthy();
  });

  const wrapper = mount(UnderlyingSelection, {
    props: {
      underlyings: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          active: false,
        },
        {
          name: "Hello Vitest 2",
          address: "0xMOCKED2",
          symbol: "MOCKED2",
          image: "https://mocked.com/placeholder.png",
          active: true,
        },
      ],
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-underlying-selection");
    expect(wrapper.html()).toContain("test-underlying-card");
    expect(wrapper.html()).toContain("test-token-icon");
    expect(wrapper.text()).toContain("MOCKED");
    expect(wrapper.text()).toContain("MOCKED2");
  });

  it("emit events", async () => {
    await wrapper.get("[test-underlying-card]").trigger("click");
  });
});
