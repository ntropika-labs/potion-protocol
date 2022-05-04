import { createRouter, createWebHistory } from "vue-router";

import { useOnboard } from "@/composables/useOnboard";
import BaseLayout from "@/layouts/BaseLayout.vue";
import AboutView from "@/views/AboutView.vue";
import HomeView from "@/views/HomeView.vue";

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
      path: "/about",
      name: "about",
      component: AboutView,
      meta: { requireWallet: true, layout: BaseLayout },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const onboard = useOnboard();
  if (onboard.alreadyConnectedWallets.value.length > 0) {
    if (onboard.onboardState.value.wallets.length === 0) {
      await onboard.connectWallet({
        autoSelect: {
          label: onboard.alreadyConnectedWallets.value[0],
          disableModals: true,
        },
      });
    }
  }
  if (to.meta.requireWallet === true) {
    console.log("serve il wallet");
    if (onboard.onboardState.value.wallets.length === 0) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
