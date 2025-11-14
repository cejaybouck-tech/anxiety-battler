<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Battle plan"
    >
      <!-- Header -->
      <header
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <UBadge color="info" variant="subtle" size="md">
            Plan your battles at your own pace
          </UBadge>
          <h1
            class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
          >
            Battle plan
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            A gentle place to map out upcoming events, break them into smaller
            mobs, and choose supportive actions ahead of time.
          </p>
        </div>

        <UButton
          color="primary"
          variant="solid"
          size="sm"
          class="rounded-full"
          @click="openCreateModal()"
        >
          ➕ Add new boss
        </UButton>
      </header>

      <!-- Next upcoming event -->
      <section v-if="nextUpcomingEvent" aria-label="Next upcoming event">
        <UCard class="rounded-3xl shadow-sm shadow-slate-100">
          <div
            class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Next upcoming boss
              </h2>
              <p class="text-xs text-slate-500">
                The event that&apos;s closest on your horizon. You get to
                approach it step by step.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <UBadge
                :color="difficultyColor(nextUpcomingEvent.difficulty)"
                variant="subtle"
                size="xs"
                class="capitalize"
              >
                {{ nextUpcomingEvent.difficulty }}
              </UBadge>
              <UBadge color="neutral" variant="soft" size="xs">
                Anxiety attached:
                <span class="ml-1 font-semibold"
                  >{{ nextUpcomingEvent.anxietyAttached }} / 100</span
                >
              </UBadge>
            </div>
          </div>

          <div class="flex flex-col gap-4 md:flex-row">
            <div class="flex-1 space-y-3 text-xs">
              <h3 class="text-sm font-semibold text-slate-900">
                {{ nextUpcomingEvent.title }}
              </h3>
              <p class="text-slate-700">
                {{ nextUpcomingEvent.description }}
              </p>
              <p class="text-[0.7rem] text-slate-500">
                {{
                  formatDateRange(
                    nextUpcomingEvent.dateStart,
                    nextUpcomingEvent.dateEnd
                  )
                }}
              </p>
            </div>

            <!-- Mobs as cards -->
            <div class="flex-1">
              <p
                class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Mobs to prepare for
              </p>
              <div class="grid gap-2 sm:grid-cols-2">
                <UCard
                  v-for="mob in nextUpcomingEvent.mobs"
                  :key="mob"
                  class="rounded-2xl border-slate-100 bg-slate-50/80 p-3 text-[0.75rem] text-slate-700"
                >
                  <p class="mb-1 text-xs font-semibold text-slate-900">
                    {{ mob }}
                  </p>
                  <p>
                    A piece of this event you can gently plan for. We can turn
                    this into a small, doable "attack" later.
                  </p>
                </UCard>
              </div>
            </div>
          </div>
        </UCard>
      </section>

      <!-- If there is no upcoming event -->
      <section v-else>
        <UCard
          class="rounded-3xl border-dashed bg-white/70 text-center text-sm text-slate-600"
        >
          <p>
            No upcoming bosses yet. When you&apos;re ready, you can add one
            using the "Add new boss" button.
          </p>
        </UCard>
      </section>

      <!-- Events list and edit controls -->
      <section aria-label="Upcoming events list">
        <UCard class="rounded-3xl bg-white/80 shadow-sm shadow-slate-100">
          <div
            class="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                All upcoming bosses
              </h2>
              <p class="text-xs text-slate-500">
                A short list of upcoming events. You can edit details or remove
                ones that no longer apply.
              </p>
            </div>
            <UButton
              color="primary"
              variant="soft"
              size="xs"
              class="rounded-full"
              @click="openCreateModal()"
            >
              ➕ Add new boss
            </UButton>
          </div>

          <div v-if="events.length" class="space-y-2 text-xs">
            <UCard
              v-for="event in sortedEvents"
              :key="event.id"
              class="flex flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/70 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div class="space-y-1">
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ event.title }}
                </h3>
                <p class="line-clamp-2 text-slate-700">
                  {{ event.description }}
                </p>
                <p class="text-[0.7rem] text-slate-500">
                  {{ formatDateRange(event.dateStart, event.dateEnd) }}
                  · Difficulty:
                  <UBadge
                    :color="difficultyColor(event.difficulty)"
                    variant="subtle"
                    size="xs"
                    class="ml-1 capitalize"
                  >
                    {{ event.difficulty }}
                  </UBadge>
                  · Anxiety:
                  <span class="font-semibold"
                    >{{ event.anxietyAttached }} / 100</span
                  >
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
                <UButton
                  color="neutral"
                  variant="outline"
                  size="xs"
                  class="rounded-full"
                  @click="openEditModal(event)"
                >
                  ✏️ Edit
                </UButton>
                <UButton
                  color="error"
                  variant="soft"
                  size="xs"
                  class="rounded-full"
                  @click="removeEvent(event.id)"
                >
                  🗑 Remove
                </UButton>
              </div>
            </UCard>
          </div>

          <p v-else class="text-[0.75rem] text-slate-500">
            You haven&apos;t added any upcoming bosses yet. When you&apos;re
            ready, you can create one above.
          </p>
        </UCard>
      </section>

      <!-- Modal -->
      <UModal
        v-model:open="modalOpen"
        :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
      >
        <template #header class="mb-3 flex">
          <div class="flex flex-col">
            <h2 class="text-sm font-semibold text-slate-900">
              {{ isEditing ? "Edit boss" : "Add new boss" }}
            </h2>
            <p class="text-[0.7rem] text-slate-500">
              You&apos;re allowed to keep this simple. Only fill in what feels
              helpful right now.
            </p>
          </div>
        </template>

        <template #body>
          <UCard>
            <form class="space-y-3 text-xs" @submit.prevent="saveEvent">
              <div class="space-y-1">
                <label
                  class="block text-[0.7rem] font-medium text-slate-700"
                  for="title"
                  >Title</label
                >
                <UInput
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  size="sm"
                  placeholder="e.g. Presentation to the team"
                />
              </div>

              <div class="space-y-1">
                <label
                  class="block text-[0.7rem] font-medium text-slate-700"
                  for="description"
                  >Description</label
                >
                <UTextarea
                  id="description"
                  v-model="form.description"
                  :rows="3"
                  size="sm"
                  placeholder="Briefly describe what this event is and what worries you about it."
                />
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label
                    class="block text-[0.7rem] font-medium text-slate-700"
                    for="start"
                    >Start</label
                  >
                  <UInput
                    id="start"
                    v-model="form.dateStart"
                    type="datetime-local"
                    required
                    size="sm"
                  />
                </div>
                <div class="space-y-1">
                  <label
                    class="block text-[0.7rem] font-medium text-slate-700"
                    for="end"
                    >End</label
                  >
                  <UInput
                    id="end"
                    v-model="form.dateEnd"
                    type="datetime-local"
                    required
                    size="sm"
                  />
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label
                    class="block text-[0.7rem] font-medium text-slate-700"
                    for="difficulty"
                    >Difficulty</label
                  >
                  <USelectMenu
                    id="difficulty"
                    v-model="form.difficulty"
                    :options="difficultyOptions"
                    size="sm"
                  />
                </div>
                <div class="space-y-1">
                  <label
                    class="block text-[0.7rem] font-medium text-slate-700"
                    for="anxiety"
                    >Anxiety attached (1–100)</label
                  >
                  <UInput
                    id="anxiety"
                    v-model.number="form.anxietyAttached"
                    type="number"
                    min="1"
                    max="100"
                    size="sm"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label
                  class="block text-[0.7rem] font-medium text-slate-700"
                  for="mobs"
                  >Mobs (comma separated)</label
                >
                <UInput
                  id="mobs"
                  v-model="form.mobsText"
                  type="text"
                  size="sm"
                  placeholder="e.g. Racing thoughts, Shaky voice, Judging eyes"
                />
              </div>

              <footer class="mt-4 flex items-center justify-between">
                <p class="text-[0.65rem] text-slate-500">
                  You can always come back and adjust this later as things
                  change.
                </p>
                <div class="flex items-center gap-2">
                  <UButton
                    type="button"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    class="rounded-full"
                    @click="closeModal()"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    type="submit"
                    color="primary"
                    variant="solid"
                    size="xs"
                    class="rounded-full"
                  >
                    {{ isEditing ? "Save changes" : "Create boss" }}
                  </UButton>
                </div>
              </footer>
            </form>
          </UCard>
        </template>
      </UModal>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Player } from "~/types/user-types";
