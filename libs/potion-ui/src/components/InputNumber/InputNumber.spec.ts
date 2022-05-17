import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import InputNumber from "./InputNumber.vue";

describe("InputNumber", () => {
  it("compiles properly", () => {
    expect(InputNumber).toBeTruthy();
  });

  const wrapper = mount(InputNumber, {
    props: {
      title: "awesome input",
      unit: "usdc",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      footerDescription: "Balance:",
    },
  });
  it("renders the footer text properly", () => {
    expect(wrapper.vm.footerText).toBe("Balance: 100 usdc");
  });

  it("shows an error if the input is major than props.max", async () => {
    await wrapper.setProps({ modelValue: 101 });
    expect(wrapper.vm.inputIsValid).toBe(false);
  });
  it("shows an error if the input is minor than props.min", async () => {
    await wrapper.setProps({ modelValue: -1 });
    expect(wrapper.vm.inputIsValid).toBe(false);
  });
  it("shows an error if the input is not a number", async () => {
    await wrapper.setProps({ modelValue: "101" });
    expect(wrapper.vm.inputIsValid).toBe(false);
    await wrapper.setProps({ modelValue: null });
    expect(wrapper.vm.inputIsValid).toBe(false);
  });
  // it("emits an event when inputting a value", () => {
  //   wrapper.find("input").trigger("change");
  //   expect(wrapper.emitted()).toHaveProperty("update");
  // });
});
