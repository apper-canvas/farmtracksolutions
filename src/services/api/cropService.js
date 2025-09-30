import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const cropService = {
  async getAll() {
    await delay();
    return [...crops];
  },

  async getById(id) {
    await delay();
    return crops.find(crop => crop.Id === parseInt(id));
  },

  async getByFarmId(farmId) {
    await delay();
    return crops.filter(crop => crop.farmId === parseInt(farmId));
  },

  async create(cropData) {
    await delay();
    const maxId = crops.length > 0 ? Math.max(...crops.map(c => c.Id)) : 0;
    const newCrop = {
      ...cropData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      crops[index] = { ...crops[index], ...cropData };
      return { ...crops[index] };
    }
    throw new Error("Crop not found");
  },

  async delete(id) {
    await delay();
    const index = crops.findIndex(crop => crop.Id === parseInt(id));
    if (index !== -1) {
      crops.splice(index, 1);
      return true;
    }
    throw new Error("Crop not found");
  }
};

export default cropService;