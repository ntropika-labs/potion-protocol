<script lang="ts" setup>
import { TokenSelection, InputNumber, BaseButton, BaseTag } from "potion-ui";
import { useCoinGecko } from "@/composables/useCoinGecko";
import { useTokenList } from "@/composables/useTokenList";
import { currencyFormatter } from "potion-ui";
import {
  usePoolsLiquidity,
  useUnderlyingLiquidity,
  useStrikeLiquidity,
} from "@/composables/useProtocolLiquidity";
import { useSimilarPotions } from "@/composables/useSimilarPotions";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useBlockNative } from "@/composables/useBlockNative";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";

import type { SelectableToken, Criteria } from "dapp-types";
import { BaseCard, SidebarLink } from "potion-ui";
import { SrcsetEnum } from "dapp-types";
import { ref, computed, watch, onMounted, unref } from "vue";
import { watchDebounced } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { offsetToDate } from "@/helpers/days";
const { t } = useI18n();
const { blockTimestamp, getBlock } = useEthersProvider();
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
  [SrcsetEnum.AVIF, "/icons/review-default-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/review-default-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/review-default-32x32.webp"],
]);
const ReviewDefaultIcon = new Map([
  [SrcsetEnum.AVIF, "/icons/review-active-32x32.avif"],
  [SrcsetEnum.PNG, "/icons/review-active-32x32.png"],
  [SrcsetEnum.WEBP, "/icons/review-active-32x32.webp"],
]);

