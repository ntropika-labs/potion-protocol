<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  AssetActiveIcon,
  AssetDefaultIcon,
  DurationActiveIcon,
  DurationDefaultIcon,
  ReviewActiveIcon,
  ReviewDefaultIcon,
  SidebarLink,
  StrikeActiveIcon,
  StrikeDefaultIcon,
} from "potion-ui";
import { CustomPotionStep } from "dapp-types";

interface Props {
  currentStep: CustomPotionStep;
  isTokenSelected: boolean;
  isStrikeValid: boolean;
  isDurationValid: boolean;
  tokenImage: string;
  tokenSymbol: string;
  strikeSelected: number;
  durationSelected: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:currentStep", value: CustomPotionStep): void;
}>();

const { t } = useI18n();

const sidebarItems = computed(() => {
  return [
    {
      title: t("asset"),
      iconSrcset:
        props.currentStep === CustomPotionStep.ASSET
          ? AssetActiveIcon
          : AssetDefaultIcon,
      selected: props.currentStep === CustomPotionStep.ASSET,
      disabled: false,
      onClick: () => emits("update:currentStep", CustomPotionStep.ASSET),
    },
    {
      title: t("strike_price"),
      iconSrcset:
        props.currentStep === CustomPotionStep.STRIKE
          ? StrikeActiveIcon
          : StrikeDefaultIcon,
      selected: props.currentStep === CustomPotionStep.STRIKE,
      disabled: !props.isTokenSelected,
      onClick: () => emits("update:currentStep", CustomPotionStep.STRIKE),
    },
    {
      title: t("expiration"),
      iconSrcset:
        props.currentStep === CustomPotionStep.EXPIRATION
          ? DurationActiveIcon
          : DurationDefaultIcon,
      selected: props.currentStep === CustomPotionStep.EXPIRATION,
      disabled: !props.isTokenSelected || !props.isStrikeValid,
      onClick: () => emits("update:currentStep", CustomPotionStep.EXPIRATION),
    },
    {
      title: t("review_and_create"),
      iconSrcset:
        props.currentStep === CustomPotionStep.REVIEW
          ? ReviewActiveIcon
          : ReviewDefaultIcon,
      selected: props.currentStep === CustomPotionStep.REVIEW,
      disabled: !(
        props.isTokenSelected &&
        props.isStrikeValid &&
        props.isDurationValid
      ),
      onClick: () => emits("update:currentStep", CustomPotionStep.REVIEW),
    },
  ];
});
</script>

<template>
  <ul
    class="grid grid-cols-1 lg:( grid-cols-4 ) gap-3 w-full xl:( grid-cols-1 ) self-start items-start justify-center"
  >
    <SidebarLink
      v-for="(item, index) in sidebarItems"
      :key="`sidebar-item-${index}`"
      :title="item.title"
      :selected="item.selected"
      :disabled="item.disabled"
      :icon-srcset="item.iconSrcset"
      class="lg:w-1/4 lg:w-full"
      @click="item.onClick"
    >
      <div
        v-if="index === CustomPotionStep.ASSET && props.isTokenSelected"
        class="flex gap-2 items-center"
      >
        <img class="h-5 w-5" :src="props.tokenImage" :alt="props.tokenSymbol" />
        <p class="text-xs">{{ props.tokenSymbol }}</p>
      </div>
      <div v-if="index === CustomPotionStep.STRIKE && props.strikeSelected">
        <p class="text-xs">USDC {{ props.strikeSelected }}</p>
      </div>
      <div
        v-if="index === CustomPotionStep.EXPIRATION && props.durationSelected"
      >
        <p class="text-xs">
          {{ props.isDurationValid ? props.durationSelected : "" }}
        </p>
      </div>
    </SidebarLink>
  </ul>
</template>
