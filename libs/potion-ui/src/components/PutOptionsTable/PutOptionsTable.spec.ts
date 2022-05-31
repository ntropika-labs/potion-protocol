import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import PutOptionsTable from "./PutOptionsTable.vue";

const headings = ["Column1", "Column2", "Column3", "Column4"];
const dataset = [
  [
    { value: "Value1" },
    { value: 7 },
    { value: "Value3" },
    { button: true, color: "primary", label: "claim", claimable: true },
  ],
  [
    { value: "Value2" },
    { value: 14 },
    { value: "Value7" },
    { button: true, color: "primary", label: "claim", claimable: false },
  ],
  [
    { value: "Value2" },
    { value: 21 },
    { value: "Value8" },
    { button: true, color: "primary", label: "claim", claimable: false },
  ],
  [
    { value: "Value4" },
    { value: 28 },
    { value: "Value9" },
    { button: true, color: "primary", label: "claim", claimable: true },
  ],
];

describe("PutOptionsTable", () => {
  it("compiles properly", () => {
    expect(PutOptionsTable).toBeTruthy();
  });

  const props = {
    headings,
    dataset,
  };

  const wrapper = mount(PutOptionsTable, {
    props: props,
  });

  it("renders properly", () => {
    for (let i = 0; i < headings.length; i++) {
      expect(wrapper.text()).toContain(headings[i]);
    }

    for (let i = 0; i < dataset.length; i++) {
      const row = dataset[i];

      const tableRow = wrapper.find(`tbody tr:nth-of-type(${i + 1})`);

      for (let j = 0; j < row.length; j++) {
        const data = row[j];

        const tableRowColumn = tableRow.find(`td:nth-of-type(${j + 1})`);

        if (data.value) {
          expect(tableRowColumn.text()).toContain(data.value);
        } else if (data.button) {
          expect(tableRowColumn.html()).toContain("button");

          const tableRowButton = tableRowColumn.find("button");

          if (!data.claimable) {
            expect(tableRowButton.attributes().disabled).toBeDefined();
          }
        }
      }
    }
  });

  it("emit events", async () => {
    await wrapper.get("[test-table-claim-button]").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("button-pressed");
  });
});
