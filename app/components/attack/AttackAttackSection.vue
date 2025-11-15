<template>
  <section v-if="player && player.mob" aria-label="Attack options">
    <UCard class="rounded-3xl bg-white/80 shadow-sm shadow-slate-100">
      <template
        #header
        class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="text-sm font-semibold text-slate-900">
            Available attacks
          </h2>
          <p class="text-xs text-slate-500">
            Choose one small, focused action to take against this mob.
          </p>
        </div>
      </template>

      <div class="flex flex-col md:flex-row gap-4">
        <MobCard
          v-if="player && player.mob"
          class="rounded-2xl border-slate-100 bg-slate-50/80"
          :mob="player.mob"
        />
        <!-- Selected attack details -->
        <div
          v-if="selectedAttack"
          class="md:col-span-2 space-y-3 text-xs w-full"
        >
          <div
            class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 class="text-sm font-semibold text-slate-900">
                {{ selectedAttack.title }}
              </h3>
              <p class="text-[0.7rem] text-slate-600">
                {{ selectedAttack.desc }}
              </p>
            </div>
            <div
              class="flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-500"
            >
              <span>
                Target time:
                <span class="font-semibold text-slate-800 text-nowrap">
                  {{ selectedAttack.time / 1000 / 60 }} min
                </span>
              </span>
              <span>
                Damage:
                <span class="font-semibold text-slate-800 text-nowrap">
                  {{ selectedAttack.damage }}
                </span>
              </span>
            </div>
          </div>

          <!-- Steps with checkboxes -->
          <UCard class="rounded-2xl border-slate-100 bg-slate-50/80 p-3">
            <p class="mb-2 text-[0.7rem] font-semibold text-slate-800">Steps</p>
            <ol class="space-y-1">
              <li
                v-for="(step, index) in selectedAttack.steps"
                :key="index"
                class="flex gap-2 text-[0.75rem] text-slate-700"
              >
                <UCheckbox
                  v-model="stepCompletion[index]"
                  :label="step"
                  :name="`step-${index}`"
                  size="xs"
                />
              </li>
            </ol>
          </UCard>

          <!-- Timer controls -->
          <UCard
            class="flex flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/80 p-3 text-[0.75rem] text-slate-700 md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-baseline gap-2">
              <span class="text-[0.7rem] text-slate-500">Timer</span>
              <span class="text-lg font-semibold text-slate-900">
                {{ formattedTime }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton
                type="button"
                color="primary"
                variant="solid"
                size="xs"
                class="rounded-full px-4 py-1.5"
                :disabled="isTimerRunning"
                @click="startTimer"
              >
                ▶ Start
              </UButton>
              <UButton
                type="button"
                color="neutral"
                variant="outline"
                size="xs"
                class="rounded-full px-4 py-1.5"
                :disabled="!isTimerRunning"
                @click="pauseTimer"
              >
                ⏸ Pause
              </UButton>
              <UButton
                type="button"
                color="success"
                variant="soft"
                size="xs"
                class="rounded-full px-4 py-1.5"
                :disabled="elapsedSeconds === 0"
                @click="onFinish"
              >
                ✔ Finish
              </UButton>
            </div>
          </UCard>
        </div>

        <UCard
          v-else
          class="w-full md:col-span-2 rounded-2xl border-dashed bg-slate-50/80 text-[0.75rem] text-slate-600"
        >
          <p>
            Select an attack to see its steps, rewards, and timer. You can
            always keep attacks short and gentle.
          </p>
        </UCard>
      </div>

      <div v-if="player && player.attacks" class="mt-4 flex">
        <!-- Attack list -->
        <div class="flex flex-wrap gap-2 text-xs">
          <UButton
            v-for="attack in player.attacks"
            :key="attack.title"
            color="info"
            variant="soft"
            size="xs"
            class="w-[200px] justify-start rounded-2xl border px-3 py-2 text-left"
            :class="[
              selectedAttack && selectedAttack.title === attack.title
                ? 'border-sky-400 bg-sky-50 text-slate-900'
                : 'border-slate-100 bg-slate-50 hover:bg-slate-100',
            ]"
            @click="selectedAttack = attack"
          >
            <div class="flex flex-col items-start gap-0.5">
              <p class="text-base font-semibold text-slate-900">
                {{ attack.title }}
              </p>
              <p class="text-sm text-slate-600">
                {{ attack.desc }}
              </p>
              <p class="text-slate-500">
                ~{{ attack.time / 1000 / 60 }} min ·
                <span class="capitalize">
                  <UBadge variant="outline" color="info">{{
                    attack.difficulty.replace("_", " ")
                  }}</UBadge>
                </span>
              </p>
              <span class="flex gap-x-2 text-error-500">
                Damage:
                <p>{{ attack.damage }}</p>
              </span>
            </div>
          </UButton>
        </div>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import type { Player, Attack } from "~/types/user-types";

const props = defineProps<{
  player: Player | undefined;
  selectedAttack: Attack | null;
}>();

const emit = defineEmits<{
  (e: "finish-attack"): void;
  (e: "update:selectedAttack", value: Attack | null): void;
}>();

const player = toRef(props, "player");

const selectedAttack = computed<Attack | null>({
  get: () => props.selectedAttack,
  set: (value: Attack | null) => emit("update:selectedAttack", value),
});

const stepCompletion = ref<boolean[]>([]);

// Timer state
const elapsedSeconds = ref(0);
const isTimerRunning = ref(false);
let timerId: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60);
  const seconds = elapsedSeconds.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

watch(
  () => props.selectedAttack,
  (attack) => {
    resetTimer();
    if (attack) {
      stepCompletion.value = attack.steps.map(() => false);
    } else {
      stepCompletion.value = [];
    }
  },
  { immediate: true }
);

function resetTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  isTimerRunning.value = false;
  elapsedSeconds.value = 0;
}

function startTimer() {
  if (!selectedAttack.value || isTimerRunning.value) return;
  isTimerRunning.value = true;
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    elapsedSeconds.value += 1;
  }, 1000);
}

function pauseTimer() {
  if (!isTimerRunning.value) return;
  isTimerRunning.value = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function onFinish() {
  pauseTimer();
  emit("finish-attack");
}
</script>
