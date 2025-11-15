<template>
  <UModal v-model:open="internalOpen">
    <template #content>
      <UCard>
        <template #header class="mb-3">
          <h2 class="text-sm font-semibold text-slate-900">
            Quick anxiety check-in
          </h2>
          <p class="text-[0.7rem] text-slate-500">
            After this attack, where does your anxiety feel right now? There are
            no wrong numbers.
          </p>
        </template>

        <form class="space-y-3 text-xs" @submit.prevent="onSubmit">
          <div class="space-y-1">
            <label
              class="block text-[0.7rem] font-medium text-slate-700"
              for="anxiety"
            >
              Anxiety level {{ internalAnxiety }} / 100
            </label>
            <UInput
              id="anxiety"
              v-model.number="internalAnxiety"
              type="range"
              min="1"
              max="100"
              required
              size="sm"
            />
          </div>
          <p class="text-[0.65rem] text-slate-500">
            Thank you for checking in. This helps your future self.
          </p>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            size="xs"
            class="mt-2 rounded-full px-4 py-1.5"
          >
            Save
          </UButton>
        </form>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  anxiety: number | undefined;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "update:anxiety", value: number | undefined): void;
  (e: "submit"): void;
}>();

const internalOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const internalAnxiety = computed({
  get: () => props.anxiety,
  set: (value: number | undefined) => emit("update:anxiety", value),
});

function onSubmit() {
  emit("submit");
}
</script>
