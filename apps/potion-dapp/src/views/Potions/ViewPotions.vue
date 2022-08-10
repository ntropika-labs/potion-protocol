<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { usePersonalPotions } from "@/composables/usePersonalPotions";
import { BaseCard, LabelValue, BaseButton, MyPotionCard } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { computed, onMounted, ref, watch } from "vue";
import InnerNav from "@/components/InnerNav.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { useRoute } from "vue-router";
import { useNotifications } from "@/composables/useNotifications";
import { useControllerContract } from "@/composables/useControllerContract";
import { useOracleContract } from "@/composables/useOracleContract";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useErc20UpgradeableContract } from "@/composables/useErc20UpgradeableContract";

const { connectedWallet } = useOnboard();
const { getTokensBalance } = useErc20UpgradeableContract();

const { t } = useI18n();
const route = useRoute();
const buyerAddress = Array.isArray(route.params.address)
  ? route.params.address[0]
  : route.params.address;

const connectedWalletAddress = computed(() =>
  connectedWallet.value?.accounts[0].address.toLowerCase()
);
const isSameUserConnected = computed(
  () => connectedWalletAddress.value === buyerAddress
);

const innerNavProps = computed(() => {
  return {
    currentRoute: route.name,
    routes: [
      {
        name: "discover-potions",
        label: "Discover Potions",
        enabled: true,
        params: {},
      },
      {
        name: "buyer",
        label: "My Potions",
        enabled: connectedWalletAddress.value ? true : false,
        params: {
          buyer: connectedWalletAddress.value ?? "not-valid",
        },
      },
    ],
  };
});

const { blockTimestamp, loading: blockLoading, getBlock } = useEthersProvider();

const {
  activePotions,
  expiredPotions,
  loadMoreActive,
  loadMoreExpired,
  canLoadMoreActivePotions,
  canLoadMoreExpiredPotions,
  loadingUserPotions,
  loadingActivePotions,
  loadingExpiredPotions,
} = usePersonalPotions(buyerAddress, blockTimestamp, blockLoading);

const { redeem, redeemTx, redeemReceipt, redeemLoading, getPayouts } =
  useControllerContract();

const { getPrices } = useOracleContract();

const activePotionsPrices = ref(new Map<string, string>());
const expiredPotionsPayouts = ref(new Map<string, string>());
const redeemableBalancesMap = ref(new Map<string, string>());
const redeemablePayoutsMap = computed(() => {
  const result = new Map<string, number>();
  Array.from(redeemableBalancesMap.value.entries()).forEach(([key, value]) => {
    const payout = expiredPotionsPayouts.value.get(key);
    if (payout && parseInt(value) !== 0) {
      result.set(key, parseFloat(payout));
    }
  });
  return result;
});

const availablePayout = computed(() => {
  return Array.from(redeemablePayoutsMap.value.values()).reduce(
    (acc, v) => acc + v,
    0
  );
});

const summaryText = computed(() =>
  isSameUserConnected.value ? t("my_summary") : t("summary")
);

const handleWithdrawPotion = async (otokenId: string, amount: string) => {
  if (connectedWalletAddress.value && isSameUserConnected.value) {
    await redeem(otokenId, amount, connectedWalletAddress.value);
    redeemableBalancesMap.value.set(otokenId, "0");
  }
};

watch(
  expiredPotions,
  async () => {
    const info = expiredPotions.value.map((p) => ({
      key: p.otoken.id,
      address: p.otoken.id,
      amount: p.numberOfOTokens,
    }));

    expiredPotionsPayouts.value = await getPayouts(info);
    redeemableBalancesMap.value = await getTokensBalance(
      buyerAddress,
      Array.from(expiredPotionsPayouts.value.keys())
    );
  },
  { immediate: true }
);

watch(
  activePotions,
  async () => {
    const potionsInfo = activePotions.value.map((potion) => potion.otoken.id);
    const prices = await getPrices(potionsInfo);

    for (let i = 0; i < activePotions.value.length; i++) {
      const potion = activePotions.value[i];
      const numberOfOTokens = parseFloat(potion.numberOfOTokens);
      const price = parseFloat(prices.get(potion.otoken.id) || "0");
      const strikePrice = parseFloat(potion.otoken.strikePrice);

      const finalPrice =
        price < strikePrice
          ? ((strikePrice - price) * numberOfOTokens).toString()
          : "0";

      activePotionsPrices.value.set(potion.otoken.id, finalPrice);
    }
  },
  { immediate: true }
);

onMounted(async () => await getBlock("latest"));

const getActivePotionPayout = (address: string) =>
  activePotionsPrices.value.get(address) || "0";

const getExpiredPotionPayout = (address: string) => {
  if (redeemablePayoutsMap.value.get(address)) {
    return expiredPotionsPayouts.value.get(address) || "0";
  }
  return "0";
};

