export interface Task {
  priority: number | null;
  title: string;
  category: number | null | string;
  subtasks: { title: string; done: boolean }[];
  dueDate: Date;
  assignedTo: string[];
  description: string;
  status: number | null;
  id: string;
}
