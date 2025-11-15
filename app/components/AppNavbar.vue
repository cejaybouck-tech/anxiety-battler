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
      <div class="hidden items-center gap-2 text-xs md:flex">
        <NuxtLink to="/" class="hover:scale-105 transition duration-200"
          ><UBadge
            variant="soft"
            color="neutral"
            icon="material-symbols:dashboard"
            >Dashboard</UBadge
          ></NuxtLink
        >
        <NuxtLink
          to="/battle-plan"
          class="hover:scale-105 transition duration-200"
          ><UBadge variant="soft" color="neutral" icon="ri:sword-fill"
            >Battle-plan</UBadge
          ></NuxtLink
        >
        <NuxtLink to="/shop" class="hover:scale-105 transition duration-200"
          ><UBadge variant="soft" color="neutral" icon="solar:shop-bold"
            >Shop</UBadge
          ></NuxtLink
        >
        <NuxtLink to="/progress" class="hover:scale-105 transition duration-200"
          ><UBadge variant="soft" color="neutral" icon="simple-icons:progress"
            >Progress</UBadge
          ></NuxtLink
        >
        <NuxtLink to="/account" class="hover:scale-105 transition duration-200"
          ><UBadge variant="soft" color="neutral" icon="mdi:account"
            >Account</UBadge
          ></NuxtLink
        >
      </div>

      <!-- Desktop attack button -->
      <div
        class="hidden items-center gap-2 text-[0.7rem] text-slate-600 md:flex"
      >
        <UButton to="/attack" variant="solid" color="primary">Attack</UButton>
      </div>

      <!-- Mobile menu button -->
      <div class="flex items-center gap-2 md:hidden">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          size="xs"
          aria-label="Toggle navigation menu"
          @click="mobileOpen = !mobileOpen"
        />
      </div>
    </div>

    <!-- Mobile menu -->
    <transition name="fade-slide">
      <div
        v-if="mobileOpen"
        class="border-t border-slate-200 bg-white/95 md:hidden"
      >
        <div
          class="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3 text-sm"
        >
          <NuxtLink
            to="/"
            class="rounded-full px-3 py-1.5 text-left hover:bg-slate-100"
            @click="mobileOpen = false"
          >
            <UBadge
              variant="soft"
              color="neutral"
              icon="material-symbols:dashboard"
              >Dashboard</UBadge
            >
          </NuxtLink>
          <NuxtLink
            to="/battle-plan"
            class="rounded-full px-3 py-1.5 text-left hover:bg-slate-100"
            @click="mobileOpen = false"
          >
            <UBadge variant="soft" color="neutral" icon="ri:sword-fill"
              >Battle-plan</UBadge
            >
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="rounded-full px-3 py-1.5 text-left hover:bg-slate-100"
            @click="mobileOpen = false"
          >
            <UBadge variant="soft" color="neutral" icon="solar:shop-bold"
              >Shop</UBadge
            >
          </NuxtLink>
          <NuxtLink
            to="/progress"
            class="rounded-full px-3 py-1.5 text-left hover:bg-slate-100"
            @click="mobileOpen = false"
          >
            <UBadge variant="soft" color="neutral" icon="simple-icons:progress"
              >Progress</UBadge
            >
          </NuxtLink>
          <NuxtLink
            to="/account"
            class="rounded-full px-3 py-1.5 text-left hover:bg-slate-100"
            @click="mobileOpen = false"
          >
            <UBadge variant="soft" color="neutral" icon="mdi:account"
              >Account</UBadge
            >
          </NuxtLink>

          <div class="mt-2">
            <UButton
              to="/attack"
              block
              color="primary"
              variant="solid"
              size="sm"
              class="rounded-full"
              @click="mobileOpen = false"
            >
              Attack
            </UButton>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
