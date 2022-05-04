import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import BaseButton from "./BaseButton.vue";

describe("BaseButton", () => {
  it("compiles properly", () => {
    expect(BaseButton).toBeTruthy();
  });

  const wrapper = mount(BaseButton, { props: { label: "Hello Vitest" } });

  it("renders properly", () => {
    expect(wrapper.text()).toContain("Hello Vitest");
  });

  it("emit events", async () => {
    await wrapper.get("button").trigger("click");
    await wrapper.get("button").trigger("hover");
  });
});
