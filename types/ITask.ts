export interface ITask {
  id: string;
  title: string;
  createdAt: string;
  done: boolean;
  subtasks: string[];
}
