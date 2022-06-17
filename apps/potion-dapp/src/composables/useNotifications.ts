import { SrcsetEnum, type NotificationProps } from "dapp-types";
import { ref, type Ref } from "vue";
import { etherscanUrl } from "@/helpers";
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";

const atomSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/atom.avif"],
  [SrcsetEnum.WEBP, "/icons/atom.webp"],
  [SrcsetEnum.PNG, "/icons/atom.png"],
]);
const defaultTimeout = process.env.NODE_ENV === "development" ? 20000 : 5000;

const useNotifications = (hideTimeout: number = defaultTimeout) => {
  const notifications: Ref<Map<string, NotificationProps>> = ref(new Map());

  const removeToast = (hash: string) => notifications.value.delete(hash);

  const createTransactionNotification = (
    transaction: ContractTransaction | null,
    title: string,
    body = "Your transaction is pending",
    srcset = atomSrcset
  ) => {
    const index = `${transaction?.hash}`;
    notifications.value.set(index, {
      title,
      body,
      cta: {
        label: "View on Etherscan",
        url: `${etherscanUrl}/tx/${transaction?.hash}`,
      },
      srcset,
      hideTimeout: hideTimeout,
    });

    setTimeout(() => {
      removeToast(index);
    }, hideTimeout);
  };

  const createReceiptNotification = (
    receipt: ContractReceipt | null,
    title: string,
    body = "Your transaction has completed",
    srcset = atomSrcset
  ) => {
    const index = `${receipt?.blockNumber}${receipt?.transactionIndex}`;
    notifications.value.set(index, {
      title,
      body,
      cta: {
        label: "View on Etherscan",
        url: `${etherscanUrl}/tx/${receipt?.transactionHash}`,
      },
      srcset,
      hideTimeout: hideTimeout,
    });

    setTimeout(() => {
      removeToast(index);
    }, hideTimeout);
  };

  return {
    notifications,
    createTransactionNotification,
    createReceiptNotification,
    removeToast,
  };
};

export { useNotifications };
