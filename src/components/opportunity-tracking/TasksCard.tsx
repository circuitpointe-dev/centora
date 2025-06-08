
import React from "react";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  assignedTo: string;
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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Tasks
      </h3>
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 p-3 rounded border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      Assigned to: {task.assignedTo}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                    <Badge 
                      variant={task.status === "completed" ? "default" : "secondary"}
                      className={task.status === "completed" ? "bg-green-600 text-white" : ""}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-gray-500">
            No tasks added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksCard;
