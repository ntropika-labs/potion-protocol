// @unocss-include

import CurveFormula from "./CurveFormula.vue";

export default {
  component: CurveFormula,
  excludeStories: /.*Data$/,
  title: "Potion UI/Curve Formula",
};

export const Overview = () => ({
  components: { CurveFormula },
  setup() {
    return {};
  },
  template: `<CurveFormula />`,
});
