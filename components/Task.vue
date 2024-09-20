<template>
  <div
    class="accordion"
    :class="{ active: showSubTasks }"
    @click="toggleSubTasksPanel"
  >
    <input
      class="checkbox"
      type="checkbox"
      :name="`task-${task.id}-checkbox`"
      :checked="isDone"
      @click.stop="toggleIsDone"
    />
    <p style="margin: 0; user-select: none">{{ task.title }}</p>
  </div>
  <div class="panel" :class="{ active: showSubTasks }">
    <SubTask
      v-for="subtask in subtasks"
      :key="subtask.id"
      :subtask="subtask"
      :done-subtasks="doneSubtasks"
      @toggle-subtask="toggleSubtask"
    />
    <div v-if="subtasks?.length === 0">
      <p style="color: red">No subtasks</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from "~/types/ITask";
import { ref } from "vue";
import { API_BASE_URL } from "~/constants";

interface IProps {
  task: ITask;
}

const { task } = defineProps<IProps>();

const showSubTasks = ref(false);
const isDone = ref(task.done);
const doneSubtasks = ref<string[]>([]);

const { data: subtasks } = await useGetSubtasks(task);

watchEffect(() => {
  const mappedSubtasksIds =
    subtasks?.value?.reduce((accumulator, currentValue) => {
      if (currentValue.done) {
        return [...accumulator, currentValue.id];
      }
      return accumulator;
    }, [] as string[]) ?? [];

  doneSubtasks.value = mappedSubtasksIds;
});

const toggleSubTasksPanel = () => {
  showSubTasks.value = !showSubTasks.value;
};

const toggleIsDone = async () => {
  const newValue = !isDone.value;

  try {
    isDone.value = newValue;
    await $fetch(`${API_BASE_URL}/tasks/${task.id}`, {
      method: "PATCH",
      body: { done: newValue },
    });
  } catch {
    isDone.value = !newValue;
  }
};

const toggleSubtaskLocally = (subtaskId: string, markAsDone: boolean) => {
  if (markAsDone) {
    doneSubtasks.value = [...doneSubtasks.value, subtaskId];
  } else {
    doneSubtasks.value = doneSubtasks.value.filter(
      (doneSubtaskId) => doneSubtaskId !== subtaskId
    );
  }
};

const toggleSubtask = async (subtaskId: string) => {
  const markAsDone = !doneSubtasks.value.includes(subtaskId);

  try {
    toggleSubtaskLocally(subtaskId, markAsDone);
    await $fetch(`${API_BASE_URL}/subtasks/${subtaskId}`, {
      method: "PATCH",
      body: { done: markAsDone },
    });
  } catch {
    toggleSubtaskLocally(subtaskId, !markAsDone);
  }

  if (
    subtasks?.value &&
    subtasks.value.length === doneSubtasks.value.length &&
    !isDone.value
  ) {
    try {
      toggleIsDone();
    } catch {
      isDone.value = !isDone.value;
    }
  }
};
</script>

<style>
.accordion {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 18px 28px;
  transition: 0.4s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
.accordion:after {
  content: "\02795";
  font-size: 13px;
  color: #777;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}
.accordion.active,
.accordion:hover {
  background-color: #ccc;
}
.accordion.active:after {
  content: "\2796";
}
.panel {
  padding: 18px 28px;
  background-color: white;
  display: none;
  overflow: hidden;
}
.panel.active {
  display: block;
}
.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
