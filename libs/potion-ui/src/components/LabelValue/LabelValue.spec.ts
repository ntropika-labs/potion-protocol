import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import LabelValue from "./LabelValue.vue";
import { shortDigitFormatter } from "../../helpers";

describe("LabelValue", () => {
  it("compiles properly", () => {
    expect(LabelValue).toBeTruthy();
  });

  const props = {
    value: "1000000",
    title: "Test title",
    symbol: "%",
    valueType: "number",
  };

  const wrapper = mount(LabelValue, {
    props: props,
  });

  it("renders properly", () => {
    expect(wrapper.text()).toContain(
      shortDigitFormatter(parseFloat(props.value))
    );
    expect(wrapper.text()).toContain(props.title);
    expect(wrapper.text()).toContain(props.symbol);
  });
});
