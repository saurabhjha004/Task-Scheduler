
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Bell, AlertTriangle } from 'lucide-react';
import { Task } from '@/types/task';
import { isOverdue, isDueToday, shouldShowReminder, getPriorityColor, formatDate } from '@/utils/taskUtils';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);
  const hasReminder = shouldShowReminder(task);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-60",
      overdue && !task.completed && "border-red-300 bg-red-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-foreground",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={cn(
                    "text-sm text-muted-foreground mt-1",
                    task.completed && "line-through"
                  )}>
                    {task.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority.toUpperCase()}
              </Badge>

              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs px-2 py-1 rounded-md border",
                  overdue && !task.completed
                    ? "bg-red-100 text-red-800 border-red-200"
                    : dueToday
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                )}>
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                  {overdue && !task.completed && <AlertTriangle className="h-3 w-3" />}
                </div>
              )}

              {hasReminder && (
                <div className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-md border border-purple-200">
                  <Bell className="h-3 w-3" />
                  Reminder
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
