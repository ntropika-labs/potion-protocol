import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UnderlyingCard from "./UnderlyingCard.vue";

describe("UnderlyingCard", () => {
  it("compiles properly", () => {
    expect(UnderlyingCard).toBeTruthy();
  });

  const wrapper = mount(UnderlyingCard, {
    props: {
      name: "Hello Vitest",
      address: "0xMOCKED",
      symbol: "MOCKED",
      image: "https://mocked.com/placeholder.png",
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-underlying-card");
    expect(wrapper.html()).toContain("test-token-icon");
    expect(wrapper.text()).toContain("MOCKED");
  });

  it("emit events", async () => {
    await wrapper.get("[test-underlying-card]").trigger("click");
  });
});
