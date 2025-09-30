import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import TaskItem from "@/components/organisms/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import cropService from "@/services/api/cropService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
const [formData, setFormData] = useState({
    farm_c: 1,
    crop_c: "",
    title_c: "",
    description_c: "",
    duedate_c: "",
    priority_c: "medium"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, cropsData] = await Promise.all([
        taskService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, formData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(formData);
        toast.success("Task created successfully!");
      }
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await taskService.toggleComplete(id);
      toast.success("Task status updated!");
      await loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farm_c: task.farm_c?.Id || task.farm_c || 1,
      crop_c: task.crop_c?.Id || task.crop_c || "",
      title_c: task.title_c,
      description_c: task.description_c,
      duedate_c: task.duedate_c,
      priority_c: task.priority_c
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(id);
        toast.success("Task deleted successfully!");
        await loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCloseModal = () => {
setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      farm_c: 1,
      crop_c: "",
      title_c: "",
      description_c: "",
      duedate_c: "",
      priority_c: "medium"
    });
  };

  if (loading) return <Loading count={3} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  let filteredTasks = tasks;
  
if (filterStatus === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed_c);
  } else if (filterStatus === "pending") {
    filteredTasks = filteredTasks.filter(t => !t.completed_c);
  }
  
  if (filterPriority !== "all") {
    filteredTasks = filteredTasks.filter(t => t.priority_c === filterPriority);
  }

filteredTasks = filteredTasks.sort((a, b) => {
    if (a.completed_c !== b.completed_c) {
      return a.completed_c ? 1 : -1;
    }
    return new Date(a.duedate_c) - new Date(b.duedate_c);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">Organize and track your farm activities</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-700 py-2">Status:</span>
          {["all", "pending", "completed"].map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? "primary" : "outline"}
              size="small"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-700 py-2">Priority:</span>
          {["all", "high", "medium", "low"].map(priority => (
            <Button
              key={priority}
              variant={filterPriority === priority ? "primary" : "outline"}
              size="small"
              onClick={() => setFilterPriority(priority)}
              className="capitalize"
            >
              {priority}
            </Button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Create your first task to start organizing your farm activities and stay on top of your work."
          actionLabel="Add First Task"
          onAction={() => setIsModalOpen(true)}
          icon="CheckSquare"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredTasks.map((task) => (
            <TaskItem
key={task.Id}
              task={task}
              crop={crops.find(c => c.Id === (task.crop_c?.Id || task.crop_c))}
              onToggle={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Add New Task"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
<FormField
            label="Task Title"
            required
            value={formData.title_c}
            onChange={(e) => setFormData({ ...formData, title_c: e.target.value })}
            placeholder="e.g., Water tomato plants"
          />

          <SelectField
            label="Related Crop"
            value={formData.crop_c}
            onChange={(e) => setFormData({ ...formData, crop_c: parseInt(e.target.value) || "" })}
          >
            <option value="">None (General task)</option>
            {crops.map(crop => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name_c} ({crop.plotfield_c})
              </option>
            ))}
          </SelectField>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => setFormData({ ...formData, description_c: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400"
              placeholder="Add task details..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Due Date"
              type="date"
              required
              value={formData.duedate_c}
              onChange={(e) => setFormData({ ...formData, duedate_c: e.target.value })}
            />
            <SelectField
              label="Priority"
              required
              value={formData.priority_c}
              onChange={(e) => setFormData({ ...formData, priority_c: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </SelectField>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;