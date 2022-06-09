<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { usePersonalPotions } from "@/composables/usePotions";
import { BaseCard, LabelValue, BaseButton, PotionCard } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { computed, onMounted } from "vue";
import InnerNav from "@/components/InnerNav.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useNotifications } from "@/composables/useNotifications";

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

const timestamp = dayjs().unix().toString();
const { activePotions, expiredPotions, loadMoreActive, loadMoreExpired } =
  usePersonalPotions(buyerAddress, timestamp);

const availablePayout = computed(() => {
  return expiredPotions.value.reduce((totalPayout, value) => {
    return totalPayout + parseFloat(value.premium);
  }, 0);
});

onMounted(async () => {
  await loadMoreActive();
  await loadMoreExpired();
});

const handleWithdrawPotion = (id: string) => {
  console.log("withdraw potion with id:", id);
};

/**
 *  Toast notifications
 */

const {
  notifications,
  //createTransactionNotification,
  ///createReceiptNotification,
  removeToast,
} = useNotifications();
</script>
<template>
  <BaseCard>
    <div class="grid md:grid-cols-4 py-4 px-6 md:px-12 gap-4">
      <h2 class="text-3xl capitalize col-span-4 md:col-span-1 font-semibold">
        {{ t("my_summary") }}
      </h2>
      <LabelValue
        :title="t('active_potions')"
        :value="activePotions.length.toString()"
        size="xl"
      />
      <LabelValue
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
      <div class="grid md:grid-cols-2">
        <PotionCard
          v-for="(potion, index) in activePotions"
          :key="`${potion.id}${index}`"
          :withdrawable="isSameUserConnected"
          :expiry="potion.expiry"
          :token="potion.otoken.underlyingAsset"
          :strike-price="potion.otoken.strikePrice"
          :quantity="potion.numberOfOTokens"
          :current-payout="potion.premium"
        ></PotionCard>
      </div>
      <div class="flex justify-center mt-6">
        <BaseButton
          palette="secondary-o"
          :label="t('show_more')"
          size="sm"
          @click="loadMoreActive"
        ></BaseButton>
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
      <div class="grid md:grid-cols-2">
        <PotionCard
          v-for="(potion, index) in expiredPotions"
          :key="`${potion.id}${index}`"
          :withdrawable="isSameUserConnected"
          :expiry="potion.expiry"
          :token="potion.otoken.underlyingAsset"
          :strike-price="potion.otoken.strikePrice"
          :quantity="potion.numberOfOTokens"
          :current-payout="potion.premium"
          @withdraw="() => handleWithdrawPotion(potion.id)"
        ></PotionCard>
      </div>
      <div class="flex justify-center mt-6">
        <BaseButton
          palette="secondary-o"
          :label="t('show_more')"
          size="sm"
          @click="loadMoreExpired"
        ></BaseButton></div
    ></BaseCard>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="removeToast"
  ></NotificationDisplay>
</template>
