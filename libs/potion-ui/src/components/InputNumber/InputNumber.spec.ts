import { afterEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import { currencyFormatter } from "../../helpers";
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
      footerDescription: "Balance",
    },
  });

  afterEach(() => {
    wrapper.setProps({
      title: "awesome input",
      unit: "usdc",
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      footerDescription: "Balance",
    });
  });

  it("renders the footer text properly", () => {
    expect(wrapper.vm.footerText).toBe(
      `${wrapper.props().footerDescription}: ${currencyFormatter(
        wrapper.props().max,
        wrapper.props().unit
      )}`
    );
  });

  it("renders an error if the value is not valid", async () => {
    await wrapper.setProps({ modelValue: 101 });
    expect(wrapper.vm.footerText).toBe(
      `Please, enter a valid value - Your ${
        wrapper.props().footerDescription
      } is ${currencyFormatter(
        wrapper.props().max,
        wrapper.props().unit
      )} - Minimum is ${currencyFormatter(
        wrapper.props().min,
        wrapper.props().unit
      )}.`
    );
  });

  it("shows an error if the input is major than props.max", async () => {
    await wrapper.setProps({ modelValue: 101 });
    expect(wrapper.vm.inputIsValid).toBe(false);
  });

  it("shows an error if the input is minor than props.min", async () => {
    await wrapper.setProps({ modelValue: -1 });
    expect(wrapper.vm.inputIsValid).toBe(false);
  });

  it("emits an event when inputting a value", async () => {
    const input = await wrapper.find("input");
    await input.setValue("10");
    const event = wrapper.emitted()["update:modelValue"];
    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
    expect(event[event.length - 1][0]).toBe(10);
  });

  it("emits an event when clicking the button, passing the max value", async () => {
    const button = await wrapper.find("button");
    button.trigger("click");
    const emitted = wrapper.emitted();
    const emittedModelValue = emitted["update:modelValue"];
    const lastEmittedValue = emittedModelValue[emittedModelValue.length - 1][0];
    expect(lastEmittedValue).toBe(wrapper.props().max);
  });
});
