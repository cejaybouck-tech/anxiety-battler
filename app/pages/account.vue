<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Account overview"
    >
      <!-- Header -->
      <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="inline-flex items-center justify-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            You are the hero of this journey
          </p>
          <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Account details
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            A gentle snapshot of your current stats, gear, and anxieties framed as battles you&apos;re preparing for.
          </p>
        </div>
      </header>

      <!-- Top row: core stats + anxiety level -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Stats -->
        <section
          class="md:col-span-2 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Core stats"
        >
          <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Player information</h2>
              <p class="text-xs text-slate-500">These are your current adventure stats.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-700">
                Username: <span class="ml-1 text-slate-900">{{ user.username }}</span>
              </span>
              <span class="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700">
                Level {{ user.level }}
              </span>
            </div>
          </div>

          <dl class="grid gap-4 text-xs md:grid-cols-3">
            <div class="space-y-1">
              <dt class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">Current anxiety</dt>
              <dd class="text-lg font-semibold text-slate-900 flex items-center gap-2">
                {{ user.anxiety }} / 100
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
                  :class="anxietyBadgeClass"
                >
                  {{ anxietyLabel }}
                </span>
              </dd>
              <p class="text-[0.7rem] text-slate-500">
                This is a snapshot, not a grade. It simply helps us shape the right kind of support.
              </p>
            </div>

            <div class="space-y-1">
              <dt class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">Experience</dt>
              <dd class="text-xs text-slate-800">
                <span class="font-semibold">{{ user.experience }}</span>
                /
                <span>{{ 500 }}</span>
              </dd>
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full bg-sky-400"
                  :style="{ width: `${expProgress}%` }"
                ></div>
              </div>
              <p class="text-[0.7rem] text-slate-500">
                {{ expToNextLevel }} exp until level {{ user.level + 1 }}.
              </p>
            </div>

            <div class="space-y-1">
              <dt class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">Gold</dt>
              <dd class="text-lg font-semibold text-amber-700 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-amber-400"></span>
                {{ user.gold.toLocaleString() }}
              </dd>
              <p class="text-[0.7rem] text-slate-500">
                Gold represents energy and rewards you&apos;ve earned for showing up, even when it&apos;s hard.
              </p>
            </div>
          </dl>
        </section>

        <!-- Current mob + next boss summary -->
        <section
          class="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Current challenge overview"
        >
          <div class="space-y-2 text-xs">
            <h2 class="text-sm font-semibold text-slate-900">Current mob</h2>
            <p class="text-slate-700">
              {{ currentMob.title }}
            </p>
            <p class="text-[0.7rem] text-slate-500">
              {{ currentMob.desc }}
            </p>
          </div>

          <div class="mt-2 space-y-2 border-t border-dashed border-slate-200 pt-3 text-xs">
            <h2 class="text-sm font-semibold text-slate-900">Next boss</h2>
            <p class="text-slate-700">
              {{ nextBoss.title }}
            </p>
            <p class="text-[0.7rem] text-slate-500">
              {{ nextBoss.desc }}
            </p>
            <p class="text-[0.7rem] text-slate-500">
              Difficulty:
              <span class="capitalize font-semibold">{{ nextBoss.difficulty }}</span>
              · Anxiety:
              <span class="font-semibold">{{ nextBoss.anxiety }} / 100</span>
            </p>
          </div>
        </section>
      </div>

      <!-- Middle row: character + gear + inventory -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Character + gear slots -->
        <section
          class="md:col-span-2 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Gear"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Gear</h2>
            <p class="text-[0.7rem] text-slate-500">
              Gear is just a playful way to visualize habits and supports that help you.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-[1.2fr,1fr]">
            <!-- Gear grid -->
            <div class="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
              <div
                v-for="slot in gearSlots"
                :key="slot?.title"
                class="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
              >
                <p class="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
                  {{ slot?.slot }}
                </p>
                <p class="text-slate-800 font-medium">
                  {{ slot?.title ?? 'Empty' }}
                </p>
                <p v-if="slot" class="text-[0.7rem] text-slate-500">
                  {{ slot.desc }}
                </p>
              </div>
            </div>

            <!-- Character representation -->
            <div class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div class="flex h-28 w-24 items-center justify-center rounded-2xl bg-slate-100 shadow-inner">
                <div class="relative h-20 w-16">
                  <!-- simple abstract character using shapes / emoji -->
                  <div class="absolute inset-x-2 top-1 h-7 rounded-full bg-sky-200"></div>
                  <div class="absolute inset-x-3 top-2 flex justify-between text-[0.55rem]">
                    <span>◉</span>
                    <span>◉</span>
                  </div>
                  <div class="absolute inset-x-3 top-6 h-10 rounded-xl bg-sky-300"></div>
                  <div class="absolute inset-x-4 top-7 h-7 rounded-xl bg-sky-400/80"></div>
                  <div class="absolute inset-x-5 bottom-1 h-4 rounded-md bg-slate-300"></div>
                </div>
              </div>
              <p class="text-center text-[0.7rem] text-slate-600">
                {{ user.username }} the {{ userTitle }}
              </p>
            </div>
          </div>
        </section>

        <!-- Inventory -->
        <section
          class="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-100"
          aria-label="Inventory"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900">Inventory</h2>
            <p class="text-[0.7rem] text-slate-500">Small tools and supports you can call on.</p>
          </div>

          <div v-if="inventory.length" class="grid gap-2 text-xs sm:grid-cols-2">
            <article
              v-for="item in inventory"
              :key="item.title"
              class="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
            >
              <p class="text-xs font-semibold text-slate-900">
                {{ item.title }}
              </p>
              <p class="text-[0.7rem] text-slate-600">
                {{ item.desc }}
              </p>
            </article>
          </div>

          <p v-else class="text-[0.7rem] text-slate-500">
            Your inventory is empty for now. Over time, we&apos;ll fill it with skills, tools, and reminders
            that support you.
          </p>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Attack, Boss, Gear, GearSlot, Mob, Player } from '~/types/user-types'
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

