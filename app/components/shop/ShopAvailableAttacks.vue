<template>
  <section aria-label="Available attacks">
    <UCard class="rounded-3xl bg-white/80 shadow-sm shadow-slate-100">
      <div class="mb-3 flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Attacks in the shop
          </h2>
          <p class="text-xs text-slate-500">
            Buy new attacks using gold. Prices scale with difficulty.
          </p>
        </div>
      </div>

      <div
        v-if="attacks.length"
        class="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-xs"
      >
        <UCard
          v-for="attack in attacks.sort(
            (a, b) => attackCost(a.difficulty) - attackCost(b.difficulty)
          )"
          :key="attack.title"
          class="flex h-full flex-col justify-between rounded-2xl border-slate-100 bg-slate-50/80 p-3"
        >
          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-900">
              {{ attack.title }}
            </p>
            <p class="text-[0.7rem] text-slate-600 line-clamp-3">
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

          <div class="mt-2 flex items-center justify-between">
            <span class="text-[0.75rem] text-slate-700">
              Cost:
              <span class="font-semibold text-amber-600">
                {{ attackCost(attack.difficulty) }} gold
              </span>
            </span>
            <UButton
              :color="canAfford(attack) ? 'primary' : 'error'"
              variant="solid"
              size="xs"
              class="rounded-full"
              :disabled="!canAfford(attack)"
              @click="$emit('buy', attack)"
            >
              <span v-if="canAfford(attack)">Buy</span>
              <span v-else>Not enough gold</span>
            </UButton>
          </div>
        </UCard>
      </div>

      <p v-else class="text-xs text-slate-500">
        You've purchased all available attacks. Nice work expanding your
        toolkit!
      </p>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { Attack, Difficulty } from "~/types/user-types";

const props = defineProps<{
  attacks: Attack[];
  playerGold: number;
}>();

const emit = defineEmits<{
  (e: "buy", attack: Attack): void;
}>();

const { attacks, playerGold } = toRefs(props);

function attackCost(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 50;
    case "medium":
      return 100;
    case "hard":
      return 150;
    case "very_hard":
      return 200;
    case "panic":
      return 250;
  }
}

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

function canAfford(attack: Attack): boolean {
  return playerGold.value >= attackCost(attack.difficulty as Difficulty);
}
</script>
