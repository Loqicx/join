export interface Task {
  priority: Number | null;
  title: string;
  category: Number | null;
  subtasks: { title: string; done: boolean }[];
  dueDate: Date;
  assignedTo: string[];
  description: string;
  status: Number | null;
  id: string;
}