const user: Player = {
  username: 'AnxiousKnight',
  level: 7,
  anxiety: 52,
  experience: 1450,
  gold: 325,
}

const gearSlots = ref<Gear>({
  head: {
    slot: 'head',
    title: 'Noise-cancelling Headphones',
    desc: 'Helps soften overwhelming noise and gives you a sense of safety.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
  },
  body: {
    slot: 'body',
    title: 'Soft Hoodie of Comfort',
    desc: 'A favourite hoodie that reminds you you&apos;re safe and held.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
    
  },
  cape: {
    slot: 'cape',
    title: 'Noise-cancelling cape',
    desc: 'Helps soften overwhelming noise and gives you a sense of safety.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
  },
  legs: {
    slot: 'legs',
    title: 'Noise-cancelling legs',
    desc: 'Helps soften overwhelming noise and gives you a sense of safety.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
  },
  boots: {
    slot: 'boots',
    title: 'Noise-cancelling boots',
    desc: 'Helps soften overwhelming noise and gives you a sense of safety.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
  },
  weapon: {
    slot: 'weapon',
    title: 'Noise-making sword',
    desc: 'Helps to overwhelm the enemy with noise, someone else can feel stressed.',
    expBoost: 0,
    goldBoost: 0,
    dmgBoost: 0,
  }
})

const inventory = ref<Attack[]>([
  {
    title: '4-6 Breathing Skill',
    desc: 'Inhale for 4, exhale for 6. Repeat gently a few times to calm your body.',
    time: 5*60*1000,//time in milliseconds
    damage: 5,
    level: 1,
    exp: 50,
    baseExpGain: 10,
    steps: ['step 1 breath'],
  },
  {
    title:  'Journaling Page',
    desc: 'A safe place to pour out thoughts without needing to fix them immediately.',
    time: 5*60*1000,//time in milliseconds
    damage: 5,
    level: 1,
    exp: 50,
    baseExpGain: 10,
    steps: ['step 1 breath'],
  },
  {
    title: 'Compassionate Note',
    desc: 'A short note reminding you that struggling does not make you a failure.',
    time: 5*60*1000,//time in milliseconds
    damage: 5,
    level: 1,
    exp: 50,
    baseExpGain: 10,
    steps: ['step 1 breath'],
  }
])

const currentMob: Mob = {
  title: 'Racing Thoughts',
  desc: 'A swarm of what-ifs that shows up when you think about tomorrow or replay the past.',
  difficulty: 'medium',
  reward: {gold: 15, exp: 30},
  health: 500,
}

const nextBoss: Boss = {
  title: 'Presentation to the Dragon Board',
  desc: 'Speaking in front of important people where you want to sound confident, prepared, and like yourself.',
  difficulty: 'very_hard',
  mobs: [currentMob],//todo: change later
  dateStart: new Date('12/5/25'),
  dateEnd: new Date('12/6/25'),
  anxiety: 82
}

const expProgress = computed(() =>
  Math.min(100, Math.round((user.experience / 500) * 100))
)

const expToNextLevel = computed(() => 500 - user.experience)

const anxietyLabel = computed(() => {
  if (user.anxiety <= 35) return 'Calmer zone'
  if (user.anxiety <= 60) return 'Manageable but tense'
  if (user.anxiety <= 80) return 'High but understandable'
  return 'Very intense right now'
})

const anxietyBadgeClass = computed(() => {
  const value = user.anxiety
  if (value <= 35) return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
  if (value <= 60) return 'bg-sky-50 text-sky-700 border border-sky-100'
  if (value <= 80) return 'bg-amber-50 text-amber-800 border border-amber-100'
  return 'bg-rose-50 text-rose-700 border border-rose-100'
})

const userTitle = computed(() => {
  if (user.level < 5) return 'Beginner Adventurer'
  if (user.level < 10) return 'Courageous Explorer'
  if (user.level < 15) return 'Resilient Guardian'
  return 'Seasoned Dragon Tamer'
})
</script>
