import { afterEach, describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";

import BaseInput from "./BaseInput.vue";

describe("BaseInput", () => {
  it("compiles properly", () => {
    expect(BaseInput).toBeTruthy();
  });

  const wrapper = mount(BaseInput, {
    props: {
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  afterEach(() => {
    wrapper.setProps({
      modelValue: 0,
      min: 0,
      max: 100,
      step: 1,
    });
  });

  it("emits an event when inputting a value", () => {
    const input = wrapper.find("input");
    input.trigger("input");
    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
  });
});
