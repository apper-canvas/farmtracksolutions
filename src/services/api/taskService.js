import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    return tasks.find(task => task.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await delay();
    return tasks.filter(task => task.farmId === parseInt(farmId));
  },

  async create(taskData) {
    await delay();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  },

  async toggleComplete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks[index].completed = !tasks[index].completed;
      tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
      return { ...tasks[index] };
    }
    throw new Error("Task not found");
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    throw new Error("Task not found");
  }
};

export default taskService;