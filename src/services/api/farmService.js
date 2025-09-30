import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const farmService = {
  async getAll() {
    await delay();
    return [...farms];
  },

  async getById(id) {
    await delay();
    return farms.find(farm => farm.Id === parseInt(id));
  },

  async create(farmData) {
    await delay();
    const maxId = farms.length > 0 ? Math.max(...farms.map(f => f.Id)) : 0;
    const newFarm = {
      ...farmData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  async update(id, farmData) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      farms[index] = { ...farms[index], ...farmData };
      return { ...farms[index] };
    }
    throw new Error("Farm not found");
  },

  async delete(id) {
    await delay();
    const index = farms.findIndex(farm => farm.Id === parseInt(id));
    if (index !== -1) {
      farms.splice(index, 1);
      return true;
    }
    throw new Error("Farm not found");
  }
};

export default farmService;