import { navigateTo } from "#app";

//send to creation screen if no user created
onBeforeMount(() => {
  if (import.meta.client) {
    const raw = localStorage.getItem("player");

    if (!raw) {
      navigateTo("/login");
      return;
    }

    const player: Player = JSON.parse(raw);

    if (!player.username || player.username === "") {
      navigateTo("/login");
      return;
    }

    console.log(player);
  }
});

type Difficulty = "easy" | "medium" | "hard" | "very hard" | "panic";

const difficultyOptions: Difficulty[] = [
  "easy",
  "medium",
  "hard",
  "very hard",
  "panic",
];

interface Event {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  mobs: string[];
  dateStart: Date;
  dateEnd: Date;
  anxietyAttached: number;
  monsterImg: string;
}

interface EventFormState {
  id: number | null;
  title: string;
  description: string;
  difficulty: Difficulty;
  dateStart: string;
  dateEnd: string;
  anxietyAttached: number;
  mobsText: string;
}

const today = new Date();

const events = ref<Event[]>([
  {
    id: 1,
    title: "Presentation to the Dragon Board",
    description:
      "A big work presentation in front of senior leadership. You want to sound confident, clear, and prepared.",
    difficulty: "very hard",
    mobs: ["Judging eyes", "Blank mind", "Shaky voice"],
    dateStart: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 3,
      9,
      0
    ),
    dateEnd: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 3,
      10,
      0
    ),
    anxietyAttached: 82,
    monsterImg: "",
  },
  {
    id: 2,
    title: "Phone call to schedule a doctor appointment",
    description:
      "Making a call to schedule an appointment you&apos;ve been putting off. You want to sound calm and clear.",
    difficulty: "medium",
    mobs: ["Anticipation", "Fear of saying the wrong thing"],
    dateStart: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      16,
      0
    ),
    dateEnd: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      16,
      30
    ),
    anxietyAttached: 60,
    monsterImg: "",
  },
  {
    id: 3,
    title: "Social gathering with new people",
    description:
      "A small social event where you only know one or two people. You want to stay present and kind to yourself.",
    difficulty: "hard",
    mobs: [
      "Awkward silence",
      "Self-criticism",
      "Being the center of attention",
    ],
    dateStart: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
      18,
      0
    ),
    dateEnd: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
      21,
      0
    ),
    anxietyAttached: 70,
    monsterImg: "",
  },
]);

