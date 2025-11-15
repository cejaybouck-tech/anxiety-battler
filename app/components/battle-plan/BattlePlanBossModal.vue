<template>
  <UModal title="hello" v-model:open="internalOpen">
    <template #content>
      <UCard>
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">
              {{ isEditing ? "Edit boss" : "Add new boss" }}
            </h2>
            <p class="text-[0.7rem] text-slate-500">
              You're allowed to keep this simple. Only fill in what feels
              helpful right now.
            </p>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="neutral"
            size="xs"
            class="rounded-full"
            @click="internalOpen = false"
          />
        </div>
        <USeparator></USeparator>
        <form class="mt-3 space-y-3 text-xs" @submit.prevent="onSave">
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
              placeholder="e.g. Presentation to the team"
              class="w-full"
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
              placeholder="Briefly describe what this event is and what worries you about it."
              class="w-full"
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
              <USelect
                id="difficulty"
                v-model="form.difficulty"
                :items="difficultyOptions"
              />
            </div>
            <div class="flex flex-col space-y-1">
              <label
                class="block text-[0.7rem] font-medium text-slate-700"
                for="anxiety"
                >Anxiety attached (1–100)</label
              ><span class="text-xs text-slate-600"
                >{{ form.anxietyAttached }} / 100</span
              >
              <UInput
                id="anxiety"
                v-model.number="form.anxietyAttached"
                type="range"
                min="1"
                max="100"
              />
            </div>
          </div>

          <USeparator></USeparator>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-[0.65rem] text-slate-500">
              You can always come back and adjust this later as things change.
            </p>
            <div class="flex items-center gap-2">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="xs"
                class="rounded-full"
                @click="internalOpen = false"
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
          </div>
        </form>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Boss, Difficulty, Mob } from "~/types/user-types";
import { createMobs } from "~/util/Utilities";

const props = defineProps<{
  modalOpen: boolean;
  editingEvent: Boss | undefined;
}>();

const emit = defineEmits<{
  (e: "update:modalOpen", value: boolean): void;
  (e: "save-event", event: Boss): void;
}>();

interface EventFormState {
  id: number | null;
  title: string;
  description: string;
  difficulty: Difficulty;
  dateStart: string;
  dateEnd: string;
  anxietyAttached: number;
}

const difficultyOptions = ref<Difficulty[]>([
  "easy",
  "medium",
  "hard",
  "very_hard",
  "panic",
]);

const internalOpen = computed({
  get: () => props.modalOpen,
  set: (value: boolean) => emit("update:modalOpen", value),
});

const isEditing = computed(() => !!props.editingEvent);

const emptyForm = (): EventFormState => ({
  id: null,
  title: "",
  description: "",
  difficulty: "medium",
  dateStart: toInputDateTime(new Date()),
  dateEnd: toInputDateTime(new Date(new Date().getTime() + 60 * 60 * 1000)),
  anxietyAttached: 60,
});

const form = ref<EventFormState>(emptyForm());

watch(
  () => props.editingEvent,
  (boss) => {
    if (boss) {
      form.value = {
        id: boss.id,
        title: boss.title,
        description: boss.desc,
        difficulty: boss.difficulty,
        dateStart: boss.dateStart,
        dateEnd: boss.dateEnd,
        anxietyAttached: boss.anxiety,
      };
    } else {
      form.value = emptyForm();
    }
  },
  { immediate: true }
);

function onSave() {
  const mobs = createMobs(form.value.difficulty);

  const newBoss: Boss = {
    id: form.value.id ?? Date.now(),
    title: form.value.title.trim(),
    desc: form.value.description.trim(),
    difficulty: form.value.difficulty,
    mobs: mobs, // mobs can be wired up to Mob[] later
    dateStart: new Date(form.value.dateStart).toISOString(),
    dateEnd: new Date(form.value.dateEnd).toISOString(),
    anxiety: Math.min(100, Math.max(1, form.value.anxietyAttached || 1)),
    image: "/images/bosses/dragon.jpg",
  };

  emit("save-event", newBoss);
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
</script>
