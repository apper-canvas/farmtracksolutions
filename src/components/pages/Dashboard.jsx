import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import transactionService from "@/services/api/transactionService";
import weatherService from "@/services/api/weatherService";
import { format, isThisMonth } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getCurrentWeather("Sacramento, CA")
      ]);
      
      setCrops(cropsData);
      setTasks(tasksData);
      setTransactions(transactionsData);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading count={4} />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

const activeCrops = crops.filter(c => c.status_c === "growing" || c.status_c === "planted").length;
  const pendingTasks = tasks.filter(t => !t.completed_c).length;
  
  const thisMonthTransactions = transactions.filter(t => 
    isThisMonth(new Date(t.date_c))
  );
  const monthExpenses = thisMonthTransactions
    .filter(t => t.type_c === "expense")
    .reduce((sum, t) => sum + t.amount_c, 0);
  const monthIncome = thisMonthTransactions
    .filter(t => t.type_c === "income")
    .reduce((sum, t) => sum + t.amount_c, 0);

  const recentTransactions = transactions.slice(0, 5);
  const upcomingTasks = tasks
    .filter(t => !t.completed_c)
    .sort((a, b) => new Date(a.duedate_c) - new Date(b.duedate_c))
    .slice(0, 5);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Farm Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on your farm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          gradient="from-green-500 to-emerald-600"
          trend="Currently growing"
        />
        <MetricCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          gradient="from-blue-500 to-cyan-600"
          trend="To be completed"
        />
        <MetricCard
          title="Month Expenses"
          value={`$${monthExpenses.toFixed(0)}`}
          icon="TrendingDown"
          gradient="from-red-500 to-pink-600"
          trend="This month"
        />
        <MetricCard
          title="Month Income"
          value={`$${monthIncome.toFixed(0)}`}
          icon="TrendingUp"
          gradient="from-amber-500 to-yellow-600"
          trend="This month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate("/tasks")}
                >
                  View All
                </Button>
              </div>
              
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">All tasks completed! Great job!</p>
                </div>
              ) : (
                <div className="space-y-3">
{upcomingTasks.map(task => (
                    <div
                      key={task.Id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary-light"></div>
                        <div>
                          <p className="font-semibold text-gray-900">{task.title_c}</p>
                          <p className="text-sm text-gray-600">
                            Due: {format(new Date(task.duedate_c), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.priority_c === "high" 
                          ? "bg-red-100 text-red-700" 
                          : task.priority_c === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {task.priority_c}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate("/finances")}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
{recentTransactions.map(transaction => (
                  <div
                    key={transaction.Id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type_c === "income"
                          ? "bg-gradient-to-br from-green-50 to-green-100"
                          : "bg-gradient-to-br from-red-50 to-red-100"
                      }`}>
                        <ApperIcon 
                          name={transaction.type_c === "income" ? "TrendingUp" : "TrendingDown"}
                          className={transaction.type_c === "income" ? "text-green-600" : "text-red-600"}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.category_c}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(transaction.date_c), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${
                      transaction.type_c === "income" ? "text-success" : "text-error"
                    }`}>
                      {transaction.type_c === "income" ? "+" : "-"}${transaction.amount_c.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <WeatherWidget weather={weather} loading={false} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;