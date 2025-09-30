import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [currentWeather, hourly] = await Promise.all([
        weatherService.getCurrentWeather("Sacramento, CA"),
        weatherService.getHourlyForecast("Sacramento, CA")
      ]);
      setWeather(currentWeather);
      setHourlyForecast(hourly);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  if (loading) return <Loading count={2} />;
  if (error) return <Error message={error} onRetry={loadWeatherData} />;
  if (!weather) return null;

  const recommendations = [
    {
      title: "Good day for outdoor work",
      description: "Clear skies and moderate temperature make today ideal for planting and harvesting activities.",
      icon: "Sun",
      color: "from-amber-500 to-yellow-600"
    },
    {
      title: "Irrigation recommended",
      description: "With humidity below 70%, consider watering your crops in the early morning or evening.",
      icon: "Droplets",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Monitor soil moisture",
      description: "Current conditions suggest checking soil moisture levels, especially for young plants.",
      icon: "Sprout",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Weather Forecast
        </h1>
        <p className="text-gray-600 mt-1">Current conditions and forecast for {weather.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary-light p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{weather.location}</h2>
                  <p className="text-lg opacity-90">{weather.current.condition}</p>
                </div>
                <ApperIcon name={weather.current.icon} className="w-20 h-20 opacity-90" />
              </div>
              <div className="flex items-baseline mb-6">
                <span className="text-7xl font-bold">{weather.current.temperature}°</span>
                <span className="text-3xl ml-2">F</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <ApperIcon name="Droplets" className="w-6 h-6 mb-2" />
                  <p className="text-sm opacity-75 mb-1">Humidity</p>
                  <p className="text-xl font-bold">{weather.current.humidity}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <ApperIcon name="Wind" className="w-6 h-6 mb-2" />
                  <p className="text-sm opacity-75 mb-1">Wind Speed</p>
                  <p className="text-xl font-bold">{weather.current.windSpeed} mph</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <ApperIcon name="CloudRain" className="w-6 h-6 mb-2" />
                  <p className="text-sm opacity-75 mb-1">Precipitation</p>
                  <p className="text-xl font-bold">{weather.current.precipitation}%</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-5 gap-3">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    <p className="text-sm font-semibold text-gray-900 mb-3">{day.day}</p>
                    <ApperIcon name={day.icon} className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{day.high}°</span>
                      <span className="text-sm text-gray-500">{day.low}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Hourly Forecast</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">{hour.time}</p>
                    <p className="text-lg font-bold text-gray-900">{hour.temperature}°</p>
                    <p className="text-xs text-gray-600 mt-1">{hour.precipitation}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Farming Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rec.color} flex items-center justify-center flex-shrink-0`}>
                      <ApperIcon name={rec.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-light/5">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-info to-blue-600 flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Info" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Weather Alert</h4>
                <p className="text-sm text-gray-600">
                  Mild conditions expected throughout the week. Perfect for most farming activities.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated: {new Date(weather.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;