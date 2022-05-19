import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UnderlyingRecap from "./UnderlyingRecap.vue";

describe("UnderlyingRecap", () => {
  it("compiles properly", () => {
    expect(wrapper.vm.t).toBeTruthy();
    expect(UnderlyingRecap).toBeTruthy();
  });

  const wrapper = mount(UnderlyingRecap, {
    props: {
      underlyings: [],
    },
  });

  it("renders properly when empty", async () => {
    await wrapper.setProps({ underlyings: [] });
    expect(wrapper.html()).toContain("test-underlying-recap-empty");
  });

  it("renders properly with one token", async () => {
    await wrapper.setProps({
      underlyings: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          selected: false,
          strike: 100,
          duration: 30,
        },
      ],
    });
    expect(wrapper.html()).toContain("test-underlying-recap-header");
    expect(wrapper.html()).toContain("test-underlying-recap-container");
    expect(wrapper.html()).toContain("test-underlying-recap-row");
    expect(wrapper.html()).toContain("test-token-icon");
  });

  it("renders properly with multiple tokens", async () => {
    await wrapper.setProps({
      underlyings: [
        {
          name: "Hello Vitest",
          address: "0xMOCKED",
          symbol: "MOCKED",
          image: "https://mocked.com/placeholder.png",
          selected: false,
          strike: 100,
          duration: 30,
        },
        {
          name: "Hello Vitest 2",
          address: "0xMOCKED2",
          symbol: "MOCKED2",
          image: "https://mocked.com/placeholder.png",
          selected: true,
          strike: 200,
          duration: 30,
        },
      ],
    });
    expect(wrapper.html()).toContain("test-underlying-recap-header");
    expect(wrapper.html()).toContain("test-underlying-recap-container");
    expect(wrapper.html()).toContain("test-underlying-recap-row");
    expect(wrapper.html()).toContain("test-token-icon");
  });
});
