import { createRouter, createWebHistory } from "vue-router";
import BenchmarkPage from "./views/BenchmarkPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "benchmark",
      component: BenchmarkPage,
    },
  ],
});

export { router };
