import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import BenchmarkPage from "./views/BenchmarkPage.vue";

const router = createRouter({
  history:
    import.meta.env.VITE_RUNTIME === "electron"
      ? createWebHashHistory()
      : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "benchmark",
      component: BenchmarkPage,
    },
  ],
});

export { router };
