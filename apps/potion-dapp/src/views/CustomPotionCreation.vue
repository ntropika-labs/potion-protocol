<script lang="ts" setup>
import { TabNavigationComponent, BaseCard, SidebarLink } from "potion-ui";
import { SrcsetEnum } from "dapp-types";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const currentIndex = ref(0);
const navigateBack = () => router.push("/");

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
      disabled: true,
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
</script>

<template>
  <BaseCard>
    <TabNavigationComponent
      inner-classes="flex flex-col w-full xl:flex-row p-6 gap-4"
      content-classes="w-full xl:w-2/3"
      :default-index="currentIndex"
      :title="t('your_put_recipe')"
      :inline="true"
      :show-quit-tabs="true"
      @quit-tabs="navigateBack"
    >
      <template #tabs-header>
        <ul
          class="flex flex-col gap-4 w-full lg:( flex-row gap-2 justify-center items-stretch ) xl:( flex-col gap-4 w-1/3 ) items-start justify-center"
        >
          <SidebarLink
            v-for="(item, index) in sidebarItems"
            :key="`sidebar-item-${index}`"
            :title="item.title"
            :selected="item.selected"
            :disabled="item.disabled"
            :icon-srcset="item.iconSrcset"
            class="lg:w-1/4 lg:w-full"
          ></SidebarLink>
        </ul>
      </template>
      <div class="w-full">
        <h3 class="text-center">Choose asset</h3>
      </div>
      <div>
        <h3 class="text-center">Strike price</h3>
      </div>
      <div>
        <h3 class="text-center">Duration</h3>
      </div>
      <div>
        <h3 class="text-center">Review and create</h3>
      </div>
    </TabNavigationComponent>
  </BaseCard>
</template>
