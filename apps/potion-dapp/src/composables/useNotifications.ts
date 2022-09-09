import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { getEtherscanUrl } from "@/helpers";

import type { Ref } from "vue";
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type { NotificationProps } from "dapp-types";

interface ExternalUrl {
  label: string;
  url: string;
}

const atomSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/atom.avif"],
  [SrcsetEnum.WEBP, "/icons/atom.webp"],
  [SrcsetEnum.PNG, "/icons/atom.png"],
]);
const defaultTimeout = process.env.NODE_ENV === "development" ? 20000 : 5000;

const useNotifications = (hideTimeout: number = defaultTimeout) => {
  const { t } = useI18n();
  const notifications: Ref<Map<string, NotificationProps>> = ref(new Map());

  const removeToast = (hash: string) => notifications.value.delete(hash);

  const createNotification = (
    title: string,
    body: string,
    cta: ExternalUrl | undefined,
    srcset: Map<SrcsetEnum, string>,
    index: string
  ) => {
    notifications.value.set(index, {
      title,
      body,
      cta,
      srcset,
      hideTimeout,
    });

    setTimeout(() => removeToast(index), hideTimeout);
  };

  const createSimpleNotification = (
    title: string,
    body: string,
    srcset = atomSrcset
  ) =>
    createNotification(
      title,
      body,
      undefined,
      srcset,
      `simple-notification-${title}-${body}`
    );

  const createTransactionNotification = (
    transaction: ContractTransaction | null,
    title: string,
    body = t("transaction_pending"),
    srcset = atomSrcset
  ) =>
    createNotification(
      title,
      body,
      {
        label: t("view_on_etherscan"),
        url: getEtherscanUrl(transaction?.hash ?? "", "tx"),
      },
      srcset,
      `transaction-${transaction?.hash}`
    );

  const createReceiptNotification = (
    receipt: ContractReceipt | null,
    title: string,
    body = t("transaction_completed"),
    srcset = atomSrcset
  ) =>
    createNotification(
      title,
      body,
      {
        label: t("view_on_etherscan"),
        url: getEtherscanUrl(receipt?.transactionHash ?? "", "tx"),
      },
      srcset,
      `receipt-${receipt?.blockNumber}-${receipt?.transactionIndex}`
    );

  return {
    notifications,
    createSimpleNotification,
    createTransactionNotification,
    createReceiptNotification,
    removeToast,
  };
};

export { useNotifications };
