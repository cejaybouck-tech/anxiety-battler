<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Attack planner"
    >
      <AttackHeader :player="player" />
      <AttackAttackSection
        :player="player"
        v-model:selectedAttack="selectedAttack"
        @finish-attack="handleFinishAttack"
      />

      <AttackMobSection :player="player" @select-mob="handleSelectMob" />

      <AttackCheckinModal
        v-model:open="checkinModalOpen"
        v-model:anxiety="checkinAnxiety"
        @submit="submitCheckin"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import type {
  Player,
  Mob,
  Boss,
  Attack,
  Difficulty,
  Checkin,
} from "~/types/user-types";
import { navigateTo } from "#app";
import { getNextLevelExp } from "~/util/Utilities";

//send to creation screen if no user created
onBeforeMount(() => {
  if (import.meta.client) {
    const raw = localStorage.getItem("player");

    if (!raw) {
      navigateTo("/login");
      return;
    }

    const storedPlayer: Player = JSON.parse(raw);

    if (!storedPlayer.username || storedPlayer.username === "") {
      navigateTo("/login");
      return;
    }

    player.value = storedPlayer;
  }
});

const player = ref<Player | undefined>(undefined);
const selectedAttack = ref<Attack | null>(null);

// Anxiety check-in modal
const checkinModalOpen = ref(false);
const checkinAnxiety = ref<number | undefined>(undefined);

function handleSelectMob(mob: Mob) {
  if (!player.value) return;
  player.value.mob = mob;
  // clear any selected attack when changing mobs
  selectedAttack.value = null;
  savePlayer();
}

function handleFinishAttack() {
  if (!player.value) return;
  checkinAnxiety.value = player.value.anxiety;
  checkinModalOpen.value = true;
}

function savePlayer() {
  if (typeof window === "undefined" || !player.value) return;
  localStorage.setItem("player", JSON.stringify(player.value));
}

function submitCheckin() {
  if (checkinAnxiety.value == undefined || !player.value || !player.value.mob)
    return;

  checkinModalOpen.value = false;
  // Update player anxiety snapshot
  const today = new Date().toISOString();
  const newCheckin: Checkin = {
    anxiety: checkinAnxiety.value,
    description: "Attack checkin",
    date: today,
  };
  let newCheckinArray: Checkin[] = [];
  if (player.value.checkins) newCheckinArray = [...player.value.checkins];
  newCheckinArray.push(newCheckin);
  player.value.checkins = newCheckinArray;

  player.value.anxiety = Math.min(100, Math.max(1, checkinAnxiety.value));
  const mob = player.value.mob;

  //mob takes damage
  const damage = selectedAttack.value?.damage;
  player.value.mob.health = Math.max(
    0,
    player.value.mob.health - (damage ?? 10)
  );
  if (player.value.mob.health <= 0) {
    updateBossMobs(mob.id);
    player.value.experience += mob.reward.exp;
    player.value.gold += mob.reward.gold;
    player.value.mob = undefined;
  }

  // Simple level-up logic (optional, basic)
  if (player.value.experience >= getNextLevelExp(player.value.level)) {
    player.value.level += 1;
    player.value.experience = 0;
  }

  savePlayer();

  checkinModalOpen.value = false;
}

const updateBossMobs = (id: number) => {
  let newMobs: Mob[] = [];

  if (!player.value || !player.value.bosses || !player.value.bosses[0]) return;
  if (player.value.bosses[0])
    newMobs = [...player.value.bosses[0].mobs.filter((mob) => mob.id !== id)];
  player.value.bosses[0].mobs = newMobs;
};
</script>
