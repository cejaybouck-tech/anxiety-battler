<template>
  <main class="min-h-screen flex items-center justify-center px-4 py-10">
    <section
      class="mx-auto flex justify-center items-center w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
    >
      <UCard class="max-w-md" aria-label="Create your adventurer">
        <template #header class="space-y-1 text-center">
          <UBadge color="info" variant="subtle" size="xs">
            Welcome to Anxiety Buddy
          </UBadge>
          <h1 class="text-2xl font-semibold tracking-tight">
            Create your adventurer
          </h1>
          <p class="text-sm text-slate-600">
            Choose a username and tell us how your anxiety feels right now.
            We'll use this to start tracking your progress as you fight back
            against anxiety.
          </p>
        </template>

        <form class="space-y-4" @submit.prevent="onSave">
          <!-- Username -->
          <div class="space-y-1">
            <label
              for="username"
              class="block text-sm font-medium text-slate-800"
            >
              Create a username
            </label>
            <UInput
              id="username"
              v-model="username"
              placeholder="e.g. BraveMage42"
              size="md"
              :ui="{ base: 'font-mono' }"
              autocomplete="off"
            />
          </div>

          <!-- Current anxiety rating -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <label for="anxiety" class="font-medium text-slate-800">
                How is your anxiety right now?
              </label>
              <span class="text-xs text-slate-600">{{ anxiety }} / 100</span>
            </div>
            <input
              id="anxiety"
              v-model.number="anxiety"
              type="range"
              min="1"
              max="100"
              class="w-full cursor-pointer"
            />
            <div class="flex justify-between text-[0.7rem] text-slate-500">
              <span>Very calm</span>
              <span>Very anxious</span>
            </div>
          </div>

          <!-- Error message -->
          <p v-if="error" class="text-xs text-rose-600">
            {{ error }}
          </p>

          <!-- Submit -->
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            class="w-full justify-center"
          >
            Fight back against anxiety
          </UButton>
        </form>

        <p class="text-[0.7rem] text-slate-500 text-center">
          You can always change your username and stats later in the Account
          page.
        </p>
      </UCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Player, Gear } from "~/types/user-types";

const router = useRouter();

const username = ref("");
const anxiety = ref(50);
const error = ref("");

onMounted(() => {
  // If a player already exists, send them to the dashboard
  if (import.meta.client) {
    const stored = localStorage.getItem("player");
    if (stored) {
      router.push("/");
    }
  }
});

function onSave() {
  error.value = "";

  const name = username.value.trim();
  if (!name) {
    error.value = "Please choose a username to get started.";
    return;
  }

  if (anxiety.value < 1 || anxiety.value > 100) {
    error.value = "Your anxiety rating must be between 1 and 100.";
    return;
  }

  const emptyGear: Gear = {
    head: undefined,
    body: undefined,
    cape: undefined,
    legs: undefined,
    boots: undefined,
    weapon: undefined,
  };

  if (import.meta.client) {
    const today = new Date();
    const newPlayer: Player = {
      username: name,
      anxiety: anxiety.value,
      level: 1,
      experience: 0,
      gold: 0,
      gear: emptyGear,
      mob: undefined,
      bosses: [],
      attacks: [
        {
          title: "4-7-8 Breathing",
          desc: "A deep breathing method that activates the parasympathetic nervous system by extending the exhale longer than the inhale, rapidly lowering heart rate and cortisol.",
          time: 60000,
          damage: 10,
          level: 1,
          exp: 0,
          steps: [
            "Sit or stand comfortably with one hand on your belly.",
            "Inhale quietly through your nose for a count of 4 seconds.",
            "Hold your breath for a count of 7 seconds.",
            "Exhale completely through your mouth for 8 seconds, making a soft 'whoosh' sound.",
            "Repeat this cycle 4 times for immediate calming effect.",
          ],
          timer: 60000,
          difficulty: "easy",
        },
      ],
      checkins: [
        {
          anxiety: anxiety.value,
          description: "First checkin",
          date: today.toISOString(),
        },
      ],
    };
    localStorage.setItem("player", JSON.stringify(newPlayer));
  }

  router.push("/");
}
</script>
