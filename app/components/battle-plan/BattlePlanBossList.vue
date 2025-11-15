<template>
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
            A short list of upcoming events. You can edit details or remove ones
            that no longer apply.
          </p>
        </div>
        <UButton
          color="primary"
          variant="soft"
          size="xs"
          class="rounded-full"
          @click="$emit('add-boss')"
        >
          ➕ Add new boss
        </UButton>
      </div>

      <div
        v-if="sortedEvents.length"
        class="flex flex-wrap gap-x-3 space-y-2 text-xs"
      >
        <UCard
          v-for="boss in sortedEvents"
          :key="boss.id"
          class="w-[300px] h-[250px] flex flex-col gap-2 rounded-2xl border-slate-100 bg-slate-50/70 p-3 md:flex-row md:items-center md:justify-between"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-x-2">
              <!-- Avatar image -->
              <div
                class="relative h-24 w-24 flex-none overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-sky-200"
              >
                <NuxtImg
                  :src="boss.image"
                  alt="Boss avatar"
                  class="h-full w-full object-cover"
                />
              </div>

              <h3 class="text-sm font-semibold text-slate-900">
                {{ boss.title }}
              </h3>
            </div>
            <p class="text-[0.7rem] text-slate-500">
              {{ formatDateRange(boss.dateStart, boss.dateEnd) }}
              · Difficulty:
              <UBadge
                :color="difficultyColor(boss.difficulty)"
                variant="subtle"
                size="xs"
                class="ml-1 capitalize"
              >
                {{ boss.difficulty }}
              </UBadge>
              · Anxiety:
              <span class="font-semibold">{{ boss.anxiety }} / 100</span>
            </p>
          </div>

          <div class="flex flex-wrap items-center mt-4 gap-2 pt-1 md:pt-0">
            <UButton
              color="neutral"
              variant="outline"
              size="xs"
              class="rounded-full"
              @click="$emit('edit-boss', boss)"
            >
              ✏️ Edit
            </UButton>
            <UButton
              color="error"
              variant="soft"
              size="xs"
              class="rounded-full"
              @click="$emit('remove-boss', boss.id)"
            >
              🗑 Remove
            </UButton>
          </div>
        </UCard>
      </div>

      <p v-else class="text-[0.75rem] text-slate-500">
        You haven't added any upcoming bosses yet. When you're ready, you can
        create one above.
      </p>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { Boss } from "~/types/user-types";

const props = defineProps<{
  bosses: Boss[] | undefined;
  formatDateRange: (start: string, end: string) => string;
  difficultyColor: (
    difficulty: any
  ) => "success" | "info" | "warning" | "error";
}>();

const sortedEvents = computed(() => {
  if (!props.bosses) return [];
  return [...props.bosses].sort(
    (a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
  );
});
</script>
