<script lang="ts" setup>
import { TabNavigationComponent, BaseCard, SidebarLink } from "potion-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const currentIndex = ref(0);
const navigateBack = () => router.push("/");
</script>

<template>
  <BaseCard>
    <TabNavigationComponent
      :default-index="currentIndex"
      :title="t('your_put_recipe')"
      :inline="true"
      :show-quit-tabs="true"
      @quit-tabs="navigateBack"
    >
      <template #tabs-header>
        <ul
          class="flex flex-col md:flex-row flex-wrap items-start justify-center md:justify-between gap-4 p-6 w-1/3"
        >
          <SidebarLink title="Asset"></SidebarLink>
          <SidebarLink title="Strike Price"></SidebarLink>
          <SidebarLink title="Duration"></SidebarLink>
          <SidebarLink title="Review And Create"></SidebarLink>
        </ul>
      </template>
      <div>
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
