# 🌤️ Weather Dashboard

A modern, responsive weather dashboard application that provides real-time weather information and forecasts using the OpenWeatherMap API.

## Features

### Current Weather
- 🌡️ **Current Temperature** - Real-time temperature with "feels like" information
- 📍 **Location Information** - City name and country
- 🌦️ **Weather Conditions** - Weather icon and description
- 📊 **Detailed Metrics:**
  - Humidity percentage
  - Wind speed
  - Atmospheric pressure
  - Visibility
  - Sunrise and sunset times

### Weather Forecast
- 📅 **5-Day Forecast** - Upcoming weather for the next 5 days
- 🌡️ **Temperature Range** - Min and max temperatures
- 🎨 **Weather Icons** - Visual representation of conditions

### Smart Search
- 🔍 **City Search** - Search for any city worldwide
- 📌 **Autocomplete Suggestions** - Real-time suggestions while typing
- 📍 **Geolocation** - Use current location for instant weather
- 💾 **Recently Searched** - Quick access to last 10 searched cities

### User Experience
- 💾 **Local Storage** - Saves searched cities automatically
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ✨ **Smooth Animations** - Elegant transitions and loading states
- 🎨 **Modern Design** - Beautiful gradient UI with intuitive layout

## API Integration

This dashboard uses the **OpenWeatherMap API** with the following endpoints:

1. **Geocoding API** - Convert city names to coordinates
   ```
   GET /geo/1.0/direct?q={city}&appid={API_KEY}
   ```

2. **Current Weather API** - Get current weather data
   ```
   GET /data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
   ```

3. **5-Day Forecast API** - Get weather forecast
   ```
   GET /data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
   ```

## Files

```
weather-dashboard/
├── index.html              # HTML structure
├── weather-styles.css      # Styling and responsive design
├── weather-script.js       # Application logic
└── WEATHER-README.md       # Documentation
```

## How to Use

### 1. Search for a City
- Type a city name in the search box
- Select from autocomplete suggestions or click "Search"
- View current weather and 5-day forecast

### 2. Use Your Location
- Click the 📍 button to get weather for your current location
- Requires location permission from your browser

### 3. Recently Searched Cities
- Click any city in the "Recently Searched" section
- Up to 10 recent searches are saved automatically
- Remove a city by clicking the × button

## Installation

1. Clone or download the weather dashboard files
2. Open `index.html` in a web browser
3. No installation required - works in all modern browsers!

## API Key

The application includes a working OpenWeatherMap API key. For production use:

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Get your free API key
3. Replace the `apiKey` variable in `weather-script.js`

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ Geolocation requires HTTPS or localhost

## Technical Details

### Class-Based Architecture
- Single `WeatherDashboard` class manages all functionality
- Clean separation of concerns
- Easily maintainable and extendable

### Data Storage
- **localStorage** - Stores recently searched cities
- Auto-load last searched city on page load

### Error Handling
- User-friendly error messages
- Graceful handling of API failures
- Validation for empty searches

### Performance
- Async/await for smooth data fetching
- Loading spinner for better UX
- Optimized DOM updates

## Unit Conversions

- 🌡️ **Temperature**: Celsius (°C)
- 💨 **Wind Speed**: Meters per second (m/s)
- 🔍 **Visibility**: Kilometers (km)
- ⚖️ **Pressure**: Hectopascals (hPa)

## Tips & Tricks

1. **Quick Search**: Press Enter key instead of clicking Search button
2. **Saved Cities**: Recently searched cities are saved automatically
3. **Mobile**: Use the location button for fastest results on mobile
4. **Forecast**: Scroll right on mobile to see all 5 days

## Customization

You can customize:

- **Colors**: Edit CSS variables in `:root` in `weather-styles.css`
- **API Key**: Update `this.apiKey` in `weather-script.js`
- **Layout**: Modify grid sizes in media queries for different screen sizes
- **Features**: Extend the `WeatherDashboard` class with new methods

## Troubleshooting

### Weather data not loading
- Check internet connection
- Verify API key is valid
- Check browser console for error messages
- Ensure city name is spelled correctly

### Geolocation not working
- Enable location access in browser settings
- Use HTTPS or localhost (browser requirement)
- Check if browser supports Geolocation API

### Suggestions not appearing
- Ensure you've typed at least 2 characters
- Check if city name is valid
- Verify internet connection

## License

MIT License - Feel free to use and modify for your projects!

## Weather Data Provider

Powered by [OpenWeatherMap](https://openweathermap.org/) - Accurate weather data and forecasts worldwide.

## Created By

Naveen Weather Dashboard - 2026
