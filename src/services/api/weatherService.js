const delay = () => new Promise(resolve => setTimeout(resolve, 500));

const weatherService = {
  async getCurrentWeather(location) {
    await delay();
    
    const mockWeather = {
      location: location || "Sacramento, CA",
      current: {
        temperature: 72,
        condition: "Partly Cloudy",
        icon: "CloudSun",
        humidity: 65,
        windSpeed: 12,
        precipitation: 0
      },
      forecast: [
        { day: "Today", high: 75, low: 58, condition: "Partly Cloudy", icon: "CloudSun" },
        { day: "Tomorrow", high: 78, low: 61, condition: "Sunny", icon: "Sun" },
        { day: "Wednesday", high: 73, low: 59, condition: "Cloudy", icon: "Cloud" },
        { day: "Thursday", high: 70, low: 56, condition: "Rain", icon: "CloudRain" },
        { day: "Friday", high: 72, low: 58, condition: "Partly Cloudy", icon: "CloudSun" }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    return mockWeather;
  },

  async getHourlyForecast(location) {
    await delay();
    
    const hours = [];
    for (let i = 0; i < 12; i++) {
      hours.push({
        time: `${(new Date().getHours() + i) % 24}:00`,
        temperature: 65 + Math.floor(Math.random() * 15),
        condition: ["Sunny", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
        precipitation: Math.floor(Math.random() * 30)
      });
    }
    
    return hours;
  }
};

export default weatherService;