const gasUnitsToDeployOtoken = 840000;
const { getGas, gasPrice } = useBlockNative();
const { coinsPrices, fetchCoinsPrices } = useCoinGecko(["ethereum"]);
const ethPrice = computed(() => {
  if (coinsPrices.value && coinsPrices.value.ethereum.usd) {
    return coinsPrices.value.ethereum.usd;
  }
  return 0;
});
onMounted(async () => {
  await fetchCoinsPrices();
  await getGas();
});
const savingByPickSimilar = computed(() => {
  if (ethPrice.value && gasPrice.value) {
    const saving =
      ((gasPrice.value * 10e8 * gasUnitsToDeployOtoken) / 1e18) *
      ethPrice.value;
    return currencyFormatter(saving, "$");
  }
  return currencyFormatter(0, "$");
});

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
          strikeSelected.value = maxSelectableStrikeAbsolute.value * 0.9;
        }
        currentIndex.value = 1;
      },
    },
    {
      title: t("expiration"),
      iconSrcset:
        currentIndex.value === 2 ? DurationActiveIcon : DurationDefaultIcon,
      selected: currentIndex.value === 2,
      disabled: !isTokenSelected.value || !isStrikeValid.value,
      onClick: () => {
        if (durationSelected.value === 0) {
          durationSelected.value = 1;
        }
        currentIndex.value = 2;
      },
    },
    {
      title: t("review_and_create"),
      iconSrcset:
        currentIndex.value === 3 ? ReviewActiveIcon : ReviewDefaultIcon,
      selected: currentIndex.value === 3,
      disabled:
        !isTokenSelected.value ||
        !isStrikeValid.value ||
        !isDurationValid.value,
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
const { fetchTokenPrice, formattedPrice, price } = useCoinGecko(
  undefined,
  tokenSelected.value?.address || ""
);

onMounted(() => {
  fetchTokenPrice();
});

const { maxStrike: maxSelectableStrike } =
  useUnderlyingLiquidity(tokenSelectedAddress);

const maxSelectableStrikeAbsolute = computed(() => {
  return (maxSelectableStrike.value * price.value) / 100;
});

const strikeSelected = ref(0);

const strikeSelectedRelative = computed(() => {
  return parseFloat(((strikeSelected.value * 100) / price.value).toFixed(2));
});

const isStrikeValid = ref(false);

// Duration Selection
const durationSelected = ref(0);
watchDebounced(
  durationSelected,
  () => {
    getBlock("latest");
  },
  { debounce: 1000 }
);
const durationSelectedDate = computed(() => {
  return offsetToDate(blockTimestamp.value, durationSelected.value);
});
const {
  maxDuration: maxSelectableDuration,
  maxDurationInDays: maxSelectableDurationInDays,
} = useStrikeLiquidity(tokenSelectedAddress, strikeSelectedRelative);
const isDurationValid = ref(false);

// Potion Quantity
const potionQuantity = ref(0.001);
const isPotionQuantityValid = ref(false);

const orderSize = computed(() => {
  return strikeSelected.value * potionQuantity.value;
});

// const totalPrice = computed(() => {
//   if (routerResult.value && routerResult.value.premium) {
//     return potionQuantity.value * routerResult.value.premium;
//   }
//   return 0;
// });
// const formattedTotalPrice = computed(() => {
//   return currencyFormatter(totalPrice.value, "USDC");
// });

// Router logic
const slippage = ref([
  { value: 0.005, label: "0.5%", selected: true },
  { value: 0.02, label: "2%", selected: false },
  { value: 0.05, label: "5%", selected: false },
]);

const handleSlippageSelection = (index: number) => {
  slippage.value.forEach((slippage, i) => {
    if (i === index) {
      slippage.selected = true;
    } else {
      slippage.selected = false;
    }
  });
};
const premiumSlippage = computed(() => {
  const selectedSlippage = slippage.value.find((s) => s.selected);
  if (selectedSlippage && routerResult.value && routerResult.value.premium) {
    return (
      routerResult.value.premium * selectedSlippage.value +
      routerResult.value.premium
    );
  }
  return 0;
});
const formattedPremiumSlippage = computed(() => {
  return currencyFormatter(premiumSlippage.value, "USDC");
});
const criteriasParam = ref<Criteria[]>([]);
watch(tokenSelected, () => {
  if (tokenSelected.value) {
    const t = unref(tokenSelected) ?? { name: "", symbol: "", address: "" };
    criteriasParam.value = [
      {
        token: t,
        maxStrike: strikeSelectedRelative.value,
        maxDuration: durationSelected.value,
      },
    ];
  }
});
const {
  routerResult,
  maxNumberOfPotions,
  formattedMarketSize,
  formattedPremium,
} = useDepthRouter(
  criteriasParam,
  orderSize,
  strikeSelected,
  gasPrice,
  ethPrice
);

// Buy logic
const { buyPotions } = usePotionLiquidityPoolContract();
const handleBuyPotions = async () => {
  if (
    routerResult.value &&
    routerResult.value.counterparties &&
    tokenSelectedAddress.value
  ) {
    await buyPotions(
      routerResult.value?.counterparties,
      premiumSlippage.value,
      undefined,
      tokenSelectedAddress.value,
      strikeSelected.value,
      durationSelected.value
    );
  } else {
    console.info("you miss some parameters to be set");
  }
};
//Similar Potions
const {
  computedSimilarByAsset,
  computedSimilarByStrike,
  computedSimilarByDuration,
} = useSimilarPotions(
  tokenSelectedAddress,
  strikeSelected,
  durationSelected,
  price
);
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
            v-if="index === 0 && tokenSelected"
            class="flex gap-2 items-center"
          >
            <img
              class="h-5 w-5"
              :src="tokenSelected?.image"
              :alt="tokenSelected?.symbol"
            />
            <p class="text-xs">{{ tokenSelected?.symbol }}</p>
          </div>
          <div v-if="index === 1 && strikeSelected">
            <p class="text-xs">USDC {{ strikeSelected }}</p>
          </div>
          <div v-if="index === 2 && durationSelected">
            <p class="text-xs">{{ durationSelectedDate }}</p>
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
        <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
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
            :max="maxSelectableStrikeAbsolute"
            :step="0.1"
            unit="USDC"
            :footer-description="t('max_strike_price')"
            @valid-input="isStrikeValid = $event"
          />
        </BaseCard>
      </div>
      <div v-if="currentIndex === 2" class="xl:col-span-2 flex justify-center">
        <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
          <div class="flex justify-between p-4 items-start">
            <div class="flex gap-2 items-center">
              <p class="text-sm capitalize">{{ t("max_duration") }}</p>
            </div>
            <div class="text-sm">
              <p>{{ maxSelectableDuration }} {{ t("days") }}</p>
              <p>{{ maxSelectableDurationInDays }}</p>
            </div>
          </div>
          <InputNumber
            v-model.number="durationSelected"
            color="no-bg"
            :title="t('your_potion_expires_in')"
            :min="1"
            :max="maxSelectableDuration"
            :step="1"
            unit="days"
            :max-decimals="0"
            :footer-description="t('expiration')"
            :footer-value="durationSelectedDate"
            @valid-input="isDurationValid = $event"
          />
        </BaseCard>
      </div>
      <div
        v-if="currentIndex === 3"
        class="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-3 justify-center"
      >
        <BaseCard color="no-bg" class="w-full justify-between">
          <div class="flex justify-between p-4 items-start text-sm">
            <div class="flex gap-2 items-center">
              <p class="capitalize">{{ t("market_size") }}</p>
            </div>
            <div>
              <p>{{ formattedMarketSize }}</p>
            </div>
          </div>
          <InputNumber
            v-model.number="potionQuantity"
            color="no-bg"
            :title="t('number_of_potions')"
            :min="0.00000001"
            :max="maxNumberOfPotions"
            :step="1"
            unit="POTION"
            :max-decimals="8"
            :footer-description="t('max_number_of_potions')"
            @valid-input="isPotionQuantityValid = $event"
          />
        </BaseCard>
        <BaseCard color="no-bg" class="w-full gap-8 pt-4">
          <div class="flex justify-between px-4 items-start text-sm">
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("price_per_potion") }}</p>
              <p>{{ formattedPremium }}</p>
            </div>
          </div>
          <div class="flex justify-between px-4 items-start text-sm">
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("number_of_potions") }}</p>
              <p>{{ potionQuantity }}</p>
            </div>
          </div>
          <div
            class="flex justify-between px-4 items-start text-sm text-secondary-500"
          >
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("total") }}</p>
              <p>{{ formattedPremiumSlippage }}</p>
            </div>
          </div>
          <BaseCard color="no-bg" class="p-4">
            <p class="text-lg font-bold capitalize">
              {{ t("slippage_tolerance") }}
            </p>
            <div class="flex gap-3 mt-3">
              <button
                v-for="(s, index) in slippage"
                :key="`slippage-${index}`"
                class="outline-none focus:outline-none"
                @click="handleSlippageSelection(index)"
              >
                <BaseTag :color="s.selected === true ? 'primary' : 'base'">{{
                  s.label
                }}</BaseTag>
              </button>
            </div>
          </BaseCard>
        </BaseCard>
      </div>
    </div>
    <div class="flex w-full justify-end items-center gap-3 p-4">
      <BaseButton
        v-if="currentIndex !== 0"
        class="uppercase"
        test-back
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
        v-if="currentIndex !== sidebarItems.length - 1"
        test-next
        palette="secondary"
        :inline="true"
        :label="t('next')"
        :disabled="sidebarItems[currentIndex + 1].disabled"
        @click="sidebarItems[currentIndex + 1].onClick()"
      >
        <template #post-icon>
          <i class="i-ph-caret-right"></i>
        </template>
      </BaseButton>
      <BaseButton
        v-if="currentIndex === sidebarItems.length - 1"
        label="create"
        @click="handleBuyPotions()"
      />
    </div>
  </BaseCard>
  <div class="mt-10">
    <h2 class="uppercase text-secondary-500 text-sm">
      {{ t("similar_potions") }}
    </h2>
    <p class="text-sm">
      {{ t("similar_potion_message", { dollars: savingByPickSimilar }) }}
    </p>
    <pre class="font-mono">
      <code>
        {{computedSimilarByAsset}}
      </code>
      <code>
        {{ computedSimilarByStrike }}
      </code>
      <code>
        {{computedSimilarByDuration}}
      </code>
    </pre>
  </div>
</template>
