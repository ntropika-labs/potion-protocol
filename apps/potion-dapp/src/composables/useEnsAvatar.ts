import type { Ref } from "vue";
import makeBlockie from "ethereum-blockies-base64";
import { $fetch } from "ohmyfetch";
import { isRef, ref, unref } from "vue";

import { isAddress } from "@ethersproject/address";
import { debouncedWatch } from "@vueuse/core";

const Status = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useEnsAvatar(ensOrAddress: string | Ref<string>) {
  const status = ref(Status.IDLE);
  const image = ref("");

  const _getAvatarImageUrl = async (ensAddress: string) => {
    const ensImageUrl = `https://metadata.ens.domains/mainnet/avatar/${ensAddress}`;
    try {
      await $fetch(ensImageUrl);
      return ensImageUrl;
    } catch (error) {
      console.info("ENS avatar not found");
      return "";
    }
  };

  async function getAvatarImageUrl() {
    status.value = Status.RUNNING;
    if (isAddress(unref(ensOrAddress))) {
      image.value = makeBlockie(unref(ensOrAddress));
      status.value = Status.SUCCESS;
    } else {
      image.value = await _getAvatarImageUrl(unref(ensOrAddress));
      status.value = Status.SUCCESS;
    }
  }

  if (isRef(ensOrAddress)) {
    debouncedWatch(
      ensOrAddress,
      async () => {
        await getAvatarImageUrl();
      },
      { debounce: 1000 }
    );
  }

  return {
    status,
    image,
    getAvatarImageUrl,
  };
}
