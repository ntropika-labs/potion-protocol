import { createRouter, createWebHistory } from "vue-router";

import BaseLayout from "@/layouts/BaseLayout.vue";
import { useOnboard } from "@onboard-composable";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";

const CustomPoolCreation = () => import("@/views/CustomPoolCreation.vue");
const CustomPotionCreation = () => import("@/views/CustomPotionCreation.vue");
const DiscoverPotions = () => import("@/views/DiscoverPotions.vue");
const DiscoverTemplates = () => import("@/views/DiscoverTemplates.vue");
const DiscoverHedgingVaults = () =>
  import("@/views/Vault/DiscoverHedgingVaults.vue");
const EditPool = () => import("@/views/Pools/EditPool.vue");
//const EmptyLayout = () => import("@/layouts/EmptyLayout.vue");
const HedgingVault = () => import("@/views/HedgingVault.vue");
const NotFound = () => import("@/views/NotFound.vue");
const PoolTemplate = () => import("@/views/PoolTemplate.vue");
const ShowPool = () => import("@/views/Pools/ShowPool.vue");
const ShowPotion = () => import("@/views/Potions/ShowPotion.vue");
const VaultOperator = () => import("@/views/Vault/VaultOperator.vue");
const ViewPools = () => import("@/views/Pools/ViewPools.vue");
const ViewPotions = () => import("@/views/Potions/ViewPotions.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)",
      name: "NotFound",
      component: NotFound,
      meta: { layout: BaseLayout },
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
      meta: { requireWallet: false, layout: BaseLayout, sublink: "pools" },
    },
    {
      path: "/hedging-vaults",
      name: "discover-hedging-vaults",
      component: DiscoverHedgingVaults,
      meta: { requireWallet: false, layout: BaseLayout },
    },
    {
      path: "/hedging-vaults/:id",
      name: "hedging-vault",
      component: HedgingVault,
      meta: { requireWallet: false, layout: BaseLayout },
      beforeEnter: async (to, from, next) => {
        const { vaultId, validVaultId } = useRouteVaultIdentifier(to.params);
        if (!validVaultId) {
          next({ name: "NotFound", params: { pathMatch: "404" } });
        }

        try {
          getContractsFromVault(vaultId.value);
          next();
        } catch {
          next({ name: "NotFound", params: { pathMatch: "404" } });
        }
      },
    },
    {
      path: "/hedging-vaults/:id/operator",
      name: "vault-operator",
      component: VaultOperator,
      meta: { requireWallet: true, layout: BaseLayout },
      beforeEnter: async (to, from, next) => {
        const { vaultId, validVaultId } = useRouteVaultIdentifier(to.params);
        if (!validVaultId) {
          next({ name: "NotFound", params: { pathMatch: "404" } });
        }

        try {
          getContractsFromVault(vaultId.value);
          next();
        } catch {
          next({ name: "NotFound", params: { pathMatch: "404" } });
        }
      },
    },
    {
      path: "/templates/:id",
      name: "pool-template",
      component: PoolTemplate,
      meta: { requireWallet: false, layout: BaseLayout, sublink: "pools" },
    },
    {
      path: "/custom-pool-creation",
      name: "custom-pool-creation",
      component: CustomPoolCreation,
      meta: { requireWallet: false, layout: BaseLayout, sublink: "pools" },
    },
    {
      path: "/custom-potion-creation",
      name: "custom-potion-creation",
      component: CustomPotionCreation,
      meta: { requireWallet: false, layout: BaseLayout, sublink: "potions" },
    },
    {
      path: "/liquidity-provider/:lp",
      name: "liquidity-provider",
      component: ViewPools,
      meta: { requireWallet: true, layout: BaseLayout, sublink: "pools" },
    },
    {
      path: "/liquidity-provider/:lp/:id",
      name: "liquidity-provider-pool",
      component: ShowPool,
      meta: { requiredWallet: false, layout: BaseLayout, sublink: "pools" },
    },
    {
      path: "/liquidity-provider/:lp/:id/edit",
      name: "liquidity-provider-pool-edit",
      component: EditPool,
      meta: { requiredWallet: true, layout: BaseLayout, sublink: "pools" },
      beforeEnter: (to, from, next) => {
        const { connectedWallet } = useOnboard();
        if (
          connectedWallet.value?.accounts[0].address.toLowerCase() !==
          to.params.lp
        ) {
          next({ name: "NotFound", params: { pathMatch: "404" } });
        } else {
          next();
        }
      },
    },
    {
      path: "/buyer/:address",
      name: "buyer",
      component: ViewPotions,
      meta: { requireWallet: false, layout: BaseLayout, sublink: "potions" },
    },
    {
      path: "/potions",
      name: "discover-potions",
      component: DiscoverPotions,
      meta: { requireWallet: false, layout: BaseLayout, sublink: "potions" },
    },
    {
      path: "/potions/:id",
      name: "show-potion",
      component: ShowPotion,
      meta: { requiredWallet: false, layout: BaseLayout, sublink: "potions" },
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
