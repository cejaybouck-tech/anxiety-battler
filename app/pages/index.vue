<template>
  <main class="min-h-screen py-6 md:py-10">
    <section
      v-if="player"
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Anxiety Buddy dashboard"
    >
      <!-- Header & timeframe selector -->
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <UBadge color="info" variant="subtle" size="xs">
            Gentle support, one quest at a time
          </UBadge>
          <h1 class="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, <span class="text-sky-600">{{ player.username }}</span>
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Here&apos;s a quick look at how your anxiety has been doing recently.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="mr-1 hidden text-xs md:inline">Timeframe:</span>
            <UButton
              v-for="option in timeframeOptions"
              :key="option.value"
              :color="timeframe === option.value ? 'secondary' : 'neutral'"
              :variant="timeframe === option.value ? 'solid' : 'soft'"
              @click="timeframe = option.value"
            >
              {{ option.label }}
            </UButton>
        </div>
      </header>

      <!-- Top row: Anxiety trend + User card -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Anxiety trend card -->
        <UCard v-if="player.checkins && player.checkins.length > 0" class="md:col-span-2" aria-label="Anxiety trend">
          <div class="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold ">Anxiety trend</h2>
              <p class="text-xs">One check-in per day, last 7 days (example data)</p>
            </div>
            <div class="text-right text-xs ">
              <p>Avg ({{ currentTimeframeLabel }}):
                <span class="font-semibold ">{{ averageAnxiety }}</span>
              </p>
              <p class="mt-0.5">Latest:
                <span :class="latestAnxietyClass" class="ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem]">
                  {{ latestCheckin?.anxiety ?? 0 }} / 100
                </span>
              </p>
            </div>
          </div>

          <!-- Simple bar chart -->
          <div class="mt-2 flex items-end gap-2 rounded-2xl border p-3">
            <div
              v-for="checkin in visibleCheckins"
              :key="checkin.date"
              class="flex flex-1 flex-col items-center gap-1"
            >
              <div class="flex h-28 w-full items-end justify-center">
                <div
                  class="w-6 rounded-full bg-linear-to-t from-sky-300 via-sky-400 to-sky-500 shadow-sm shadow-sky-200"
                  :style="{ height: `${Math.max(checkin.anxiety, 8)}%` }"
                ></div>
              </div>
              <p class="text-[0.65rem] font-medium text-slate-700">
                {{ formatDay(checkin.date) }}
              </p>
              <p class="text-[0.65rem] text-slate-400">
                {{ checkin.anxiety }}
              </p>
            </div>
          </div>
        </UCard>
        <UCard v-else class="md:col-span-2" aria-label="Anxiety trend">You have no checkins saved</UCard>

        <!-- User card -->
        <UCard aria-label="User overview">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold ">Adventurer</h2>
              <p class="text-xs ">Your current stats</p>
            </div>
            <UBadge color="info" variant="subtle" size="xs">
              Level {{ player.level }}
            </UBadge>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between ">
              <span>Username</span>
              <span class="font-medium">{{ player.username }}</span>
            </div>
            <div class="flex items-center justify-between ">
              <span>Experience</span>
              <span class="font-medium">{{ player.experience }} / {{ expToNextLevel }}</span>
            </div>
            <!-- todo: set max to be experience needed until next level -->
            <UProgress v-model="expProgress" color="primary" size="sm" />
            <div class="flex items-center justify-between ">
              <span>Gold</span>
              <span class="inline-flex items-center gap-1 font-semibold text-amber-700">
                <span class="h-2 w-2 rounded-full bg-amber-400"></span>
                {{ player.gold.toLocaleString() }}
              </span>
            </div>
          </div>

          <p class="mt-1 text-[0.7rem] ">
            Every check-in and completed &quot;attack&quot; earns experience and gold over time.
          </p>
        </UCard>
      </div>

      <!-- Upcoming event & recommended attack -->
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Upcoming battle/event -->
        <UCard aria-label="Upcoming event">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold ">Next upcoming battle</h2>
              <p class="text-xs ">Something you&apos;re feeling anxious about and will overcome!</p>
            </div>
            <UBadge
              v-if="upcomingEvent"
              :color="eventDifficultyColor"
              variant="subtle"
              size="xs"
              class="capitalize"
            >
              {{ upcomingEvent.difficulty }}
            </UBadge>
          </div>

          <div v-if="upcomingEvent" class="flex gap-4">
            <div class="hidden h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl  sm:flex">
              <span class="text-2xl">🧪</span>
            </div>
            <div class="space-y-2 text-xs">
              <h3 class="text-sm font-semibold ">
                {{ upcomingEvent.title }}
              </h3>
              <p class="">
                {{ upcomingEvent.desc }}
              </p>
              <p class="text-[0.7rem] ">
                {{ formatDateRange(upcomingEvent.dateStart, upcomingEvent.dateEnd) }}
                · Anxiety attached:
                <span class="font-semibold text-slate-800">{{ upcomingEvent.anxiety }} / 100</span>
              </p>
            </div>
          </div>

          <div v-if="upcomingEvent" class="mt-1 flex flex-wrap items-center gap-1.5 text-[0.7rem] ">
            <span class="mr-1 font-semibold ">Mobs:</span>
            <span
              v-if="upcomingEvent"
              v-for="mob in upcomingEvent.mobs"
              :key="mob.title"
              class="rounded-full bg-slate-50 px-2 py-0.5 "
            >
              {{ mob }}
            </span>
          </div>
          <UButton v-if="!upcomingEvent" to="/battle-plan" color="secondary" class="mt-3" >Set your first boss!</UButton>
        </UCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Boss, Checkin, Difficulty, Player } from '~/types/user-types';
