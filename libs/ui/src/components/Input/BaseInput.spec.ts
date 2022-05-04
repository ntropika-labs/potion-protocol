import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import BaseInput from "./BaseInput.vue";

describe("BaseInput", () => {
  it("compiles properly", () => {
    expect(BaseInput).toBeTruthy();
  });

  const wrapper = mount(BaseInput, {
    props: { modelValue: "test", inputType: "text", label: "Hello Vitest" },
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
    await wrapper.get("input").trigger("update:valid");
  });
});
