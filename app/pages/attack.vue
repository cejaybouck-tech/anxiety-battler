<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Attack planner"
    >
      <!-- Header -->
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="inline-flex items-center justify-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            One small attack at a time is enough
          </p>
          <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Attack
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Choose a mob to work with, pick an attack, and move through the steps at a pace that feels
            doable.
          </p>
        </div>

        <div class="flex flex-col items-end gap-1 text-right text-[0.7rem] text-slate-500">
          <p class="font-medium text-slate-700">{{ player.username }}</p>
          <p>Level {{ player.level }} · {{ player.experience }} exp · {{ player.gold }} gold</p>
        </div>
      </header>

      <!-- Mob selection & current mob -->
      <section
        class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
        aria-label="Mob selection"
      >
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Current mob</h2>
            <p class="text-xs text-slate-500">
              Pick the anxious thought or situation (mob) you want to gently work with right now.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-[1.2fr,1fr]">
          <!-- Current mob card or placeholder -->
          <div class="space-y-3 text-xs">
            <div
              v-if="currentMob"
              class="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
            >
              <div class="mb-2 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ currentMob.title }}
                </h3>
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-medium capitalize"
                  :class="difficultyBadgeClass(currentMob.difficulty)"
                >
                  {{ currentMob.difficulty.replace('_', ' ') }}
                </span>
              </div>
              <p class="text-slate-700">
                {{ currentMob.desc }}
              </p>
              <p class="mt-2 text-[0.7rem] text-slate-500">
                Health: <span class="font-semibold text-slate-800">{{ currentMob.health }}</span>
              </p>
            </div>
            <div
              v-else
              class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600"
            >
              <p>
                No mob selected yet. Choose one from the list to the right to start planning an attack.
              </p>
            </div>
          </div>

          <!-- Mob list -->
          <div>
            <p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
              Available mobs
            </p>
            <div class="space-y-2 text-xs">
              <button
                v-for="mob in availableMobs"
                :key="mob.title"
                type="button"
                class="w-full rounded-2xl border px-3 py-2 text-left transition-colors"
                :class="[
                  currentMob && currentMob.title === mob.title
                    ? 'border-sky-400 bg-sky-50 text-slate-900'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                ]"
                @click="selectMob(mob)"
              >
                <p class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-900">{{ mob.title }}</span>
                  <span class="text-[0.65rem] text-slate-500 capitalize">
                    {{ mob.difficulty.replace('_', ' ') }}
                  </span>
                </p>
                <p class="mt-1 line-clamp-2 text-[0.7rem] text-slate-600">
                  {{ mob.desc }}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Attack options (only if mob selected) -->
      <section
        v-if="currentMob"
        class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
        aria-label="Attack options"
      >
        <div class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Available attacks</h2>
            <p class="text-xs text-slate-500">
              Choose one small, focused action to take against this mob.
            </p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <!-- Attack list -->
          <div class="space-y-2 text-xs md:col-span-1">
            <button
              v-for="attack in attacks"
              :key="attack.title"
              type="button"
              class="w-full rounded-2xl border px-3 py-2 text-left transition-colors"
              :class="[
                selectedAttack && selectedAttack.title === attack.title
                  ? 'border-sky-400 bg-sky-50 text-slate-900'
                  : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
              ]"
              @click="selectAttack(attack)"
            >
              <p class="text-xs font-semibold text-slate-900">
                {{ attack.title }}
              </p>
              <p class="mt-1 text-[0.7rem] text-slate-600">
                {{ attack.desc }}
              </p>
              <p class="mt-1 text-[0.65rem] text-slate-500">
                ~{{ attack.timeToFinish }} min ·
                <span class="capitalize">{{ attack.difficulty.replace('_', ' ') }}</span>
              </p>
            </button>
          </div>

          <!-- Selected attack details -->
          <div v-if="selectedAttack" class="md:col-span-2 space-y-3 text-xs">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ selectedAttack.title }}
                </h3>
                <p class="text-[0.7rem] text-slate-600">
                  {{ selectedAttack.desc }}
                </p>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-500">
                <span>
                  Target time: <span class="font-semibold text-slate-800">{{ selectedAttack.timeToFinish }} min</span>
                </span>
                <span>
                  Timer: <span class="font-semibold text-slate-800">{{ selectedAttack.timer }} min</span>
                </span>
                <span>
                  Rewards:
                  <span class="font-semibold text-sky-700">{{ selectedAttack.rewards.exp }} exp</span>
                  ·
                  <span class="font-semibold text-amber-700">{{ selectedAttack.rewards.gold }} gold</span>
                </span>
              </div>
            </div>

            <!-- Steps with checkboxes -->
            <div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <p class="mb-2 text-[0.7rem] font-semibold text-slate-800">Steps</p>
              <ol class="space-y-1">
                <li
                  v-for="(step, index) in selectedAttack.steps"
                  :key="index"
                  class="flex gap-2 text-[0.75rem] text-slate-700"
                >
                  <input
                    :id="`step-${index}`"
                    v-model="stepCompletion[index]"
                    type="checkbox"
                    class="mt-px h-3 w-3 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
                  />
                  <label :for="`step-${index}`" class="cursor-pointer">
                    {{ step }}
                  </label>
                </li>
              </ol>
            </div>

            <!-- Timer controls -->
            <div class="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-[0.75rem] text-slate-700 md:flex-row md:items-center md:justify-between">
              <div class="flex items-baseline gap-2">
                <span class="text-[0.7rem] text-slate-500">Timer</span>
                <span class="text-lg font-semibold text-slate-900">
                  {{ formattedTime }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  class="rounded-full bg-sky-500 px-4 py-1.5 text-[0.75rem] font-medium text-white shadow-sm shadow-sky-200 hover:bg-sky-600 disabled:opacity-60"
                  :disabled="isTimerRunning"
                  @click="startTimer"
                >
                  ▶ Start
                </button>
                <button
                  type="button"
                  class="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[0.75rem] font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  :disabled="!isTimerRunning"
                  @click="pauseTimer"
                >
                  ⏸ Pause
                </button>
                <button
                  type="button"
                  class="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[0.75rem] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                  :disabled="elapsedSeconds === 0"
                  @click="finishAttack"
                >
                  ✔ Finish
                </button>
              </div>
            </div>
          </div>

          <div v-else class="md:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-[0.75rem] text-slate-600">
            <p>
              Select an attack to see its steps, rewards, and timer. You can always keep attacks short and
              gentle.
            </p>
          </div>
        </div>
      </section>

      <!-- Anxiety check-in modal after finishing attack -->
      <Teleport to="body">
        <div
          v-if="checkinModalOpen"
          class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 px-4"
          aria-modal="true"
          role="dialog"
        >
          <div class="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10">
            <header class="mb-3">
              <h2 class="text-sm font-semibold text-slate-900">Quick anxiety check-in</h2>
              <p class="text-[0.7rem] text-slate-500">
                After this attack, where does your anxiety feel right now? There are no wrong numbers.
              </p>
            </header>

            <form class="space-y-3 text-xs" @submit.prevent="submitCheckin">
              <div class="space-y-1">
                <label class="block text-[0.7rem] font-medium text-slate-700" for="anxiety">
                  Anxiety level (1–100)
                </label>
                <input
                  id="anxiety"
                  v-model.number="checkinAnxiety"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
                />
              </div>

              <footer class="mt-3 flex items-center justify-between">
                <p class="text-[0.65rem] text-slate-500">
                  Thank you for checking in. This helps your future self.
                </p>
                <button
                  type="submit"
                  class="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-1.5 text-[0.75rem] font-medium text-white shadow-sm shadow-sky-200 hover:bg-sky-600"
                >
                  Save
                </button>
              </footer>
            </form>
          </div>
        </div>
      </Teleport>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Player, Mob, Boss } from '~/types/user-types'
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

