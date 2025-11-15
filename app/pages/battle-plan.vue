<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Battle plan"
    >
      <BattlePlanHeader @add-boss="openCreateModal" />

      <BattlePlanNextBoss
        :boss="nextUpcomingEvent"
        :format-date-range="formatDateRange"
        :difficulty-color="difficultyColor"
      />

      <BattlePlanBossList
        :bosses="player?.bosses"
        :format-date-range="formatDateRange"
        :difficulty-color="difficultyColor"
        @add-boss="openCreateModal"
        @edit-boss="openEditModal"
        @remove-boss="removeEvent"
      />

      <BattlePlanBossModal
        v-model:modalOpen="modalOpen"
        :editing-event="editingEvent"
        @save-event="handleSaveEvent"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Boss, Difficulty, Player } from "~/types/user-types";
import { navigateTo } from "#app";

const player = ref<Player | undefined>(undefined);

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

const today = new Date();

const sortedEvents = computed(() => {
  if (!player.value || !player.value.bosses || player.value.bosses.length < 1)
    return [];

  return [...player.value?.bosses].sort(
    (a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
  );
});

const nextUpcomingEvent = computed(() => {
  const now = new Date().getTime();
  if (sortedEvents.value.length < 1) return undefined;
  return (
    sortedEvents.value.find((e) => new Date(e.dateEnd).getTime() >= now) ??
    undefined
  );
});

// Modal state
const modalOpen = ref<boolean>(false);
const editingEvent = ref<Boss | undefined>(undefined);

function openCreateModal() {
  editingEvent.value = undefined;
  modalOpen.value = true;
}

function openEditModal(event: Boss) {
  editingEvent.value = event;
  modalOpen.value = true;
}

function handleSaveEvent(saved: Boss) {
  if (!player.value) return;

  const bosses: Boss[] = player.value.bosses ? [...player.value.bosses] : [];

  const index = bosses.findIndex((b) => b.id === saved.id);
  if (index !== -1) {
    bosses.splice(index, 1, saved);
  } else {
    // assign a new id if this is a fresh boss
    const maxId = bosses.length ? Math.max(...bosses.map((b) => b.id)) : 0;
    saved.id = maxId + 1;
    bosses.push(saved);
  }

  player.value.bosses = bosses;
  localStorage.setItem("player", JSON.stringify(player.value));
  modalOpen.value = false;
}

function removeEvent(removeId: number) {
  if (!player.value) return;
  let newBosses: Boss[] = [];

  if (player.value.bosses)
    newBosses = [...player.value.bosses.filter((boss) => boss.id !== removeId)];
  player.value.bosses = newBosses;
  localStorage.setItem("player", JSON.stringify(player.value));
  modalOpen.value = false;
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

function formatDateRange(startRaw: string, endRaw: string) {
  const start = new Date(startRaw);
  const end = new Date(endRaw);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}
</script>
