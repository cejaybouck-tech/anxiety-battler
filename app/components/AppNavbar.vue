<template>
  <nav class="sticky top-0 z-30 border-b border-slate-200 backdrop-blur">
    <div
      class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6"
    >
      <!-- Brand -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <span
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white shadow-sm shadow-sky-200"
        >
          AB
        </span>
        <span class="text-sm font-semibold tracking-tight text-slate-900">
          Anxiety Battler
        </span>
      </NuxtLink>

      <!-- Desktop links -->
      <div
        v-if="playerExists"
        class="hidden items-center gap-2 text-xs md:flex"
      >
        <NuxtLink to="/" class="hover:scale-105 transition duration-200"
          >Dashboard</NuxtLink
        >
        <NuxtLink to="/progress" class="hover:scale-105 transition duration-200"
          >Progress</NuxtLink
        >
        <NuxtLink
          to="/battle-plan"
          class="hover:scale-105 transition duration-200"
          >Battle-plan</NuxtLink
        >
        <NuxtLink to="/account" class="hover:scale-105 transition duration-200"
          >Account</NuxtLink
        >
      </div>

      <div
        v-if="playerExists"
        class="hidden items-center gap-2 text-[0.7rem] text-slate-600 md:flex"
      >
        <UButton to="/attack" variant="solid" color="primary">Attack</UButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import type { Player } from "~/types/user-types";

const playerExists = ref<boolean>(false);

onBeforeMount(() => {
  if (import.meta.client) {
    const raw = localStorage.getItem("player");

    if (!raw) {
      playerExists.value = false;
      return;
    }

    const player: Player = JSON.parse(raw);

    if (!player.username || player.username === "") {
      playerExists.value = false;
      return;
    }

    playerExists.value = true;
    console.log(player);
  }
});
</script>