type Difficulty = Mob['difficulty']

interface AttackRewards {
  exp: number
  gold: number
}

interface Attack {
  title: string
  desc: string
  steps: string[]
  timeToFinish: number
  timer: number
  rewards: AttackRewards
  difficulty: Difficulty
}

const PLAYER_KEY = 'anxietyBuddy_player'
const CURRENT_MOB_KEY = 'anxietyBuddy_currentMob'
const BOSSES_KEY = 'anxietyBuddy_bosses'

const defaultPlayer: Player = {
  username: 'AnxiousKnight',
  anxiety: 50,
  level: 7,
  experience: 1450,
  gold: 325,
  gear: {
    head: { title: 'Noise-cancelling Headphones', slot: 'head', desc: 'Softens overwhelming sounds.', expBoost: 0, goldBoost: 0, dmgBoost: 1 },
    body: { title: 'Soft Hoodie of Comfort', slot: 'body', desc: 'Keeps you warm and grounded.', expBoost: 0, goldBoost: 0, dmgBoost: 1 },
    cape: { title: 'Cape of Self-Compassion', slot: 'cape', desc: 'Reminds you to speak kindly to yourself.', expBoost: 0, goldBoost: 0, dmgBoost: 1 },
    legs: { title: 'Grounding Walk Pants', slot: 'legs', desc: 'Encourage short, grounding walks.', expBoost: 0, goldBoost: 0, dmgBoost: 1 },
    boots: { title: 'Boots of Small Steps', slot: 'boots', desc: 'Every step counts, even tiny ones.', expBoost: 0, goldBoost: 0, dmgBoost: 1 },
    weapon: { title: 'Notebook of Clarity', slot: 'weapon', desc: 'Helps you put thoughts on paper instead of carrying them alone.', expBoost: 0, goldBoost: 0, dmgBoost: 2 },
  },
  mob: {
    title: 'Racing Thoughts',
    desc: 'A swarm of what-ifs that shows up when you think about tomorrow or replay the past.',
    difficulty: 'medium',
    reward: { gold: 20, exp: 40 },
    health: 100,
  },
  bosses: [],
}

