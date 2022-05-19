// @unocss-include

import CustomCurveParams from "./CustomCurveParams.vue";
import { reactive } from "vue";

export default {
  component: CustomCurveParams,
  excludeStories: /.*Data$/,
  title: "Potion UI/Curve Params/Custom",
};

export const Overview = () => ({
  components: { CustomCurveParams },
  setup() {
    return {
      state: reactive({
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        maxUtil: 1,
      }),
    };
  },
  template: `<CustomCurveParams class="w-60" v-model:a="state.a" v-model:b="state.b" v-model:c="state.c" v-model:d="state.d" v-model:maxUtil="state.maxUtil" />`,
});
