<template>
  <UCard
    class="w-[325px] h-[250px] flex flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/70 p-3 md:flex-row md:items-center md:justify-between"
  >
    <div class="space-y-1">
      <div class="flex items-center gap-x-2">
        <!-- Avatar image -->
        <div
          class="relative h-24 w-24 flex-none overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-sky-200"
        >
          <NuxtImg
            :src="'/images/mobs/' + mob.title + '.jpg'"
            alt="Boss avatar"
            class="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-900">
            {{ mob.title }}
          </h3>
          <p class="text-slate-500">{{ mob.health }} / {{ mob.maxHealth }}</p>
        </div>
      </div>
      <div class="mt-4">
        <h3>reward</h3>
        <div class="flex flex-col md:flex-row md:gap-x-2">
          <p class="text-yellow-500">Gold: {{ mob.reward.gold }}</p>
          <p class="text-purple-500">exp: {{ mob.reward.exp }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Mob } from "~/types/user-types";

const props = defineProps<{ mob: Mob }>();
</script>
