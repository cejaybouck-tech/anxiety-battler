<template>
  <section aria-label="Mob selection">
    <UCard class="rounded-3xl bg-white/80 shadow-sm shadow-slate-100">
      <template
        #header
        class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="text-sm font-semibold text-slate-900">Current mob</h2>
          <p class="text-xs text-slate-500">
            Pick a mob to take your anxiety out on.
          </p>
        </div>
      </template>

      <div v-if="player && player.bosses && player.bosses[0]">
        <p>Current boss: {{ player.bosses[0].title }}</p>
      </div>
      <div class="m-4 grid gap-4 md:grid-cols-[1.2fr,1fr]">
        <!-- Current mob card or placeholder -->
        <div class="space-y-3 text-xs">
          <UCard
            v-if="!player || !player.mob"
            class="rounded-2xl border-dashed bg-slate-50/80 text-xs text-slate-600"
          >
            <p>
              No mob selected yet. Choose one from the list to the right to
              start planning an attack.
            </p>
          </UCard>
        </div>

        <!-- Mob list -->
        <div>
          <p
            class="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500"
          >
            Available mobs
          </p>
          <div class="flex flex-wrap justify-center md:justify-around gap-4">
            <MobCard
              v-if="
                player &&
                player.bosses &&
                player.bosses[0] &&
                player.bosses[0].mobs &&
                player.bosses[0].mobs.length > 1
              "
              v-for="(mob, index) in player.bosses[0].mobs"
              :key="mob.id + index"
              class="justify-between rounded-2xl border px-3 py-2 text-left"
              :class="[
                player?.mob &&
                player.mob.title === mob.title &&
                player.mob.id === mob.id
                  ? 'border-sky-400 bg-sky-50 text-slate-900'
                  : 'border-slate-100 bg-slate-50 hover:bg-slate-100',
              ]"
              :mob="mob"
              @click="$emit('select-mob', mob)"
            />
            <UCard
              v-else-if="
                player &&
                player.bosses &&
                player.bosses[0] &&
                player.bosses[0].mobs &&
                player.bosses[0].mobs.length === 0
              "
            >
              <p>No more mobs for this Boss!</p>
              <p class="text-sm mt-4">Still feeling unready and anxious?</p>
              <UButton @click="addNewMob" class="mt-2">Add another mob</UButton>
            </UCard>
            <UButton v-else to="/battle-plan">Create First Boss</UButton>
          </div>
        </div>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { Player, Mob } from "~/types/user-types";
import { createMobs } from "~/util/Utilities";

const props = defineProps<{
  player: Player | undefined;
}>();

const emit = defineEmits<{
  (e: "select-mob", mob: Mob): void;
}>();

const { player } = toRefs(props);

const addNewMob = () => {
  if (!player.value || !player.value.bosses || !player.value.bosses[0]) return;

  player.value.bosses[0].mobs = createMobs(player.value.bosses[0].difficulty);

  localStorage.setItem("player", JSON.stringify(player.value));
};
</script>
