export interface Task {
  priority: number | null;
  title: string;
  category: number | null;
  subtasks: { title: string; done: boolean }[];
  dueDate: string;
  assignedTo: string[];
  description: string;
  status: number | null;
  id: string;
}
