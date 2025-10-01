import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import equipmentService from '@/services/api/equipmentService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Modal from '@/components/molecules/Modal';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';

const Equipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    name_c: '',
    type_c: '',
    purchase_date_c: '',
    cost_c: '',
    Tags: ''
  });

  const loadEquipments = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await equipmentService.getAll(search);
      setEquipments(data);
    } catch (err) {
      setError('Failed to load equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEquipments();
  }, [loadEquipments]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        loadEquipments(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadEquipments]);

  const handleOpenModal = (mode, equipment = null) => {
    setModalMode(mode);
    setCurrentEquipment(equipment);
    
    if (mode === 'edit' && equipment) {
      setFormData({
        Name: equipment.Name || '',
        name_c: equipment.name_c || '',
        type_c: equipment.type_c || '',
        purchase_date_c: equipment.purchase_date_c || '',
        cost_c: equipment.cost_c || '',
        Tags: equipment.Tags || ''
      });
    } else {
      setFormData({
        Name: '',
        name_c: '',
        type_c: '',
        purchase_date_c: '',
        cost_c: '',
        Tags: ''
      });
    }
    
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEquipment(null);
    setFormData({
      Name: '',
      name_c: '',
      type_c: '',
      purchase_date_c: '',
      cost_c: '',
      Tags: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_c || !formData.type_c) {
      return;
    }

    setLoading(true);
    
    if (modalMode === 'add') {
      const result = await equipmentService.create(formData);
      if (result.success) {
        handleCloseModal();
        loadEquipments(searchQuery);
      }
    } else {
      const result = await equipmentService.update(currentEquipment.Id, formData);
      if (result.success) {
        handleCloseModal();
        loadEquipments(searchQuery);
      }
    }
    
    setLoading(false);
  };

  const handleDelete = async (equipment) => {
    if (!confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    setLoading(true);
    const result = await equipmentService.delete(equipment.Id);
    
    if (result.success) {
      loadEquipments(searchQuery);
    }
    
    setLoading(false);
  };

  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading && equipments.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Manage your farm equipment and machinery</p>
        </div>
        <Button onClick={() => handleOpenModal('add')} className="flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search equipment by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {equipments.length === 0 ? (
        <Empty message="No equipment found" />
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipments.map((equipment) => (
                      <motion.tr
                        key={equipment.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-light/10 flex items-center justify-center">
                              <ApperIcon name="Box" className="w-5 h-5 text-primary" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {equipment.name_c || equipment.Name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{equipment.type_c || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(equipment.purchase_date_c)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(equipment.cost_c)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {equipment.Tags ? (
                              equipment.Tags.split(',').map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag.trim()}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400">No tags</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => handleOpenModal('edit', equipment)}
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => handleDelete(equipment)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="md:hidden space-y-4">
            {equipments.map((equipment) => (
              <motion.div
                key={equipment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-light/10 flex items-center justify-center">
                        <ApperIcon name="Box" className="w-5 h-5 text-primary" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {equipment.name_c || equipment.Name}
                        </h3>
                        <p className="text-sm text-gray-600">{equipment.type_c || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleOpenModal('edit', equipment)}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDelete(equipment)}
                        className="text-red-600"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Date:</span>
                      <span className="font-medium">{formatDate(equipment.purchase_date_c)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium text-primary">{formatCurrency(equipment.cost_c)}</span>
                    </div>
                  </div>
                  
                  {equipment.Tags && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {equipment.Tags.split(',').map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'add' ? 'Add Equipment' : 'Edit Equipment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name_c">Name *</Label>
            <Input
              id="name_c"
              name="name_c"
              type="text"
              value={formData.name_c}
              onChange={handleInputChange}
              required
              placeholder="Enter equipment name"
            />
          </div>

          <div>
            <Label htmlFor="type_c">Type *</Label>
            <Input
              id="type_c"
              name="type_c"
              type="text"
              value={formData.type_c}
              onChange={handleInputChange}
              required
              placeholder="Enter equipment type"
            />
          </div>

          <div>
            <Label htmlFor="purchase_date_c">Purchase Date *</Label>
            <Input
              id="purchase_date_c"
              name="purchase_date_c"
              type="date"
              value={formData.purchase_date_c}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="cost_c">Cost *</Label>
            <Input
              id="cost_c"
              name="cost_c"
              type="number"
              step="0.01"
              value={formData.cost_c}
              onChange={handleInputChange}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="Tags">Tags</Label>
            <Input
              id="Tags"
              name="Tags"
              type="text"
              value={formData.Tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {modalMode === 'add' ? 'Add Equipment' : 'Update Equipment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Equipments;