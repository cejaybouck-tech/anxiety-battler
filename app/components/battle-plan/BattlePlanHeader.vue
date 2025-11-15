<template>
  <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <UBadge color="info" variant="subtle" size="xs">
        Plan your battles at your own pace
      </UBadge>
      <h1 class="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        Battle plan
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        A gentle place to map out upcoming events, break them into smaller mobs, and choose supportive
        actions ahead of time.
      </p>
    </div>

    <UButton
      color="primary"
      variant="solid"
      size="sm"
      class="rounded-full"
      @click="$emit('add-boss')"
    >
      ➕ Add new boss
    </UButton>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'add-boss'): void
}>()
</script>
