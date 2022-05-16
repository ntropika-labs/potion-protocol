import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import TokenIcon from "./TokenIcon.vue";

describe("TokenIcon", () => {
  it("compiles properly", () => {
    expect(TokenIcon).toBeTruthy();
  });

  const wrapper = mount(TokenIcon, { props: { name: "Hello Vitest" } });

  it("renders properly", () => {
    expect(wrapper.html()).toContain("img");
  });
});
