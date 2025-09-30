import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherWidget = ({ weather, loading }) => {
  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-primary-light p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{weather.location}</h3>
              <p className="text-sm opacity-90">{weather.current.condition}</p>
            </div>
            <ApperIcon name={weather.current.icon} className="w-16 h-16 opacity-90" />
          </div>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">{weather.current.temperature}°</span>
            <span className="text-2xl ml-2">F</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <ApperIcon name="Droplets" className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Humidity</p>
              <p className="text-base font-bold text-gray-900">{weather.current.humidity}%</p>
            </div>
            <div className="text-center">
              <ApperIcon name="Wind" className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Wind</p>
              <p className="text-base font-bold text-gray-900">{weather.current.windSpeed} mph</p>
            </div>
            <div className="text-center">
              <ApperIcon name="CloudRain" className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Rain</p>
              <p className="text-base font-bold text-gray-900">{weather.current.precipitation}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-700 uppercase">5-Day Forecast</h4>
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={day.icon} className="w-6 h-6 text-primary" />
                  <span className="font-medium text-gray-900">{day.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{day.condition}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{day.high}°</span>
                    <span className="text-gray-500">{day.low}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;