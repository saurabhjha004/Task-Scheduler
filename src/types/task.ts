
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  reminderDate: Date | null;
  createdAt: Date;
}

export type TaskFilter = 'all' | 'active' | 'completed' | 'overdue';
export type TaskSort = 'dueDate' | 'priority' | 'created';