const isPotionWithdrawable = (address: string) => {
  const payout = redeemablePayoutsMap.value.get(address);
  if (isSameUserConnected.value && payout) {
    return payout > 0;
  }
  return false;
};

/**
 *  Toast notifications
 */

const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(redeemTx, (transaction) =>
  createTransactionNotification(transaction, "Withdrawing Potion")
);
watch(redeemReceipt, (receipt) =>
  createReceiptNotification(receipt, "Potion withdrawn")
);
</script>
<template>
  <BaseCard>
    <div class="grid md:grid-cols-4 py-4 px-6 md:px-12 gap-4">
      <h2 class="text-3xl capitalize col-span-4 xl:col-span-1 font-semibold">
        {{ summaryText }}
      </h2>
      <LabelValue
        test-potions-total-active
        :title="t('active_potions')"
        :value="activePotions.length.toString()"
        size="xl"
      />
      <LabelValue
        test-potions-total-expired
        :title="t('expired_potions')"
        :value="expiredPotions.length.toString()"
        size="xl"
      />
      <LabelValue
        :title="t('available_payout')"
        :value="availablePayout.toString()"
        value-type="currency"
        symbol="$"
        size="xl"
      />
    </div>
  </BaseCard>
  <InnerNav v-bind="innerNavProps" class="mt-10" />
  <div class="flex flex-col gap-6 mt-10">
    <template v-if="loadingUserPotions">
      <i class="i-eos-icons-loading"> </i>
    </template>
    <template v-else>
      <BaseCard class="p-6">
        <div>
          <h3
            class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-sm font-semibold"
          >
            {{ t("active_potions") }}
          </h3>
          <h2 class="my-3 w-3/4 text-xl">
            {{ t("purchased_potions_not_expired") }}
          </h2>
        </div>
        <template v-if="activePotions.length > 0">
          <div
            class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            test-active-potions-grid
          >
            <!-- Get price from oracle composable -->
            <MyPotionCard
              v-for="(potion, index) in activePotions"
              :key="`${potion.id}${index}`"
              :withdrawable="false"
              :expiry="potion.expiry"
              :is-expired="false"
              :is-withdraw-enabled="false"
              :token="potion.otoken.underlyingAsset"
              :strike-price="potion.otoken.strikePrice"
              :quantity="potion.numberOfOTokens"
              :current-payout="getActivePotionPayout(potion.otoken.id)"
            >
            </MyPotionCard>
          </div>
          <div class="flex justify-center mt-6">
            <BaseButton
              v-if="canLoadMoreActivePotions"
              test-potions-load-more-active
              palette="secondary-o"
              :label="t('show_more')"
              size="sm"
              :disabled="
                redeemLoading || loadingActivePotions || loadingExpiredPotions
              "
              @click="loadMoreActive"
            ></BaseButton>
          </div>
        </template>
        <div
          v-else
          class="flex justify-center p-6 text-dwhite-400/30 uppercase text-xs"
        >
          {{ t("no_potions_available") }}
        </div>
      </BaseCard>
      <BaseCard class="p-6">
        <div>
          <h3
            class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-sm font-semibold"
          >
            {{ t("expired_potions") }}
          </h3>
          <h2 class="my-3 w-3/4 text-xl">
            {{ t("withdraw_expired_potions") }}
          </h2>
        </div>
        <template v-if="expiredPotions.length > 0">
          <div
            class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            test-expired-potions-grid
          >
            <MyPotionCard
              v-for="(potion, index) in expiredPotions"
              :key="`${potion.id}${index}`"
              text-potions-expired-potion-card
              :withdrawable="isPotionWithdrawable(potion.otoken.id)"
              :expiry="potion.expiry"
              :is-expired="true"
              :is-withdraw-enabled="isSameUserConnected && !redeemLoading"
              :token="potion.otoken.underlyingAsset"
              :strike-price="potion.otoken.strikePrice"
              :quantity="potion.numberOfOTokens"
              :current-payout="getExpiredPotionPayout(potion.otoken.id)"
              @withdraw="
                () =>
                  handleWithdrawPotion(potion.otoken.id, potion.numberOfOTokens)
              "
            ></MyPotionCard>
          </div>
          <div class="flex justify-center mt-6">
            <BaseButton
              v-if="canLoadMoreExpiredPotions"
              test-potions-load-more-expired
              palette="secondary-o"
              :label="t('show_more')"
              size="sm"
              :disabled="
                redeemLoading || loadingActivePotions || loadingExpiredPotions
              "
              @click="loadMoreExpired"
            ></BaseButton>
          </div>
        </template>
        <div
          v-else
          class="flex justify-center p-6 text-dwhite-400/30 uppercase text-xs"
        >
          {{ t("no_potions_available") }}
        </div>
      </BaseCard>
    </template>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="removeToast"
  ></NotificationDisplay>
</template>
