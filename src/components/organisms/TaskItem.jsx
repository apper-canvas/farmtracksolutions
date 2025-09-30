import { safeFormatDate, safeParseDate } from "@/utils/cn";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, crop, onToggle, onEdit, onDelete }) => {
  const priorityConfig = {
    high: { variant: "high", icon: "AlertTriangle", color: "text-red-600" },
    medium: { variant: "medium", icon: "AlertCircle", color: "text-amber-600" },
    low: { variant: "low", icon: "Info", color: "text-green-600" }
  };

  const config = priorityConfig[task.priority_c] || priorityConfig.medium;
const dueDate = safeParseDate(task.duedate_c);
  const isOverdue = !task.completed_c && dueDate && dueDate < new Date();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("p-5", task.completed && "opacity-60")}>
        <div className="flex items-start space-x-4">
          <button
onClick={() => onToggle(task.Id)}
            className={cn(
              "mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200",
              task.completed_c
                ? "bg-gradient-to-r from-success to-green-600 border-success"
                : "border-gray-300 hover:border-primary"
            )}
          >
            {task.completed_c && (
              <ApperIcon name="Check" className="w-4 h-4 text-white" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
<h3 className={cn(
                  "text-base font-bold text-gray-900 mb-1",
                  task.completed_c && "line-through"
                )}>
                  {task.title_c}
                </h3>
{crop && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Crop:</span> {crop.name_c} ({crop.plotfield_c})
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
<Badge variant={config.variant}>
                  <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
                  {task.priority_c}
                </Badge>
                {isOverdue && (
                  <Badge variant="high">
                    <ApperIcon name="AlertTriangle" className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
            </div>

{task.description_c && (
              <p className="text-sm text-gray-600 mb-3">{task.description_c}</p>
            )}

            <div className="flex items-center justify-between">
<div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
Due: {safeFormatDate(task.duedate_c, "MMM dd, yyyy")}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onEdit(task)}
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onDelete(task.Id)}
                  className="text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskItem;