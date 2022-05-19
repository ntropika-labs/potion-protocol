// @unocss-include

import MinusPlusButton from "./MinusPlusButton.vue";

export default {
  component: MinusPlusButton,
  excludeStories: /.*Data$/,
  title: "Potion UI/Minus Plus/Button",
};

export const Overview = () => ({
  components: { MinusPlusButton },
  setup() {
    return {};
  },
  template: `
    <div class="grid grid-cols-3 gap-4 text-white w-40">
      <span>Minus</span>
      <span>
        <MinusPlusButton direction="decrease" />
      </span>
      <span>
        <MinusPlusButton direction="decrease" :enabled="false" />
      </span>
      <span>Plus</span>
      <span>
        <MinusPlusButton direction="increase" />
      </span>
      <span>
        <MinusPlusButton direction="increase" :enabled="false" />
      </span>
    </div>`,
});
