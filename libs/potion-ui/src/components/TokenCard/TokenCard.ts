import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import TokenCard from "./TokenCard.vue";

describe("TokenCard", () => {
  it("compiles properly", () => {
    expect(TokenCard).toBeTruthy();
  });

  const wrapper = mount(TokenCard, {
    props: {
      name: "Hello Vitest",
      address: "0xMOCKED",
      symbol: "MOCKED",
      image: "https://mocked.com/placeholder.png",
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-token-card");
    expect(wrapper.html()).toContain("test-token-icon");
    expect(wrapper.text()).toContain("MOCKED");
  });

  it("emit events", async () => {
    await wrapper.get("[test-token-card]").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("token-selected");
  });
});