const player = ref<Player>(defaultPlayer)
const currentMob = ref<Mob | undefined>(undefined)
const bosses = ref<Boss[]>([])

// Example attacks
const attacks = ref<Attack[]>([
  {
    title: 'Scout the Mob (Gentle Exposure)',
    desc: 'Spend a few minutes understanding this mob instead of fighting it all at once.',
    steps: [
      'Write down what this mob (anxious thought or situation) actually is in one or two sentences.',
      'List 3 specific things that make it feel hard, without judging yourself.',
    ],
    timeToFinish: 10,
    timer: 5,
    rewards: { exp: 50, gold: 20 },
    difficulty: 'medium',
  },
  {
    title: 'Breath & Body Shield',
    desc: 'Use a short breathing + body check-in to lower intensity before facing the mob.',
    steps: [
      'Do three rounds of 4-6 breathing: inhale 4, exhale 6.',
      'Notice three physical sensations (e.g. feet on floor, back on chair, temperature of the air).',
    ],
    timeToFinish: 8,
    timer: 5,
    rewards: { exp: 40, gold: 15 },
    difficulty: 'easy',
  },
  {
    title: 'Tiny Preparation Attack',
    desc: 'Do the smallest possible preparation step for this mob.',
    steps: [
      'Write down one tiny preparation task (e.g. open the notes app, name the first slide, draft one sentence).',
      'Complete just that one tiny task, then stop and acknowledge that it still counts.',
    ],
    timeToFinish: 12,
    timer: 10,
    rewards: { exp: 60, gold: 25 },
    difficulty: 'hard',
  },
])

const selectedAttack = ref<Attack | null>(null)
const stepCompletion = ref<boolean[]>([])

// Timer state
const elapsedSeconds = ref(0)
const isTimerRunning = ref(false)
let timerId: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60)
  const seconds = elapsedSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

// Anxiety check-in modal
const checkinModalOpen = ref(false)
const checkinAnxiety = ref<number | null>(null)

