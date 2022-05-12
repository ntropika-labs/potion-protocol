import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import BaseCheckbox from "./BaseCheckbox.vue";

describe("BaseCheckbox", () => {
  it("compiles properly", () => {
    expect(BaseCheckbox).toBeTruthy();
  });

  const wrapper = mount(BaseCheckbox, {
    props: { modelValue: false, label: "Hello Vitest" },
  });

  it("renders properly", () => {
    expect(wrapper.text()).toContain("Hello Vitest");
  });

  it("emit events", async () => {
    await wrapper.get("input").trigger("click");
    await wrapper.get("input").trigger("hover");
    await wrapper.get("input").trigger("focusin");
    await wrapper.get("input").trigger("focusout");
    await wrapper.get("input").trigger("input");
    await wrapper.get("input").trigger("update:modelValue");
  });
});
