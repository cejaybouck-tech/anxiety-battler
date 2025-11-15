<template>
  <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <UBadge color="info" variant="subtle" size="xs">
        One small attack at a time is enough
      </UBadge>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        Attack
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        Choose a mob to work with, pick an attack, and move through the
        steps at a pace that feels doable.
      </p>
    </div>

    <UCard
      v-if="player"
      class="flex flex-col items-end gap-1 border-slate-100 bg-white/80 px-3 py-2 text-right text-[0.7rem] text-slate-500"
    >
      <p class="font-medium text-slate-700">{{ player.username }}</p>
      <p>
        Level {{ player.level }} · {{ player.experience }} exp ·
        {{ player.gold }} gold
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
