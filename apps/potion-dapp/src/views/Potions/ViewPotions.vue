<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { usePersonalPotions } from "@/composables/usePotions";
import { BaseCard, LabelValue, BaseButton, PotionCard } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { computed, onMounted, ref, watch } from "vue";
import InnerNav from "@/components/InnerNav.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { useRoute } from "vue-router";
import { useNotifications } from "@/composables/useNotifications";
import { useControllerContract } from "@/composables/useControllerContract";
import { useOracleContract } from "@/composables/useOracleContract";
import { useEthersProvider } from "@/composables/useEthersProvider";

const { connectedWallet } = useOnboard();

const { t } = useI18n();
const route = useRoute();
const buyerAddress = Array.isArray(route.params.address)
  ? route.params.address[0]
  : route.params.address;

const isSameUserConnected = computed(() => {
  if (
    connectedWallet.value?.accounts[0].address.toLowerCase() === buyerAddress
  ) {
    return true;
  } else {
    return false;
  }
});
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
        enabled: connectedWallet.value?.accounts[0].address ? true : false,
        params: {
          buyer: connectedWallet.value?.accounts[0].address ?? "not-valid",
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

const availablePayout = computed(() => {
  return Array.from(expiredPotionsPayouts.value.values()).reduce(
    (totalPayout, value) => {
      return totalPayout + parseFloat(value);
    },
    0
  );
});

const summaryText = computed(() =>
  isSameUserConnected.value ? t("my_summary") : t("summary")
);

const handleWithdrawPotion = async (otokenId: string, amount: string) => {
  const buyerAddress = connectedWallet.value?.accounts[0].address.toLowerCase();

  if (!buyerAddress) return;

  await redeem(otokenId, amount, buyerAddress);
};

watch(
  () => [...expiredPotions.value],
  async (potions) => {
    console.log("watching expired potions");
    const info = potions.map((p) => ({
      address: p.otoken.id,
      amount: p.numberOfOTokens,
    }));

    const payouts = await getPayouts(info);

    expiredPotionsPayouts.value = new Map([
      ...expiredPotionsPayouts.value.entries(),
      ...payouts.entries(),
    ]);
  },
  { immediate: true }
);

watch(
  () => [...activePotions.value],
  async (potions) => {
    console.log("watching active potions");

    const potionsInfo = potions.map((potion) => potion.otoken.id);
    const prices = await getPrices(potionsInfo);

    for (let i = 0; i < potions.length; i++) {
      const potion = potions[i];
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

const getExpiredPotionPayout = (address: string) =>
  expiredPotionsPayouts.value.get(address) || "0";

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
  <InnerNav v-bind="innerNavProps" class="mt-5" />
  <div class="flex flex-col gap-6 mt-10">
    <template v-if="loadingUserPotions">
      <i class="i-eos-icons-loading"> </i>
    </template>
    <template v-else>
      <BaseCard class="p-6"
        ><div>
          <h3
            class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-sm font-semibold"
          >
            {{ t("active_potions") }}
          </h3>
          <h2 class="my-3 w-3/4 text-xl">
            {{ t("purchased_potions_not_expired") }}
          </h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Get price from oracle composable -->
          <PotionCard
            v-for="(potion, index) in activePotions"
            :key="`${potion.id}${index}`"
            :withdrawable="isSameUserConnected"
            :expiry="potion.expiry"
            :is-expired="false"
            :is-withdraw-enabled="false"
            :token="potion.otoken.underlyingAsset"
            :strike-price="potion.otoken.strikePrice"
            :quantity="potion.numberOfOTokens"
            :current-payout="getActivePotionPayout(potion.otoken.id)"
          ></PotionCard>
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
          <div v-else class="text-dwhite-400/30 uppercase text-xs">
            No more potions available
          </div>
        </div>
      </BaseCard>
      <BaseCard class="p-6"
        ><div>
          <h3
            class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-sm font-semibold"
          >
            {{ t("expired_potions") }}
          </h3>
          <h2 class="my-3 w-3/4 text-xl">
            {{ t("expired_potins_ready_to_withdraw") }}
          </h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PotionCard
            v-for="(potion, index) in expiredPotions"
            :key="`${potion.id}${index}`"
            text-potions-expired-potion-card
            :withdrawable="isSameUserConnected"
            :expiry="potion.expiry"
            :is-expired="true"
            :is-withdraw-enabled="!redeemLoading"
            :token="potion.otoken.underlyingAsset"
            :strike-price="potion.otoken.strikePrice"
            :quantity="potion.numberOfOTokens"
            :current-payout="getExpiredPotionPayout(potion.otoken.id)"
            @withdraw="
              () =>
                handleWithdrawPotion(potion.otoken.id, potion.numberOfOTokens)
            "
          ></PotionCard>
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
          <div v-else class="text-dwhite-400/30 uppercase text-xs">
            No more potions available
          </div>
        </div></BaseCard
      >
    </template>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="removeToast"
  ></NotificationDisplay>
</template>
