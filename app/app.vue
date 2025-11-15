<template>
  <div class="min-h-screen">
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <AppNavbar />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
</script>
