import { afterEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import InputSlider from "./InputSlider.vue";

describe("InputSlider", () => {
  it("compiles properly", () => {
    expect(InputSlider).toBeTruthy();
  });

  const wrapper = mount(InputSlider, {
    props: {
      symbol: "%",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  afterEach(() => {
    wrapper.setProps({
      symbol: "%",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    });
  });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("test-slider-input");
    expect(wrapper.html()).toContain("test-slider-thumb");
    expect(wrapper.html()).toContain("test-slider-progress");
  });

  it("updates thumb text and position", async () => {
    await wrapper.setProps({ modelValue: 50 });

    expect(wrapper.vm.valuePercentage).toBe(wrapper.props().modelValue);

    // expect(wrapper.vm.thumbPosition).toBeGreaterThan(1);
  });

  it("constrains the value if not valid", async () => {
    await wrapper.setProps({ modelValue: 101 });

    expect(wrapper.vm.valuePercentage).toBe(wrapper.props().max);
    await wrapper.get("[test-slider-input]").trigger("input");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue", [
      [wrapper.props().max],
    ]);

    await wrapper.setProps({ modelValue: -101 });
    expect(wrapper.vm.valuePercentage).toBe(wrapper.props().min);

    await wrapper.get("[test-slider-input]").trigger("input");
    expect(wrapper.emitted()).toHaveProperty("update:modelValue", [
      [wrapper.props().max],
      [wrapper.props().min],
    ]);
  });

  it("emits an event when inputting a value", async () => {
    await wrapper.get("[test-slider-input]").trigger("input");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });

  it("updates the value when dragging the thumb", async () => {
    await wrapper.get("[test-slider-thumb]").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });
});
