import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import JumboHeader from "./JumboHeader.vue";
import { SrcsetEnum } from "dapp-types";

const testSlot = `<a href="https://test.test" target="_blank">Testing the slot</a>`;
const defaultIconSet = new Map([
  [SrcsetEnum["AVIF"], "/icons/atom.avif"],
  [SrcsetEnum["WEBP"], "/icons/atom.webp"],
  [SrcsetEnum["PNG"], "/icons/atom.png"],
]);

describe("JumboHeader", () => {
  it("compiles properly", () => {
    expect(JumboHeader).toBeTruthy();
  });

  const wrapper = mount(JumboHeader, {
    props: {
      title: "Hello Vitest",
      subtitle: "Second hello vitest",
      ctaLabel: "CTA LABEL",
      iconSrcset: defaultIconSet,
    },
    slots: {
      default: testSlot,
    },
  });

  it("renders properly", () => {
    expect(wrapper.text()).toContain("Hello Vitest");
    expect(wrapper.text()).toContain("Second hello vitest");
    expect(wrapper.text()).toContain("CTA LABEL");
    expect(wrapper.text()).toContain("Testing the slot");

    expect(wrapper.html()).toContain("test-card-cta");
    expect(wrapper.html()).toContain("/icons/atom.png");
  });

  it("renders slots properly", () => {
    expect(wrapper.html()).toContain(testSlot);
  });

  it("emit events", async () => {
    await wrapper.get("[test-card-cta]").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