const sortedEvents = computed(() =>
  [...events.value].sort(
    (a, b) => a.dateStart.getTime() - b.dateStart.getTime()
  )
);

const nextUpcomingEvent = computed(() => {
  const now = new Date().getTime();
  return sortedEvents.value.find((e) => e.dateEnd.getTime() >= now) ?? null;
});

// Modal state
const modalOpen = ref(false);
const isEditing = ref(false);

const emptyForm = (): EventFormState => ({
  id: null,
  title: "",
  description: "",
  difficulty: "medium",
  dateStart: toInputDateTime(new Date()),
  dateEnd: toInputDateTime(new Date(new Date().getTime() + 60 * 60 * 1000)),
  anxietyAttached: 60,
  mobsText: "",
});

const form = ref<EventFormState>(emptyForm());

function openCreateModal() {
  isEditing.value = false;
  form.value = emptyForm();
  modalOpen.value = true;
}

function openEditModal(event: Event) {
  isEditing.value = true;
  form.value = {
    id: event.id,
    title: event.title,
    description: event.description,
    difficulty: event.difficulty,
    dateStart: toInputDateTime(event.dateStart),
    dateEnd: toInputDateTime(event.dateEnd),
    anxietyAttached: event.anxietyAttached,
    mobsText: event.mobs.join(", "),
  };
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

function saveEvent() {
  const mobs = form.value.mobsText
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  const eventData: Omit<Event, "id"> & { id?: number } = {
    id: form.value.id ?? Date.now(),
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    difficulty: form.value.difficulty,
    mobs,
    dateStart: new Date(form.value.dateStart),
    dateEnd: new Date(form.value.dateEnd),
    anxietyAttached: Math.min(
      100,
      Math.max(1, form.value.anxietyAttached || 1)
    ),
    monsterImg: "",
  };

  if (isEditing.value && form.value.id != null) {
    events.value = events.value.map((event) =>
      event.id === form.value.id ? (eventData as Event) : event
    );
  } else {
    events.value.push(eventData as Event);
  }

  modalOpen.value = false;
}

function removeEvent(id: number) {
  events.value = events.value.filter((event) => event.id !== id);
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
    case "very hard":
    case "panic":
      return "error";
  }
}

function toInputDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateRange(start: Date, end: Date) {
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
