<template>
  <div class="subtask">
    <input
      class="checkbox"
      type="checkbox"
      :name="`subtask-${subtask.id}-checkbox`"
      :checked="isDone"
      @click.stop="toggleSubtask"
    />
    <p style="margin: 0; user-select: none">{{ subtask.title }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ISubTask } from "~/types/ISubTask";

interface IProps {
  subtask: ISubTask;
  doneSubtasks: string[];
}

const { subtask, doneSubtasks } = defineProps<IProps>();
const emit = defineEmits(["toggleSubtask"]);

const isDone = computed(() => doneSubtasks.includes(subtask.id));

const toggleSubtask = () => {
  emit("toggleSubtask", subtask.id);
};
</script>

<style>
.subtask {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
</style>
