import { createRouter, createWebHistory } from "vue-router";

import BaseLayout from "@/layouts/BaseLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import CustomPoolCreation from "@/views/CustomPoolCreation.vue";
import CustomPotionCreation from "@/views/CustomPotionCreation.vue";
import DiscoverPotions from "@/views/DiscoverPotions.vue";
import DiscoverTemplates from "@/views/DiscoverTemplates.vue";
import NotFound from "@/views/NotFound.vue";
import EditPool from "@/views/Pools/EditPool.vue";
import ShowPool from "@/views/Pools/ShowPool.vue";
import ViewPools from "@/views/Pools/ViewPools.vue";
import PoolTemplate from "@/views/PoolTemplate.vue";
import { useOnboard } from "@onboard-composable";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
      meta: { layout: EmptyLayout },
    },
    {
      path: "/",
      name: "home",
      redirect: { name: "discover-potions" },
    },
    {
      path: "/templates",
      name: "discover-templates",
      component: DiscoverTemplates,
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
      path: "/custom-potion-creation",
      name: "custom-potion-creation",
      component: CustomPotionCreation,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/liquidity-provider/:lp",
      name: "liquidity-provider",
      component: ViewPools,
      meta: { requireWallet: true, layout: BaseLayout },
    },
    {
      path: "/liquidity-provider/:lp/:id",
      name: "liquidity-provider-pool",
      component: ShowPool,
      meta: { requiredWallet: false, layout: BaseLayout },
    },
    {
      path: "/liquidity-provider/:lp/:id/edit",
      name: "liquidity-provider-pool-edit",
      component: EditPool,
      meta: { requiredWallet: true, layout: BaseLayout },
      beforeEnter: (to, from, next) => {
        const { connectedWallet } = useOnboard();
        if (
          connectedWallet.value?.accounts[0].address.toLowerCase() !==
          to.params.lp
        ) {
          next({ name: "NotFound" });
        } else {
          next();
        }
      },
    },
    {
      path: "/potions",
      name: "discover-potions",
      component: DiscoverPotions,
      meta: { requireWallet: false, layout: BaseLayout },
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
