<template>
  <div>
    <h2>Tasks</h2>
    <div>
      <Task v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { API_BASE_URL } from "~/constants";
import type { ITask } from "~/types/ITask";

const { data: tasks } = await useFetch<ITask[]>(`${API_BASE_URL}/tasks`);
</script>
