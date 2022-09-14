import { createRouter, createWebHistory } from "vue-router";
import { useOnboard } from "@onboard-composable";

import BaseLayout from "@/layouts/BaseLayout.vue";

const EmptyLayout = () => import("@/layouts/EmptyLayout.vue");
const CustomPoolCreation = () => import("@/views/CustomPoolCreation.vue");
const CustomPotionCreation = () => import("@/views/CustomPotionCreation.vue");
const DiscoverPotions = () => import("@/views/DiscoverPotions.vue");
const DiscoverTemplates = () => import("@/views/DiscoverTemplates.vue");
const NotFound = () => import("@/views/NotFound.vue");
const EditPool = () => import("@/views/Pools/EditPool.vue");
const ShowPool = () => import("@/views/Pools/ShowPool.vue");
const ViewPools = () => import("@/views/Pools/ViewPools.vue");
const PoolTemplate = () => import("@/views/PoolTemplate.vue");
const ShowPotion = () => import("@/views/Potions/ShowPotion.vue");
const ViewPotions = () => import("@/views/Potions/ViewPotions.vue");
const BenchmarkPage = () => import("@/views/BenchmarkPage.vue");

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
      path: "/templates/:id",
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
      path: "/buyer/:address",
      name: "buyer",
      component: ViewPotions,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/potions",
      name: "discover-potions",
      component: DiscoverPotions,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/potions/:id",
      name: "show-potion",
      component: ShowPotion,
      meta: { requiredWallet: false, layout: BaseLayout },
    },
    {
      path: "/benchmark",
      name: "benchmark",
      component: BenchmarkPage,
      meta: { requiredWallet: false, layout: BaseLayout },
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
