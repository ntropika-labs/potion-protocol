import { createRouter, createWebHistory } from "vue-router";

import BaseLayout from "@/layouts/BaseLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import AboutView from "@/views/AboutView.vue";
import CustomPoolCreation from "@/views/CustomPoolCreation.vue";
import DiscoverPools from "@/views/DiscoverPools.vue";
import PoolTemplate from "@/views/PoolTemplate.vue";
import HomeView from "@/views/HomeView.vue";
import { useOnboard } from "@onboard-composable";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/pools",
      name: "discover-pools",
      component: DiscoverPools,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/templates/:templateId",
      name: "pool-template",
      component: PoolTemplate,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/custom-pool-creation",
      name: "custom-pool-creation",
      component: CustomPoolCreation,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: { requireWallet: true, layout: EmptyLayout },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const {
    alreadyConnectedWallets,
    connectedWallet,
    lastConnectionTimestamp,
    connectWallet,
  } = useOnboard();

  const timestamp = Date.now();
  const diff = timestamp - lastConnectionTimestamp.value;
  const minutes = Math.floor(diff / 60000);
  if (minutes <= 6) {
    if (
      alreadyConnectedWallets.value.length > 0 &&
      connectedWallet.value === null
    ) {
      await connectWallet({
        autoSelect: {
          label: alreadyConnectedWallets.value[0],
          disableModals: true,
        },
      });
    }
  }
  if (to.meta.requireWallet === true) {
    console.info("This page requires a connected wallet");
    if (connectedWallet.value !== null) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
