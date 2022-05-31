<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "PoolTemplateCard",
});
</script>

<script lang="ts" setup>
import type { Token } from "dapp-types";
import BaseCard from "../BaseCard/BaseCard.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import LabelValue from "../LabelValue/LabelValue.vue";
import { useI18n } from "vue-i18n";
import BaseButton from "../BaseButton/BaseButton.vue";
import CreatorTag from "../CreatorTag/CreatorTag.vue";
import AssetTag from "../AssetTag/AssetTag.vue";

export interface Props {
  creator: {
    label: string;
    link: string;
    icon?: string;
  };
  tokens: Token[];
  totalSize: string;
  currencySymbol: string;
  timesCloned: string;
  totalPnl: string;
  templateId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "navigate-template", templateId: string): void;
}>();
const { t } = useI18n();

const tagText = computed(() => props.tokens.map((t) => t.symbol).join("+"));
</script>
<template>
  <BaseCard :full-height="false" class="text-dwhite-400 relative">
    <div
      class="grid grid-flow-row grid-cols-1 gap-6 p-6 transition-all hover:opacity-0 rounded-3xl"
    >
      <div
        class="grid grid-flow-row grid-cols-2 justify-between items-center gap-8"
      >
        <div>
          <BaseTag
            class="!justify-start !text-sm !rounded-lg p-2"
            :title="tagText"
          >
            <p class="truncate">{{ tagText }}</p>
          </BaseTag>
        </div>
        <CreatorTag
          class="text-right"
          :link="props.creator.link"
          :label="props.creator.label"
          :icon="props.creator.icon"
        />
      </div>

      <div class="grid grid-flow-row grid-cols-2 gap-2">
        <AssetTag :tokens="props.tokens" :title="t('assets')" />

        <LabelValue
          size="md"
          :title="t('total_size')"
          :value="props.totalSize"
          :symbol="props.currencySymbol"
        />
      </div>

      <div class="grid grid-flow-row grid-cols-2 gap-2">
        <LabelValue
          size="md"
          :title="t('cloned')"
          :value="props.timesCloned"
          :symbol="t('times')"
        />
        <LabelValue
          size="md"
          :title="t('pnl')"
          :value="props.totalPnl"
          value-type="pnl"
          symbol="%"
        />
      </div>
    </div>
    <div
      class="absolute inset-0 w-full h-full overflow-hidden transition-all opacity-0 rounded-3xl hover:opacity-100 bg-radial-primary"
    >
      <div
        class="absolute inset-0 flex flex-col justify-between w-full h-full p-6 rounded-3xl"
      >
        <div
          class="grid grid-flow-row grid-cols-2 justify-between items-center gap-8"
        >
          <div>
            <BaseTag
              class="!justify-start !text-sm !rounded-lg p-2"
              :title="tagText"
            >
              <p class="truncate">{{ tagText }}</p>
            </BaseTag>
          </div>
          <div class="text-right">
            <CreatorTag
              :link="props.creator.link"
              :label="props.creator.label"
              :icon="props.creator.icon"
            />
          </div>
        </div>
        <div class="text-dirty-white-300 font-medium text-center">
          {{ t("add_liquidity_hint") }}
        </div>
        <div class="flex w-full justify-center">
          <BaseButton
            test-card-navigate-button
            class="self-center bg-white hover:shadow-2xl text-deep-black-900"
            size="sm"
            :label="t('view_pool_recipe')"
            palette="flat"
            @click="emit('navigate-template', props.templateId)"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>
