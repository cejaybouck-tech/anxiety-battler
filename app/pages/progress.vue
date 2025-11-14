<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Progress overview"
    >
      <!-- Header & timeframe selector -->
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="inline-flex items-center justify-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            Progress is built from small, consistent steps
          </p>
          <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Progress
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            A gentle overview of how your anxiety and victories have been evolving over time.
          </p>
        </div>

        <div class="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 p-2 text-xs shadow-sm">
          <span class="mr-1 hidden text-slate-500 md:inline">Timeframe:</span>
          <button
            v-for="option in timeframeOptions"
            :key="option.value"
            type="button"
            class="rounded-full px-3 py-1 font-medium transition-colors"
            :class="[
              timeframe === option.value
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            ]"
            @click="timeframe = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </header>

      <!-- Anxiety trend + improvement insight -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Anxiety trend line graph -->
        <section
          class="md:col-span-2 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Anxiety trend"
        >
          <div class="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Anxiety trend</h2>
              <p class="text-xs text-slate-500">Mocked data to preview how your check-ins will appear.</p>
            </div>
            <div class="text-right text-xs text-slate-500">
              <p>Avg ({{ currentTimeframeLabel }}):
                <span class="font-semibold text-slate-800">{{ averageAnxiety }}</span>
              </p>
              <p class="mt-0.5">Direction:
                <span class="font-semibold" :class="trendClass">
                  {{ trendLabel }}
                </span>
              </p>
            </div>
          </div>

          <!-- Line graph for anxiety -->
          <div class="mt-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
            <div class="relative h-40 w-full">
              <!-- Axis -->
              <div class="absolute inset-0 flex flex-col justify-between text-[0.6rem] text-slate-400">
                <div class="flex items-center gap-2">
                  <span class="w-6 text-right">100</span>
                  <div class="h-px flex-1 bg-slate-200/70"></div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-6 text-right">75</span>
                  <div class="h-px flex-1 bg-slate-200/50"></div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-6 text-right">50</span>
                  <div class="h-px flex-1 bg-slate-200/40"></div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-6 text-right">25</span>
                  <div class="h-px flex-1 bg-slate-200/30"></div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-6 text-right">0</span>
                  <div class="h-px flex-1 bg-slate-200/20"></div>
                </div>
              </div>

              <!-- Polyline built from points -->
              <svg viewBox="0 0 100 40" class="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)]">
                <polyline
                  :points="anxietyPolylinePoints"
                  fill="none"
                  class="stroke-sky-500"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Fill under line -->
                <polygon
                  :points="anxietyFillPoints"
                  class="fill-sky-100/60"
                />
                <circle
                  v-for="(point, idx) in anxietyPoints"
                  :key="idx"
                  :cx="point.x"
                  :cy="point.y"
                  r="1.2"
                  class="fill-white stroke-sky-500"
                  stroke-width="0.6"
                />
              </svg>

              <!-- X-axis labels -->
              <div class="absolute inset-x-3 bottom-0 flex justify-between text-[0.6rem] text-slate-500">
                <span
                  v-for="checkin in visibleCheckins"
                  :key="checkin.date.toISOString()"
                >
                  {{ formatDay(checkin.date) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Improvement / regression insight -->
        <section
          class="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Progress insight"
        >
          <h2 class="text-sm font-semibold text-slate-900">How you&apos;re doing</h2>

          <p class="text-xs text-slate-700">
            {{ trendMessage }}
          </p>

          <div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-[0.75rem] text-slate-700">
            <h3 class="mb-1 text-xs font-semibold text-slate-900">Suggested next step</h3>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(tip, index) in suggestionTips" :key="index">
                {{ tip }}
              </li>
            </ul>
          </div>

          <p class="text-[0.7rem] text-slate-500">
            This is a gentle reflection, not a judgment. Any step you take to care for yourself is
            meaningful progress.
          </p>
        </section>
      </div>

      <!-- Battles, bosses, rewards line graphs -->
      <div class="space-y-6">
        <!-- Battles completed -->
        <section
          class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Battles completed"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Battles completed</h2>
              <p class="text-xs text-slate-500">Number of smaller battles completed over time (mocked).</p>
            </div>
            <p class="text-xs text-slate-500">
              Total ({{ currentTimeframeLabel }}):
              <span class="font-semibold text-slate-800">{{ totalBattles }}</span>
            </p>
          </div>

          <div class="mt-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
            <div class="relative h-32 w-full">
              <svg viewBox="0 0 100 40" class="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)]">
                <polyline
                  :points="battlePolylinePoints"
                  fill="none"
                  class="stroke-emerald-500"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <polygon
                  :points="battleFillPoints"
                  class="fill-emerald-100/60"
                />
                <circle
                  v-for="(point, idx) in battlePoints"
                  :key="idx"
                  :cx="point.x"
                  :cy="point.y"
                  r="1.2"
                  class="fill-white stroke-emerald-500"
                  stroke-width="0.6"
                />
              </svg>
              <div class="absolute inset-x-3 bottom-0 flex justify-between text-[0.6rem] text-slate-500">
                <span v-for="point in battleData" :key="point.label">{{ point.label }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bosses completed -->
        <section
          class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Bosses defeated"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Bosses defeated</h2>
              <p class="text-xs text-slate-500">Bigger, high-anxiety events you&apos;ve gotten through (mocked).</p>
            </div>
            <p class="text-xs text-slate-500">
              Total ({{ currentTimeframeLabel }}):
              <span class="font-semibold text-slate-800">{{ totalBosses }}</span>
            </p>
          </div>

          <div class="mt-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
            <div class="relative h-32 w-full">
              <svg viewBox="0 0 100 40" class="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)]">
                <polyline
                  :points="bossPolylinePoints"
                  fill="none"
                  class="stroke-amber-500"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <polygon
                  :points="bossFillPoints"
                  class="fill-amber-100/60"
                />
                <circle
                  v-for="(point, idx) in bossPoints"
                  :key="idx"
                  :cx="point.x"
                  :cy="point.y"
                  r="1.2"
                  class="fill-white stroke-amber-500"
                  stroke-width="0.6"
                />
              </svg>
              <div class="absolute inset-x-3 bottom-0 flex justify-between text-[0.6rem] text-slate-500">
                <span v-for="point in bossData" :key="point.label">{{ point.label }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Rewards earned -->
        <section
          class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Rewards gained"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Rewards gained</h2>
              <p class="text-xs text-slate-500">Experience and gold earned through your efforts (mocked).</p>
            </div>
            <p class="text-xs text-slate-500">
              This {{ currentTimeframeLabel }}:
              <span class="font-semibold text-sky-700">{{ totalRewards.exp }} exp</span>
              ·
              <span class="font-semibold text-amber-700">{{ totalRewards.gold }} gold</span>
            </p>
          </div>

          <div class="mt-2 grid gap-4 md:grid-cols-2">
            <!-- Exp line graph -->
            <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
              <p class="mb-1 text-[0.7rem] font-semibold text-slate-800">Experience</p>
              <div class="relative h-28 w-full">
                <svg viewBox="0 0 100 40" class="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)]">
                  <polyline
                    :points="expPolylinePoints"
                    fill="none"
                    class="stroke-sky-500"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <polygon
                    :points="expFillPoints"
                    class="fill-sky-100/60"
                  />
                  <circle
                    v-for="(point, idx) in expPoints"
                    :key="idx"
                    :cx="point.x"
                    :cy="point.y"
                    r="1.2"
                    class="fill-white stroke-sky-500"
                    stroke-width="0.6"
                  />
                </svg>
                <div class="absolute inset-x-3 bottom-0 flex justify-between text-[0.6rem] text-slate-500">
                  <span v-for="point in rewardData" :key="point.label">{{ point.label }}</span>
                </div>
              </div>
            </div>

            <!-- Gold line graph -->
            <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
              <p class="mb-1 text-[0.7rem] font-semibold text-slate-800">Gold</p>
              <div class="relative h-28 w-full">
                <svg viewBox="0 0 100 40" class="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)]">
                  <polyline
                    :points="goldPolylinePoints"
                    fill="none"
                    class="stroke-amber-500"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <polygon
                    :points="goldFillPoints"
                    class="fill-amber-100/60"
                  />
                  <circle
                    v-for="(point, idx) in goldPoints"
                    :key="idx"
                    :cx="point.x"
                    :cy="point.y"
                    r="1.2"
                    class="fill-white stroke-amber-500"
                    stroke-width="0.6"
                  />
                </svg>
                <div class="absolute inset-x-3 bottom-0 flex justify-between text-[0.6rem] text-slate-500">
                  <span v-for="point in rewardData" :key="point.label">{{ point.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Player } from '~/types/user-types';
import { navigateTo  } from '#app';


//send to creation screen if no user created
onBeforeMount(() => {
  if(import.meta.client){
    const raw = localStorage.getItem('player');

    if(!raw) {
      navigateTo('/login');
      return;
    }

    const player: Player = JSON.parse(raw);

    if(!player.username || player.username === ''){
      navigateTo('/login');
      return;
    }

    console.log(player);
  }
})

const timeframeOptions = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '6 months', value: 'sixMonths' },
  { label: 'Year', value: 'year' }
] as const

const timeframe = ref<(typeof timeframeOptions)[number]['value']>('week')

// --- Anxiety checkins (reuse idea from dashboard, but keep local here) ---
interface Checkin {
  anxiety: number // 1-100
  description: string
  date: Date
}

const today = new Date()

const baseCheckins: Checkin[] = [
  { anxiety: 72, description: 'Rough morning, lots of racing thoughts.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6) },
  { anxiety: 65, description: 'Better sleep, still a bit tense.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5) },
  { anxiety: 58, description: 'Went for a walk, felt more grounded.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4) },
  { anxiety: 60, description: 'Work emails spiked anxiety a bit.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3) },
  { anxiety: 54, description: 'Tried breathing exercises, helped some.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) },
  { anxiety: 49, description: 'Day felt manageable overall.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1) },
  { anxiety: 45, description: 'Feeling cautiously optimistic today.', date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) }
]

const visibleCheckins = computed(() => baseCheckins)

const currentTimeframeLabel = computed(
  () => timeframeOptions.find((t) => t.value === timeframe.value)?.label ?? 'Week'
)

const averageAnxiety = computed(() => {
  const total = visibleCheckins.value.reduce((sum, c) => sum + c.anxiety, 0)
  return Math.round(total / visibleCheckins.value.length)
})

// Determine simple trend: compare first and last anxiety values
const trend = computed(() => {
  const first = visibleCheckins.value[0]?.anxiety ?? 0
  const last = visibleCheckins.value[visibleCheckins.value.length - 1]?.anxiety ?? 0
  if (last < first - 5) return 'improving'
  if (last > first + 5) return 'rising'
  return 'steady'
})

const trendLabel = computed(() => {
  if (trend.value === 'improving') return 'Improving gently'
  if (trend.value === 'rising') return 'A bit more intense lately'
  return 'Holding steady'
})

const trendClass = computed(() => {
  if (trend.value === 'improving') return 'text-emerald-700'
  if (trend.value === 'rising') return 'text-amber-700'
  return 'text-sky-700'
})

const trendMessage = computed(() => {
  switch (trend.value) {
    case 'improving':
      return 'Your average anxiety has been easing down. That is a real achievement. Keep honoring the small steps and continue using whatever tools are helping you feel safer and more grounded.'
    case 'rising':
      return 'Your anxiety has been a bit more intense recently. This is not a failure—it just means you deserve extra kindness and support. Together we can explore small, manageable actions to ease the load.'
    default:
      return 'Your anxiety has been fairly steady. Staying steady through ups and downs is its own kind of strength. We can gently experiment with new skills while respecting your current capacity.'
  }
})

const suggestionTips = computed(() => {
  switch (trend.value) {
    case 'improving':
      return [
        'Notice what has been helping recently (sleep, movement, boundaries, breathing) and intentionally repeat one of those habits today.',
        'Consider writing a brief note to yourself about a recent win, no matter how small, to read on harder days.'
      ]
    case 'rising':
      return [
        'Choose one very small, specific grounding action for today (for example, a 3-breath pause or a short walk).',
        'If it feels accessible, reach out to someone supportive or jot down what feels heaviest to get it out of your head.'
      ]
    default:
      return [
        'Keep up the routines that help you feel stable—consistency is powerful.',
        'Gently experiment with one new coping strategy (like a body scan, journaling, or a short exposure) and see how it feels.'
      ]
  }
})

// --- Simple line-graph utilities ---
interface Point {
  x: number
  y: number
}

function makeLinePoints(values: number[]): { points: Point[]; polyline: string; fill: string } {
  if (!values.length) return { points: [], polyline: '', fill: '' }

  const max = Math.max(...values, 1)
  const min = 0
  const range = max - min || 1

  const stepX = values.length > 1 ? 100 / (values.length - 1) : 0

  const points: Point[] = values.map((value, index) => {
    const x = stepX * index
    const normalized = (value - min) / range
    const y = 40 - normalized * 35 - 2 // padding from bottom/top
    return { x, y }
  })

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')
  const fill = `0,40 ${polyline} 100,40`
  return { points, polyline, fill }
}

// Anxiety line points
const anxietyValues = computed(() => visibleCheckins.value.map((c) => c.anxiety))

const anxietyGraph = computed(() => makeLinePoints(anxietyValues.value))
const anxietyPoints = computed(() => anxietyGraph.value.points)
const anxietyPolylinePoints = computed(() => anxietyGraph.value.polyline)
const anxietyFillPoints = computed(() => anxietyGraph.value.fill)

function formatDay(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

// --- Battles, bosses, rewards (mocked aggregates) ---
interface AggregatePoint {
  label: string
  value: number
}

const battleData = computed<AggregatePoint[]>(() => [
  { label: 'W1', value: 2 },
  { label: 'W2', value: 3 },
  { label: 'W3', value: 4 },
  { label: 'W4', value: 5 }
])

const bossData = computed<AggregatePoint[]>(() => [
  { label: 'W1', value: 0 },
  { label: 'W2', value: 1 },
  { label: 'W3', value: 1 },
  { label: 'W4', value: 2 }
])

const rewardData = computed<AggregatePoint[]>(() => [
  { label: 'W1', value: 80 },
  { label: 'W2', value: 120 },
  { label: 'W3', value: 160 },
  { label: 'W4', value: 200 }
])

const totalBattles = computed(() => battleData.value.reduce((sum, b) => sum + b.value, 0))
const totalBosses = computed(() => bossData.value.reduce((sum, b) => sum + b.value, 0))

const totalRewards = computed(() => ({
  exp: rewardData.value.reduce((sum, r) => sum + r.value, 0),
  gold: rewardData.value.reduce((sum, r) => sum + Math.round(r.value / 4), 0)
}))

// Map aggregates to line graphs (reuse makeLinePoints)
const battleValues = computed(() => battleData.value.map((b) => b.value))
const bossValues = computed(() => bossData.value.map((b) => b.value))
const expValues = computed(() => rewardData.value.map((r) => r.value))
const goldValues = computed(() => rewardData.value.map((r) => Math.round(r.value / 4)))

const battleGraph = computed(() => makeLinePoints(battleValues.value))
const bossGraph = computed(() => makeLinePoints(bossValues.value))
const expGraph = computed(() => makeLinePoints(expValues.value))
const goldGraph = computed(() => makeLinePoints(goldValues.value))

const battlePoints = computed(() => battleGraph.value.points)
const battlePolylinePoints = computed(() => battleGraph.value.polyline)
const battleFillPoints = computed(() => battleGraph.value.fill)

const bossPoints = computed(() => bossGraph.value.points)
const bossPolylinePoints = computed(() => bossGraph.value.polyline)
const bossFillPoints = computed(() => bossGraph.value.fill)

const expPoints = computed(() => expGraph.value.points)
const expPolylinePoints = computed(() => expGraph.value.polyline)
const expFillPoints = computed(() => expGraph.value.fill)

const goldPoints = computed(() => goldGraph.value.points)
const goldPolylinePoints = computed(() => goldGraph.value.polyline)
const goldFillPoints = computed(() => goldGraph.value.fill)
</script>
