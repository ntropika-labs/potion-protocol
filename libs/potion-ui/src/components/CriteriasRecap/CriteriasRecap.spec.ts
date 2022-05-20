import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import CriteriasRecap from "./CriteriasRecap.vue";

describe("CriteriasRecap", () => {
  it("compiles properly", () => {
    expect(CriteriasRecap).toBeTruthy();
  });

  const wrapper = mount(CriteriasRecap, {
    props: {
      criterias: [],
    },
  });

  it("renders properly when empty", async () => {
    await wrapper.setProps({ criterias: [] });
    expect(wrapper.html()).toContain("test-criterias-recap-empty");
  });

  it("renders properly with one token", async () => {
    await wrapper.setProps({
      criterias: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          selected: false,
          maxStrike: 100,
          maxDuration: 30,
        },
      ],
    });
    expect(wrapper.html()).toContain("test-criterias-recap-header");
    expect(wrapper.html()).toContain("test-criterias-recap-container");
    expect(wrapper.html()).toContain("test-criterias-recap-row");
    expect(wrapper.html()).toContain("test-token-icon");
  });

  it("renders properly with multiple tokens", async () => {
    await wrapper.setProps({
      criterias: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          selected: false,
          maxStrike: 100,
          maxDuration: 30,
        },
        {
          name: "Hello Vitest 2",
          address: "0xMOCKED2",
          symbol: "MOCKED2",
          image: "https://mocked.com/placeholder.png",
          selected: true,
          maxStrike: 200,
          maxDuration: 30,
        },
      ],
    });
    expect(wrapper.html()).toContain("test-criterias-recap-header");
    expect(wrapper.html()).toContain("test-criterias-recap-container");
    expect(wrapper.html()).toContain("test-criterias-recap-row");
    expect(wrapper.html()).toContain("test-token-icon");
  });
});
