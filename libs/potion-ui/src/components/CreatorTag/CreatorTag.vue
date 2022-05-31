<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CreatorTag",
});
</script>
<script lang="ts" setup>
import { getEnsOrAddress } from "../../helpers";
import { useI18n } from "vue-i18n";
import BaseTag from "../BaseTag/BaseTag.vue";

export interface Props {
  icon?: string;
  link: string;
  label: string;
  withLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  withLabel: false,
});
const { t } = useI18n();
</script>
<template>
  <div>
    <h5 v-if="props.withLabel" class="mb-2 text-lg font-medium">
      {{ t("creator") }}
    </h5>
    <BaseTag class="rounded-full gap-1">
      <img v-if="props.icon" :src="props.icon" class="w-3 h-3" />
      <i v-else class="i-ph-user-fill w-3 h-3"></i>
      <a :href="props.link" target="_blank">{{
        getEnsOrAddress(props.label)
      }}</a>
    </BaseTag>
  </div>
</template>
