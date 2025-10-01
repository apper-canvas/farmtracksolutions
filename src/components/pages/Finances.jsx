import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { safeFormatDate } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import TransactionTable from "@/components/organisms/TransactionTable";
import Modal from "@/components/molecules/Modal";
import SelectField from "@/components/molecules/SelectField";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import transactionService from "@/services/api/transactionService";

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
const [formData, setFormData] = useState({
    farm_id_c: 1,
    type_c: "expense",
    amount_c: "",
    category_c: "",
    description_c: "",
    date_c: ""
  });

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
try {
      const transactionData = {
        ...formData,
        amount_c: parseFloat(formData.amount_c)
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      
      await loadTransactions();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
farm_id_c: transaction.farm_id_c?.Id || transaction.farm_id_c || 1,
      type_c: transaction.type_c,
      amount_c: transaction.amount_c.toString(),
      category_c: transaction.category_c,
      description_c: transaction.description_c,
      date_c: transaction.date_c
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        toast.success("Transaction deleted successfully!");
        await loadTransactions();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCloseModal = () => {
setIsModalOpen(false);
    setEditingTransaction(null);
    setFormData({
farm_id_c: 1,
      type_c: "expense",
      amount_c: "",
      category_c: "",
      description_c: "",
      date_c: ""
    });
  };

  if (loading) return <Loading count={3} />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

const filteredTransactions = filterType === "all"
    ? transactions
    : transactions.filter(t => t.type_c === filterType);
const sortedTransactions = [...filteredTransactions].sort(
(a, b) => {
      const dateA = new Date(a.date_c);
      const dateB = new Date(b.date_c);
      if (!dateA || isNaN(dateA.getTime())) return 1;
      if (!dateB || isNaN(dateB.getTime())) return -1;
      return dateB - dateA;
    }
  );

const totalIncome = transactions
    .filter(t => t.type_c === "income")
    .reduce((sum, t) => sum + t.amount_c, 0);

const totalExpenses = transactions
    .filter(t => t.type_c === "expense")
    .reduce((sum, t) => sum + t.amount_c, 0);

  const netBalance = totalIncome - totalExpenses;

  const expenseCategories = ["Seeds", "Equipment", "Fertilizer", "Labor", "Utilities", "Maintenance", "Other"];
  const incomeCategories = ["Sales", "Grants", "Subsidies", "Other"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1">Track income and expenses for your farm</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Income</h3>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/10 to-green-600/10 flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent">
              ${totalIncome.toFixed(2)}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Expenses</h3>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-error/10 to-red-600/10 flex items-center justify-center">
                <ApperIcon name="TrendingDown" className="w-5 h-5 text-error" />
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-error to-red-600 bg-clip-text text-transparent">
              ${totalExpenses.toFixed(2)}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Net Balance</h3>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                netBalance >= 0 
                  ? "bg-gradient-to-br from-primary/10 to-primary-light/10"
                  : "bg-gradient-to-br from-error/10 to-red-600/10"
              }`}>
                <ApperIcon 
                  name={netBalance >= 0 ? "DollarSign" : "AlertCircle"} 
                  className={netBalance >= 0 ? "text-primary" : "text-error"}
                />
              </div>
            </div>
            <p className={`text-3xl font-bold bg-gradient-to-r ${
              netBalance >= 0 
                ? "from-primary to-primary-light"
                : "from-error to-red-600"
            } bg-clip-text text-transparent`}>
              ${Math.abs(netBalance).toFixed(2)}
            </p>
          </Card>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "income", "expense"].map(type => (
          <Button
            key={type}
            variant={filterType === type ? "primary" : "outline"}
            size="small"
            onClick={() => setFilterType(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {sortedTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          description="Start tracking your farm finances by adding your first income or expense transaction."
          actionLabel="Add First Transaction"
          onAction={() => setIsModalOpen(true)}
          icon="DollarSign"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TransactionTable
            transactions={sortedTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Edit Transaction" : "Add New Transaction"}
        size="default"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-3">
            <Button
              type="button"
variant={formData.type_c === "expense" ? "primary" : "outline"}
              onClick={() => setFormData({ ...formData, type_c: "expense", category_c: "" })}
              className="flex-1"
            >
              <ApperIcon name="TrendingDown" className="w-4 h-4 mr-2" />
              Expense
            </Button>
            <Button
              type="button"
              variant={formData.type_c === "income" ? "primary" : "outline"}
              onClick={() => setFormData({ ...formData, type_c: "income", category_c: "" })}
              className="flex-1"
            >
              <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
              Income
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Amount"
              type="number"
              step="0.01"
              required
              value={formData.amount_c}
              onChange={(e) => setFormData({ ...formData, amount_c: e.target.value })}
              placeholder="0.00"
            />
            <SelectField
              label="Category"
              required
              value={formData.category_c}
              onChange={(e) => setFormData({ ...formData, category_c: e.target.value })}
            >
              <option value="">Select category</option>
              {(formData.type_c === "expense" ? expenseCategories : incomeCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </SelectField>
          </div>

          <FormField
            label="Date"
            type="date"
            required
            value={formData.date_c}
            onChange={(e) => setFormData({ ...formData, date_c: e.target.value })}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description_c}
              onChange={(e) => setFormData({ ...formData, description_c: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400"
              placeholder="Add transaction details..."
            />
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
              {editingTransaction ? "Update Transaction" : "Add Transaction"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Finances;