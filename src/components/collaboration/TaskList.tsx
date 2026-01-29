import { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  onUpdateTask: (taskId: string, status: Task['status']) => void;
}

export function TaskList({ projectId, tasks, onUpdateTask }: TaskListProps) {
  const { toast } = useToast();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'todo':
        return 'bg-gray-500';
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    onUpdateTask(taskId, newStatus);
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Tasks</h4>
      <div className="space-y-3">
        {tasks?.map((task) => (
          <div key={task.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">{task.title}</h5>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Assigned to: {task.assignedTo}
            </div>
            <div className="mt-2 flex gap-2">
              {task.status !== 'todo' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'todo')}
                >
                  Move to Todo
                </Button>
              )}
              {task.status !== 'in-progress' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'in-progress')}
                >
                  Start Progress
                </Button>
              )}
              {task.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(task.id, 'completed')}
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}