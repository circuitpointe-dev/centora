
import React from "react";
import { ListTodo, Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  completed?: boolean;
}

interface TasksCardProps {
  tasks: Task[];
  onAddTask: () => void;
  sectionHeight?: string;
}

const TasksCard: React.FC<TasksCardProps> = ({
  tasks,
  onAddTask,
  sectionHeight = "h-72"
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
        <ListTodo className="h-4 w-4" />
        Tasks
      </h3>
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTask}
        >
          Add Task
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 p-3 rounded border border-gray-200 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                  checked={task.completed}
                  readOnly
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Due:{" "}
                    {format(new Date(task.dueDate), "MMM dd, yyyy")} •
                    Assigned to: {task.assignedTo}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    task.priority === "high"
                      ? "border-red-200 text-red-800"
                      : task.priority === "medium"
                      ? "border-yellow-200 text-yellow-800"
                      : "border-green-200 text-green-800"
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-gray-500">
            No tasks created yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksCard;
