<template>
  <section aria-label="Owned attacks">
    <UCard class="rounded-3xl bg-white/80 shadow-sm shadow-slate-100">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">Owned attacks</h2>
          <p class="text-xs text-slate-500">
            These attacks are already in your arsenal. You can use them anytime
            in the Attack page.
          </p>
        </div>
      </div>

      <div v-if="ownedAttacks.length" class="flex gap-2 text-xs">
        <UCard
          v-for="attack in ownedAttacks.sort((a, b) => a.damage - b.damage)"
          :key="attack.title"
          class="flex flex-col gap-1 rounded-2xl border-slate-100 bg-slate-50/80 p-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-900">
              {{ attack.title }}
            </p>
            <p class="text-[0.7rem] text-slate-600 line-clamp-2">
              {{ attack.desc }}
            </p>
            <span class="flex gap-x-2 text-error-500"
              >Damage:
              <p>{{ attack.damage }}</p></span
            >
            <p class="text-[0.65rem] text-slate-500">
              ~{{ Math.round(attack.time / 60000) }} min ·
              <UBadge
                :color="difficultyColor(attack.difficulty)"
                variant="subtle"
                size="xs"
                class="capitalize ml-1"
              >
                {{ attack.difficulty.replace("_", " ") }}
              </UBadge>
            </p>
          </div>
          <UBadge color="success" variant="soft" size="xs"> Owned </UBadge>
        </UCard>
      </div>

      <p v-else class="text-xs text-slate-500">
        You don't own any special attacks yet. Browse the shop below to purchase
        your first one.
      </p>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { Attack, Difficulty } from "~/types/user-types";

const props = defineProps<{
  ownedAttacks: Attack[];
}>();

const { ownedAttacks } = toRefs(props);

function difficultyColor(
  difficulty: Difficulty
): "success" | "info" | "warning" | "error" {
  switch (difficulty) {
    case "easy":
      return "success";
    case "medium":
      return "info";
    case "hard":
      return "warning";
    case "very_hard":
    case "panic":
      return "error";
  }
}
</script>
