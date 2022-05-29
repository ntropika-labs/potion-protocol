import { afterEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import MinusPlusInput from "./MinusPlusInput.vue";

describe("MinusPlusInput", () => {
  it("compiles properly", () => {
    expect(MinusPlusInput).toBeTruthy();
  });

  const wrapper = mount(MinusPlusInput, {
    props: {
      label: "vitest",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  afterEach(() => {
    wrapper.setProps({
      label: "vitest",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    });
  });

  it("enables the plus button if props.max > props.modelValue + props.step", async () => {
    await wrapper.setProps({ modelValue: 99 });
    const button = wrapper.find("[test-unit='increase-button']");
    expect(wrapper.vm.canIncrease).toBe(true);
    expect(button.attributes("disabled")).toBe(undefined);
  });

  it("disables the plus button if props.max < props.modelValue + props.step", async () => {
    await wrapper.setProps({ modelValue: 100 });
    const button = wrapper.find("[test-unit='increase-button']");
    expect(wrapper.vm.canIncrease).toBe(false);
    expect(button.attributes("disabled")).toBe("");
  });

  it("enables the minus button if props.min < props.modelValue - props.step", async () => {
    await wrapper.setProps({ modelValue: 1 });
    const button = wrapper.find("[test-unit='decrease-button']");
    expect(wrapper.vm.canDecrease).toBe(true);
    expect(button.attributes("disabled")).toBe(undefined);
  });

  it("disables the minus button if props.min > props.modelValue - props.step", async () => {
    await wrapper.setProps({ modelValue: 0 });
    const button = wrapper.find("[test-unit='decrease-button']");
    expect(wrapper.vm.canDecrease).toBe(false);
    expect(button.attributes("disabled")).toBe("");
  });

  it("emits an event when inputting a value", async () => {
    const input = wrapper.find("[test-unit='input']");
    input.setValue("4");
    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
    expect(wrapper.emitted()).toHaveProperty("update:isValid");
  });
});
