import { API_BASE_URL } from "~/constants";
import type { ISubTask } from "~/types/ISubTask";
import type { ITask } from "~/types/ITask";

export const useGetSubtasks = (task: ITask) => {
  return useAsyncData(
    `subtasks:${task.id}`,
    async () => {
      const promises: Promise<ISubTask>[] = task.subtasks.map((subtaskId) =>
        $fetch(`${API_BASE_URL}/subtasks/${subtaskId}`)
      );

      const response = await Promise.allSettled(promises);

      return response.reduce((accumulator, currentValue) => {
        if (currentValue.status === "fulfilled") {
          return [...accumulator, currentValue.value];
        }
        return accumulator;
      }, [] as ISubTask[]);
    },
    {
      transform: (subtasks) => {
        return subtasks?.sort((a, b) => a.title.localeCompare(b.title));
      },
    }
  );
};
