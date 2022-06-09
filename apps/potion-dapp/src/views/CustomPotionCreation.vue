<script lang="ts" setup>
import { TokenSelection, InputNumber } from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";
import { usePoolsLiquidity } from "@/composables/useProtocolLiquidity";
import type { SelectableToken } from "dapp-types";
// import AssetSelection from "@/components/CustomPotion/AssetSelection.vue";
import { BaseCard, SidebarLink } from "potion-ui";
import { SrcsetEnum } from "dapp-types";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// const router = useRouter();
const currentIndex = ref(0);

const AssetActiveIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/asset-active-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/asset-active-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/asset-active-32x32.webp"],
]);
const AssetDefaultIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/asset-default-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/asset-default-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/asset-default-32x32.webp"],
]);
const StrikeActiveIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/strike-active-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/strike-active-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/strike-active-32x32.webp"],
]);
const StrikeDefaultIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/strike-default-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/strike-default-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/strike-default-32x32.webp"],
]);
const DurationActiveIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/duration-active-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/duration-active-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/duration-active-32x32.webp"],
]);
const DurationDefaultIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/duration-default-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/duration-default-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/duration-default-32x32.webp"],
]);
const ReviewActiveIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/review-active-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/review-active-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/review-active-32x32.webp"],
]);
const ReviewDefaultIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/review-default-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/review-default-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/review-default-32x32.webp"],
]);
const sidebarItems = computed(() => {
  return [
    {
      title: t("asset"),
      iconSrcset: currentIndex.value === 0 ? AssetActiveIcon : AssetDefaultIcon,
      selected: currentIndex.value === 0,
      disabled: false,
      onClick: () => {
        currentIndex.value = 0;
      },
    },
    {
      title: t("strike_price"),
      iconSrcset:
        currentIndex.value === 1 ? StrikeActiveIcon : StrikeDefaultIcon,
      selected: currentIndex.value === 1,
      disabled: !isTokenSelected.value,
      onClick: () => {
        currentIndex.value = 1;
      },
    },
    {
      title: t("duration"),
      iconSrcset:
        currentIndex.value === 2 ? DurationActiveIcon : DurationDefaultIcon,
      selected: currentIndex.value === 2,
      disabled: true,
      onClick: () => {
        currentIndex.value = 2;
      },
    },
    {
      title: t("review_and_create"),
      iconSrcset:
        currentIndex.value === 2 ? ReviewActiveIcon : ReviewDefaultIcon,

      selected: currentIndex.value === 3,
      disabled: true,
      onClick: () => {
        currentIndex.value = 3;
      },
    },
  ];
});

const tokenToSelectableToken = (
  address: string,
  decimals = 18,
  selected = false
): SelectableToken => {
  const { name, symbol, image } = useTokenList(address);
  return {
    address,
    decimals,
    name,
    symbol,
    image,
    selected,
  };
};

// Token selection
const selectableTokens = ref<SelectableToken[]>([]);
const { underlyingsWithLiquidity } = usePoolsLiquidity();
watch(underlyingsWithLiquidity, () => {
  console.log(underlyingsWithLiquidity);
  selectableTokens.value = underlyingsWithLiquidity.value.map((address) =>
    tokenToSelectableToken(address)
  );
});

const tokenSelected = computed(() => {
  return selectableTokens.value.find((t) => t.selected);
});
const isTokenSelected = computed(() => {
  return tokenSelected.value ? true : false;
});
const handleTokenSelection = (address: string) => {
  selectableTokens.value.forEach((token) => {
    if (token.address === address) {
      token.selected = true;
    } else {
      token.selected = false;
    }
  });
};

// Strike Selection
const strikeSelected = ref(100);
const maxSelectableStrike = computed(() => {
  return 1000;
});
const isStrikeValid = ref(false);
console.log(isStrikeValid);
</script>

<template>
  <BaseCard class="">
    <div class="grid grid-cols-1 xl:grid-cols-3 p-5 gap-5">
      <div class="w-full flex justify-between items-center xl:col-span-3">
        <p class="capitalize">{{ t("your_put_recipe") }}</p>
        <router-link :to="{ name: 'discover-potions' }">
          <i class="i-ph-x"></i
        ></router-link>
      </div>
      <ul
        class="grid grid-cols-1 gap-2 lg:( grid-cols-4 ) gap-4 w-full xl:( grid-cols-1 ) items-start justify-center"
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
        ></SidebarLink>
      </ul>
      <div v-if="currentIndex === 0" class="w-full xl:col-span-2">
        <TokenSelection
          :tokens="selectableTokens"
          @token-selected="handleTokenSelection"
        />
      </div>
      <div v-if="currentIndex === 1" class="xl:col-span-2 flex justify-center">
        <BaseCard color="no-bg" class="w-full xl:w-3/7 justify-between">
          <div class="flex justify-between p-4">
            <p>hello</p>
            <p>potion</p>
          </div>
          <InputNumber
            v-model.number="strikeSelected"
            color="no-bg"
            :title="t('your_strike_price')"
            :min="1"
            :max="maxSelectableStrike"
            :step="0.1"
            unit="USDC"
            :footer-description="t('max_strike_price')"
          />
        </BaseCard>
      </div>
    </div>
  </BaseCard>
</template>
