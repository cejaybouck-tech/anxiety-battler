<template>
  <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <UBadge color="info" variant="subtle" size="xs">
        Trade your gold for new ways to fight anxiety
      </UBadge>
      <h1
        class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
      >
        Shop
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        Unlock new "attacks"—practical tools and exercises—to expand your toolkit
        against anxious thoughts.
      </p>
    </div>

    <UCard
      v-if="player"
      class="flex flex-col items-end gap-1 border-slate-100 bg-white/80 px-3 py-2 text-right text-[0.8rem] text-slate-500"
    >
      <p class="text-xs font-semibold text-slate-700">Your gold</p>
      <p class="text-lg font-semibold text-amber-600">
        {{ player.gold.toLocaleString() }}
      </p>
    </UCard>
  </header>
</template>

<script setup lang="ts">
import type { Player } from '~/types/user-types'

const props = defineProps<{
  player: Player | undefined
}>()

const { player } = toRefs(props)
</script>