import { navigateTo  } from '#app';
import { getNextLevelExp } from '~/util/Utilities';

//send to creation screen if no user created
onBeforeMount(() => {
  if(import.meta.client){
    const raw = localStorage.getItem('player');

    if(!raw) {
      navigateTo('/login');
      return;
    }

    const storedPlayer: Player = JSON.parse(raw);

    if(!storedPlayer.username || storedPlayer.username === ''){
      navigateTo('/login');
      return;
    }

    player.value = storedPlayer;
    console.log(storedPlayer);
  }
})

const player = ref<Player | undefined>(undefined);
const timeframe = ref<(typeof timeframeOptions)[number]['value']>('week')

const timeframeOptions = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '6 months', value: 'sixMonths' },
  { label: 'Year', value: 'year' }
] as const


// For now, all timeframes use these 7 mocked points
const visibleCheckins = computed(() => player.value?.checkins)

const latestCheckin = computed(() => {
  if(!player.value || !player.value.checkins || player.value.checkins.length < 1) return undefined;
  return player.value.checkins[player.value.checkins.length -1];
})

const averageAnxiety = computed(() => {
  if(!visibleCheckins.value) return 0;
  const total = visibleCheckins.value.reduce((sum, c) => sum + c.anxiety, 0)
  return Math.round(total / visibleCheckins.value.length)
})

const currentTimeframeLabel = computed(
  () => timeframeOptions.find((t) => t.value === timeframe.value)?.label ?? 'Week'
)

const latestAnxietyClass = computed(() => {
  const value = latestCheckin.value?.anxiety
  if (!value) return 'bg-rose-50 text-rose-700 border border-rose-100'
  if (value <= 40) return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
  if (value <= 60) return 'bg-sky-50 text-sky-700 border border-sky-100'
  if (value <= 80) return 'bg-amber-50 text-amber-800 border border-amber-100'
  return 'bg-rose-50 text-rose-700 border border-rose-100'
})

const expToNextLevel = computed(() => {
  if(!player.value) return 100;
  return getNextLevelExp(player.value.level)
})

const expProgress = computed(() => {
  if(!player.value) return 0;
  return Math.min(100, Math.round((player.value?.experience / expToNextLevel.value) * 100))
})

const today = new Date();
const upcomingEvent = computed<Boss | undefined>(() => {
  if(!player.value || !player.value.bosses || player.value.bosses.length < 1) return undefined;
  const closestEvent = player.value.bosses.reduce((prev, curr) => {
  const diffPrev = Math.abs(prev.dateStart.getTime() - today.getTime());
  const diffCurr = Math.abs(curr.dateStart.getTime() - today.getTime());
  return (diffCurr < diffPrev) ? curr : prev;
  })
})

const eventDifficultyColor = computed(() => {
  if(!upcomingEvent.value) return 'success';
  switch (upcomingEvent.value.difficulty) {
    case 'easy':
      return 'success'
    case 'medium':
      return 'info'
    case 'hard':
      return 'warning'
    case 'very_hard':
    case 'panic':
      return 'error'
  }
})

function formatDay(dateISO: string) {
  const date = new Date(dateISO)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

function formatDateRange(start: Date, end: Date) {
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric'
  })

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  })

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`
}
</script>
