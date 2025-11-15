<template>
  <div>
    <h2 class="text-lg font-semibold text-slate-900">Next upcoming boss</h2>
    <p class="text-xs text-slate-600">
      The event that's closest on your horizon. You get to approach it step by
      step.
    </p>
  </div>
  <section v-if="boss" aria-label="Next upcoming event">
    <UCard class="rounded-3xl shadow-sm shadow-slate-100">
      <template #header>
        <div class="mb-4 flex md:justify-between gap-3">
          <div class="flex flex-col md:flex-row gap-3">
            <!-- Avatar image -->
            <div
              class="relative h-24 w-24 flex-none overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-sky-200"
            >
              <NuxtImg
                :src="boss.image"
                alt="Boss avatar"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- Title and description -->

            <div class="flex-1 space-y-3 text-xs">
              <h3 class="text-sm font-semibold text-slate-900">
                {{ boss.title }}
              </h3>
              <p class="text-slate-700">
                {{ boss.desc }}
              </p>
              <p class="text-sm text-slate-500">
                {{ formatDateRange(boss.dateStart, boss.dateEnd) }}
              </p>
              <UButton to="/attack">Attack!</UButton>
            </div>
          </div>

          <!-- Badges -->
          <div class="flex flex-col items-end gap-2 text-xs">
            <UBadge
              :color="difficultyColor(boss.difficulty)"
              variant="subtle"
              class="capitalize"
            >
              {{ boss.difficulty.replaceAll("_", " ") }}
            </UBadge>
            <UBadge color="neutral" variant="soft">
              Anxiety:
              <span class="ml-1 font-semibold text-nowrap"
                >{{ boss.anxiety }} / 100</span
              >
            </UBadge>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-4 md:flex-row">
        <!-- Mobs as cards -->
        <div class="flex-1">
          <p
            class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Mobs to train on in preperation for the boss
          </p>
          <div class="flex flex-wrap gap-2">
            <MobCard
              v-for="(mob, index) in boss.mobs"
              :key="mob.title + '-' + index"
              class="w-[300px] h-[250px] flex flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/70 p-3 md:flex-row md:items-center md:justify-between"
              :mob="mob"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-x-2">
                  <!-- Avatar image -->
                  <div
                    class="relative h-24 w-24 flex-none overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-sky-200"
                  >
                    <NuxtImg
                      src="/images/bosses/dragon.jpg"
                      alt="Boss avatar"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-slate-900">
                      {{ mob.title }}
                    </h3>
                    <p class="text-slate-500">
                      {{ mob.health }} / {{ mob.maxHealth }}
                    </p>
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
            </MobCard>
          </div>
        </div>
      </div>
    </UCard>
  </section>
  <section v-else>
    <UCard
      class="rounded-3xl border-dashed bg-white/70 text-center text-sm text-slate-600"
    >
      <p>
        No upcoming bosses yet. When you're ready, you can add one using the
        "Add new boss" button.
      </p>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { Boss } from "~/types/user-types";

const props = defineProps<{
  boss: Boss | undefined;
  formatDateRange: (start: string, end: string) => string;
  difficultyColor: (
    difficulty: any
  ) => "success" | "info" | "warning" | "error";
}>();

const { boss, formatDateRange, difficultyColor } = toRefs(props);
</script>