// --- Local storage helpers ---
function safeParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function loadFromStorage() {
  if (typeof window === 'undefined') return

  const storedPlayer = safeParse<Player>(localStorage.getItem(PLAYER_KEY))
  if (storedPlayer) player.value = {
    ...defaultPlayer,
    ...storedPlayer,
  }

  const storedMob = safeParse<Mob>(localStorage.getItem(CURRENT_MOB_KEY))
  if (storedMob) currentMob.value = storedMob
  else currentMob.value = undefined

  const storedBosses = safeParse<Boss[]>(localStorage.getItem(BOSSES_KEY))
  if (storedBosses) bosses.value = storedBosses
}

function savePlayer() {
  if (typeof window === 'undefined') return
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player.value))
}

function saveCurrentMob() {
  if (typeof window === 'undefined') return
  if (currentMob.value) {
    localStorage.setItem(CURRENT_MOB_KEY, JSON.stringify(currentMob.value))
  } else {
    localStorage.removeItem(CURRENT_MOB_KEY)
  }
}

function saveBosses() {
  if (typeof window === 'undefined') return
  localStorage.setItem(BOSSES_KEY, JSON.stringify(bosses.value))
}

onMounted(() => {
  loadFromStorage()
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

// Available mobs: currentMob plus a couple of examples; you could later load from Bosses
const availableMobs = computed<Mob[]>(() => {
  const baseMobs: Mob[] = [
    {
      title: 'Phone Call Anxiety',
      desc: 'Worry about sounding awkward or being judged when making an important call.',
      difficulty: 'medium',
      reward: { gold: 25, exp: 50 },
      health: 80,
    },
    {
      title: 'Social Gathering Nerves',
      desc: 'Feeling tense about being around new people and small talk.',
      difficulty: 'hard',
      reward: { gold: 40, exp: 70 },
      health: 90,
    },
  ]
  return baseMobs
})

function selectMob(mob: Mob) {
  currentMob.value = { ...mob }
  saveCurrentMob()
}

function selectAttack(attack: Attack) {
  selectedAttack.value = attack
  stepCompletion.value = attack.steps.map(() => false)
  resetTimer()
}

function resetTimer() {
  if (timerId) clearInterval(timerId)
  timerId = null
  isTimerRunning.value = false
  elapsedSeconds.value = 0
}

function startTimer() {
  if (!selectedAttack.value || isTimerRunning.value) return
  isTimerRunning.value = true
  if (timerId) clearInterval(timerId)
  timerId = setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)
}

function pauseTimer() {
  if (!isTimerRunning.value) return
  isTimerRunning.value = false
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function finishAttack() {
  pauseTimer()
  checkinAnxiety.value = player.value.anxiety
  checkinModalOpen.value = true
}

function submitCheckin() {
  if (checkinAnxiety.value == null) return
  // Update player anxiety snapshot
  player.value.anxiety = Math.min(100, Math.max(1, checkinAnxiety.value))

  // Apply attack rewards
  if (selectedAttack.value) {
    player.value.experience += selectedAttack.value.rewards.exp
    player.value.gold += selectedAttack.value.rewards.gold
  }

  // Simple level-up logic (optional, basic)
  if (player.value.experience >= player.value.level * 500) {
    player.value.level += 1
  }

  // Damage mob; if health drops below 0, consider it defeated
  if (currentMob.value) {
    currentMob.value.health = Math.max(0, currentMob.value.health - 25)
    if (currentMob.value.health === 0) {
      // Apply mob reward once defeated
      player.value.experience += currentMob.value.reward.exp
      player.value.gold += currentMob.value.reward.gold
      currentMob.value = undefined
    }
  }

  savePlayer()
  saveCurrentMob()
  saveBosses()

  checkinModalOpen.value = false
  resetTimer()
}

function difficultyBadgeClass(difficulty: Difficulty) {
  switch (difficulty) {
    case 'easy':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'medium':
      return 'bg-sky-50 text-sky-700 border border-sky-100'
    case 'hard':
      return 'bg-amber-50 text-amber-800 border border-amber-100'
    case 'very_hard':
      return 'bg-rose-50 text-rose-700 border border-rose-100'
    case 'panic':
      return 'bg-rose-100 text-rose-800 border border-rose-200'
  }
}
</script>
