import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import UnderlyingSelectionWrapper from "./SelectedUnderlyingWrapper.vue";

describe("UnderlyingSelectionWrapper", () => {
  it("compiles properly", () => {
    expect(UnderlyingSelectionWrapper).toBeTruthy();
  });

  const wrapper = mount(UnderlyingSelectionWrapper, {
    props: {
      assetSymbol: "POTION",
      assetImage: "https://mocked.com/placeholder.png",
    },
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-wrapper-card");
    expect(wrapper.html()).toContain("test-wrapper-icon");
    expect(wrapper.html()).toContain("test-wrapper-button");
    expect(wrapper.text()).toContain("POTION");
  });

  it("emit events", async () => {
    await wrapper.get("[test-wrapper-button]").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("removeSelection");
  });
});
