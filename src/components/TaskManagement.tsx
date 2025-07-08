
import React, { useState, useMemo, useEffect } from 'react';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTaskStorage } from '@/hooks/useTaskStorage';
import { Task, TaskFilter, TaskSort } from '@/types/task';
import { isOverdue, shouldShowReminder } from '@/utils/taskUtils';
import { Plus, CheckSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const TaskManagement: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskStorage();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [sortBy, setSortBy] = useState<TaskSort>('dueDate');

  // Handle reminders
  useEffect(() => {
    const checkReminders = () => {
      tasks.forEach(task => {
        if (shouldShowReminder(task)) {
          if (Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.title}`, {
              body: task.description || 'You have a task reminder!',
              icon: '/favicon.ico',
            });
          } else {
            toast({
              title: 'Task Reminder',
              description: `${task.title} - ${task.description || 'You have a task reminder!'}`,
            });
          }
        }
      });
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filters
    switch (activeFilter) {
      case 'active':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = tasks.filter(task => isOverdue(task));
        break;
      default:
        break;
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [tasks, activeFilter, sortBy]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => isOverdue(task)).length,
  }), [tasks]);

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: 'Task Updated',
        description: 'Your task has been successfully updated.',
      });
    } else {
      addTask(taskData);
      toast({
        title: 'Task Created',
        description: 'Your new task has been created successfully.',
      });
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setDeleteTaskId(null);
    toast({
      title: 'Task Deleted',
      description: 'The task has been permanently deleted.',
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTask(id, { completed });
    toast({
      title: completed ? 'Task Completed' : 'Task Reopened',
      description: completed 
        ? 'Great job! Task marked as completed.' 
        : 'Task has been reopened.',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
          <p className="text-gray-600">Organize your tasks and boost productivity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Button
                onClick={() => setShowForm(true)}
                className="w-full"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Task
              </Button>

              <TaskFilters
                activeFilter={activeFilter}
                sortBy={sortBy}
                onFilterChange={setActiveFilter}
                onSortChange={setSortBy}
                taskCounts={taskCounts}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {showForm && (
                <TaskForm
                  task={editingTask}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {activeFilter === 'all' && 'All Tasks'}
                    {activeFilter === 'active' && 'Active Tasks'}
                    {activeFilter === 'completed' && 'Completed Tasks'}
                    {activeFilter === 'overdue' && 'Overdue Tasks'}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({filteredAndSortedTasks.length})
                  </span>
                </div>

                <TaskList
                  tasks={filteredAndSortedTasks}
                  onEdit={handleEdit}
                  onDelete={setDeleteTaskId}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTaskId && handleDelete(deleteTaskId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
