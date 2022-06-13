<script lang="ts" setup>
import { TokenSelection, InputNumber, BaseButton } from "potion-ui";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
import { useTokenList } from "@/composables/useTokenList";
import {
  usePoolsLiquidity,
  useUnderlyingLiquidity,
} from "@/composables/useProtocolLiquidity";
import type { SelectableToken } from "dapp-types";
// import AssetSelection from "@/components/CustomPotion/AssetSelection.vue";
import { BaseCard, SidebarLink } from "potion-ui";
import { SrcsetEnum } from "dapp-types";
import { ref, computed, watch, onMounted } from "vue";
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
        if (strikeSelected.value === 0) {
          strikeSelected.value = 100;
        }
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
// const tokenSelected =  computed(() => {
//   const res =  selectableTokens.value.find((token) => token.selected);
//   if (res) {
//     return res
//   } return null
// });
const { underlyingsWithLiquidity } = usePoolsLiquidity();
watch(underlyingsWithLiquidity, () => {
  selectableTokens.value = underlyingsWithLiquidity.value.map((address) =>
    tokenToSelectableToken(address)
  );
});
const tokenSelected = ref<SelectableToken | null>(null);
const tokenSelectedAddress = ref<string | null>(null);
watch(
  selectableTokens,
  () => {
    const selected = selectableTokens.value.find((token) => token.selected);
    if (selected) {
      tokenSelected.value = selected;
      tokenSelectedAddress.value = selected.address;
    }
  },
  {
    deep: true,
  }
);

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
const { fetchPrice, formattedPrice } = useFetchTokenPrices(
  tokenSelected.value?.address || ""
);
onMounted(() => {
  fetchPrice();
});
const strikeSelected = ref(0);

const isStrikeValid = ref(true);
const isNextStepEnabled = computed(() => {
  if (currentIndex.value === 0) {
    return isTokenSelected.value;
  }
  if (currentIndex.value === 1) {
    return isStrikeValid.value;
  }
  return false;
});

// Similar By Strike
const { maxStrike: maxSelectableStrike } =
  useUnderlyingLiquidity(tokenSelectedAddress);
</script>

<template>
  <BaseCard>
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
        >
          <div
            v-if="index === 0 && tokenSelected"
            class="flex gap-2 items-center"
          >
            <img
              class="h-5 w-5"
              :src="tokenSelected?.image"
              :alt="tokenSelected?.symbol"
            />
            <p class="text-sm">{{ tokenSelected?.symbol }}</p>
          </div>
          <div v-if="index === 1 && strikeSelected">
            <p class="text-sm">{{ strikeSelected }}</p>
          </div>
        </SidebarLink>
      </ul>
      <div v-if="currentIndex === 0" class="w-full xl:col-span-2">
        <TokenSelection
          v-if="selectableTokens.length > 0"
          :tokens="selectableTokens"
          @token-selected="handleTokenSelection"
        />
        <div v-else class="text-center">
          <p class="text-white/40 text-3xl uppercase">
            {{ t("no_underlying_asset_found") }}
          </p>
        </div>
      </div>
      <div v-if="currentIndex === 1" class="xl:col-span-2 flex justify-center">
        <BaseCard color="no-bg" class="w-full xl:w-3/7 justify-between">
          <div class="flex justify-between p-4">
            <div class="flex gap-2 items-center">
              <img
                class="h-5 w-5"
                :src="tokenSelected?.image"
                :alt="tokenSelected?.symbol"
              />
              <p class="text-sm capitalize">{{ t("current_price") }}</p>
            </div>
            <p>{{ formattedPrice }}</p>
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
            @valid-input="isStrikeValid = $event"
          />
        </BaseCard>
      </div>
    </div>
    <div class="flex w-full justify-end items-center gap-3 p-4">
      <BaseButton
        v-if="currentIndex !== 0"
        class="uppercase"
        test-next
        palette="flat"
        :inline="true"
        :label="t('back')"
        :disabled="false"
        @click="currentIndex--"
      >
        <template #pre-icon>
          <i class="i-ph-caret-left"></i>
        </template>
      </BaseButton>
      <BaseButton
        test-next
        palette="secondary"
        :inline="true"
        :label="t('next')"
        :disabled="!isNextStepEnabled"
        @click="currentIndex++"
      >
        <template #post-icon>
          <i class="i-ph-caret-right"></i>
        </template>
      </BaseButton>
    </div>
  </BaseCard>
  <div class="mt-10">
    <h2>Similar Potions</h2>
    <pre>
      <code class="font-mono">

      </code>
    </pre>
  </div>
</template>
