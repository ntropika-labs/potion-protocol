<template>
  <div
    class="min-h-screen py-5 font-sans text-dwhite-300 bg-gradient-to-br from-deepBlue to-deepBlack-900 font-medium w-[calc(100vw_-_15px)]"
  >
    <div class="container mx-auto mt-24 px-6 md:px-12">
      <router-view />
    </div>
    <div class="absolute fixed top-0 right-0 z-20 pr-10 pt-10">
      <div
        id="toast-wrap"
        v-auto-animate
        class="flex flex-col items-end justify-start gap-5"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.basic {
  background: linear-gradient(
    113.69deg,
    var(--deep-blue) 23.72%,
    var(--deep-black-900) 81.45%
  );
}
</style>
