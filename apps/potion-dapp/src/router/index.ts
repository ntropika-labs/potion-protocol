import { createRouter, createWebHistory } from "vue-router";

import { useOnboard } from "@/composables/useOnboard";
import BaseLayout from "@/layouts/BaseLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
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
      meta: { requireWallet: false, layout: EmptyLayout },
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
    if (alreadyConnectedWallets.value.length > 0) {
      if (connectedWallet.value !== null) {
        await connectWallet({
          autoSelect: {
            label: alreadyConnectedWallets.value[0],
            disableModals: true,
          },
        });
      }
    }
  }
  if (to.meta.requireWallet === true) {
    console.info("This page requires a connected wallet");
    if (connectedWallet.value !== null) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
