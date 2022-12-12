import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import TokenSelection from "./TokenSelection.vue";

describe("Empty TokenSelection", () => {
  it("compiles properly", () => {
    expect(TokenSelection).toBeTruthy();
  });

  const wrapper = mount(TokenSelection, {
    props: {
      tokens: [],
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-token-selection");
  });
});

describe("TokenSelection", () => {
  it("compiles properly", () => {
    expect(TokenSelection).toBeTruthy();
  });

  const wrapper = mount(TokenSelection, {
    props: {
      tokens: [
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
      ],
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-token-selection");
    expect(wrapper.html()).toContain("test-token-card");
    expect(wrapper.html()).toContain("test-token-icon");
    expect(wrapper.text()).toContain("MOCKED");
    expect(wrapper.text()).toContain("MOCKED2");
  });

  it("emit events", async () => {
    await wrapper.get("[test-token-card]").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("token-selected");
    expect(wrapper.emitted()).toHaveProperty("token-selected", [["0xMOCKED"]]);
  });
});
