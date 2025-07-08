
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilter, TaskSort } from '@/types/task';
import { Filter, SortAsc } from 'lucide-react';

interface TaskFiltersProps {
  activeFilter: TaskFilter;
  sortBy: TaskSort;
  onFilterChange: (filter: TaskFilter) => void;
  onSortChange: (sort: TaskSort) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
    overdue: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  sortBy,
  onFilterChange,
  onSortChange,
  taskCounts,
}) => {
  const filters: { key: TaskFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
    { key: 'overdue', label: 'Overdue', count: taskCounts.overdue },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => onFilterChange(filter.key)}
            >
              <span>{filter.label}</span>
              <span className="text-xs bg-background/20 px-2 py-1 rounded">
                {filter.count}
              </span>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SortAsc className="h-4 w-4" />
            Sort By
          </div>
          <Select value={sortBy} onValueChange={(value: TaskSort) => onSortChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created">Created Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
