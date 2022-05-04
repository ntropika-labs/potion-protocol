<template>
  <div class="container flex gap-8">
    <div class="flex flex-col space-y-8">
      <BaseButton
        size="medium"
        palette="primary"
        label="Connect to wallet"
        :disabled="simpleERC20.loading.value"
        @click="onboard.connectWallet()"
      />
      <hr />
      <BaseButton
        label=""
        palette="primary-o"
        size="small"
        class="bg-green-400 rounded-full font-bold px-2 py-1"
        @click="ethersProvider.getBlock('latest')"
      >
        Get Block
      </BaseButton>

      <BaseButton
        label=""
        palette="primary-o"
        size="small"
        class="bg-green-400 rounded-full font-bold px-2 py-1"
        @click="simpleERC20.getTotalSupply()"
      >
        Total Supply
      </BaseButton>
      <BaseButton
        label=""
        palette="primary-o"
        size="small"
        class="bg-green-400 rounded-full font-bold px-2 py-1"
        @click="simpleERC20.getUserBalance()"
      >
        User Balance
      </BaseButton>
    </div>
    <div class="flex-grow flex flex-col gap-8">
      <div>
        <h2 class="text-lg font-bold">Info</h2>
        <div class="flex flex-row w-full justify-between">
          <p class="text-md font-semibold border-b border-dark">Block number</p>
          <p>{{ ethersProvider.block || "-" }}</p>
          <p class="text-md font-semibold border-b border-dark">Total supply</p>
          <p>{{ simpleERC20.totalSupply || "-" }}</p>
          <p class="text-md font-semibold border-b border-dark">User Balance</p>
          <p>{{ simpleERC20.userBalance || "-" }}</p>
        </div>
      </div>
      <hr />
      <div class="flex flex-col flex-grow">
        <h2 class="text-lg font-bold">Transactions</h2>
        <div class="flex flex-col mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BaseInput
              v-model="toTransferAmount"
              label="Amount to transfer"
              input-type="number"
              :is-disabled="simpleERC20.loading.value"
            />
            <BaseInput
              v-model="toTransferAddress"
              label="Address to transfer to"
              input-type="text"
              :is-disabled="simpleERC20.loading.value"
            />
          </div>
          <div
            class="flex flex-row gap-8 align-center justify-between bg-light rounded-lg p-4 my-4"
          >
            <div class="">
              <p class="p-2">
                Transfer <b>{{ toTransferAmount }}</b> to
                <b>{{ toTransferAddress }}</b>
              </p>
            </div>
            <BaseButton
              label=""
              palette="secondary"
              size="small"
              class="bg-green-400 rounded-full font-bold px-2 py-1"
              :disabled="simpleERC20.loading.value"
              @click="handleTransfer()"
            >
              Confirm
            </BaseButton>
          </div>
        </div>
        {{ onboard.connectedWallet?.value?.accounts }}
        <h3 class="text-lg font-bold">Transactions List</h3>
        <ListComponent
          :model-value="previousTransactions"
          :is-loading="subgraphLoading"
          :has-more-info="true"
        >
          <template #item="{ from, to, amount, block, timestamp }">
            <p>
              From: <i>{{ from.id }}</i>
            </p>
            <p>
              Contract: <i>{{ to.id }}</i>
            </p>
            <p>amount: {{ amount }}</p>
            <p>block: {{ block }}</p>
            <p>timestamp: {{ timestamp }}</p>
          </template>
        </ListComponent>
        <ListComponent
          :model-value="transactions"
          :is-loading="simpleERC20.loading.value"
          :has-more-info="true"
        >
          <template #item="{ from, to, status, type, gasPrice }">
            <p>
              From: <i>{{ from }}</i>
            </p>
            <p>
              Contract: <i>{{ to }}</i>
            </p>
            <p>status: {{ status }}</p>
            <p>type: {{ type }}</p>
            <p>gas price: {{ gasPrice }}</p>
          </template>
        </ListComponent>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useOnboard } from "@/composables/useOnboard";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useSimpleERC20 } from "@/composables/useSimpleERC20";
import { BaseInput, BaseButton as BaseButton, ListComponent } from "ui-library";
import type { ListElement } from "ui-library/dist/types/src/types";
import { useAllTransactionsQuery } from "subgraph-queries/generated/urql";

type ExtendedListElement = ListElement & { [key: string]: any };

const subgraphTransactionToListItem = (
  transaction: any
): ExtendedListElement => ({
  label: transaction.id,
  from: transaction.from.id,
  to: transaction.to.id,
  amount: transaction.amount,
  block: transaction.block,
  timestamp: transaction.timestamp,
});

const { data: previousData, fetching: subgraphLoading } =
  useAllTransactionsQuery();
const previousTransactions = computed(
  () =>
    previousData?.value?.transactions?.map(subgraphTransactionToListItem) ?? []
);

const onboard = useOnboard();
const ethersProvider = useEthersProvider();
const simpleERC20 = useSimpleERC20();
const toTransferAmount = ref(0);
const toTransferAddress = ref("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const transactions = ref<Array<ExtendedListElement>>([]);
const handleTransfer = async () => {
  const receipt = await simpleERC20.transfer(
    toTransferAddress.value,
    toTransferAmount.value
  );
  console.log(receipt);
  transactions.value.push({
    id: receipt.transactionIndex,
    label: receipt.transactionHash,
    from: receipt.from,
    to: receipt.to,
    status: receipt.status,
    type: receipt.type,
    gasPrice: receipt.effectiveGasPrice,
  });
};
</script>
