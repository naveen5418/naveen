// Weather Dashboard Application
class WeatherDashboard {
    constructor() {
        this.apiKey = 'f2e38ccc97afd126be52b79beaf1b5d4'; // OpenWeatherMap API Key
        this.baseUrl = 'https://api.openweathermap.org';
        this.savedCities = JSON.parse(localStorage.getItem('weatherCities')) || [];
        this.currentWeatherData = null;
        this.forecastData = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderSavedCities();
        this.loadDefaultCity();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.currentWeatherSection = document.getElementById('currentWeather');
        this.forecastSection = document.getElementById('forecastSection');
        this.savedCitiesSection = document.getElementById('savedCitiesSection');
        this.welcomeSection = document.getElementById('welcomeSection');
        this.suggestions = document.getElementById('suggestions');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchCity());
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchCity();
        });
        this.cityInput.addEventListener('input', () => this.showSuggestions());
        document.addEventListener('click', (e) => {
            if (e.target !== this.cityInput && e.target !== this.suggestions) {
                this.suggestions.classList.remove('active');
            }
        });
    }

    async searchCity() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        await this.fetchWeather(city);
    }

    async showSuggestions() {
        const query = this.cityInput.value.trim();
        if (query.length < 2) {
            this.suggestions.classList.remove('active');
            return;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`
            );
            const data = await response.json();
            
            this.suggestions.innerHTML = '';
            if (data.length > 0) {
                data.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.textContent = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
                    item.addEventListener('click', () => {
                        this.cityInput.value = `${city.name}, ${city.country}`;
                        this.suggestions.classList.remove('active');
                        this.fetchWeatherByCoords(city.lat, city.lon);
                    });
                    this.suggestions.appendChild(item);
                });
                this.suggestions.classList.add('active');
            } else {
                this.suggestions.classList.remove('active');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    async fetchWeather(city) {
        this.showLoading(true);
        this.clearError();

        try {
            const response = await fetch(
                `${this.baseUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
            );
            const geoData = await response.json();

            if (geoData.length === 0) {
                this.showError('City not found. Please try another search.');
                this.showLoading(false);
                return;
            }

            const { lat, lon, name, country } = geoData[0];
            this.cityInput.value = `${name}, ${country}`;
            await this.fetchWeatherByCoords(lat, lon);
        } catch (error) {
            this.showError('Error fetching weather data. Please try again.');
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        this.showLoading(true);
        this.clearError();

        try {
            // Fetch current weather
            const weatherResponse = await fetch(
                `${this.baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
            );
            this.currentWeatherData = await weatherResponse.json();

            // Fetch forecast
            const forecastResponse = await fetch(
                `${this.baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
            );
            this.forecastData = await forecastResponse.json();

            // Update UI
            this.displayCurrentWeather();
            this.displayForecast();
            this.addToSavedCities(this.currentWeatherData.name);
            this.hideWelcome();
        } catch (error) {
            this.showError('Error fetching weather data. Please try again.');
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser.');
            return;
        }

        this.showLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                this.showError('Unable to retrieve your location.');
                this.showLoading(false);
                console.error('Geolocation error:', error);
            }
        );
    }

    displayCurrentWeather() {
        const data = this.currentWeatherData;
        const { main, weather, wind, clouds, sys, visibility } = data;

        // Update elements
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('weatherDate').textContent = this.formatDate(new Date());
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        document.getElementById('temp').textContent = Math.round(main.temp);
        document.getElementById('feelsLike').textContent = Math.round(main.feels_like);
        document.getElementById('weatherDescription').textContent = weather[0].description;
        document.getElementById('humidity').textContent = `${main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
        document.getElementById('pressure').textContent = `${main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
        document.getElementById('sunrise').textContent = this.formatTime(new Date(sys.sunrise * 1000));
        document.getElementById('sunset').textContent = this.formatTime(new Date(sys.sunset * 1000));

        this.currentWeatherSection.classList.remove('hidden');
    }

    displayForecast() {
        const forecasts = this.forecastData.list.filter((_, index) => index % 8 === 0); // Every 24 hours
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        forecasts.slice(0, 5).forEach(forecast => {
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${this.formatDate(new Date(forecast.dt * 1000))}</div>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon" class="forecast-icon">
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-temp-range">${Math.round(forecast.main.temp_min)}° - ${Math.round(forecast.main.temp_max)}°</div>
                <div class="forecast-description">${forecast.weather[0].description}</div>
            `;
            forecastContainer.appendChild(card);
        });

        this.forecastSection.classList.remove('hidden');
    }

    addToSavedCities(city) {
        if (!this.savedCities.includes(city)) {
            this.savedCities.unshift(city);
            if (this.savedCities.length > 10) {
                this.savedCities.pop();
            }
            localStorage.setItem('weatherCities', JSON.stringify(this.savedCities));
            this.renderSavedCities();
        }
    }

    renderSavedCities() {
        const list = document.getElementById('savedCitiesList');
        list.innerHTML = '';

        this.savedCities.forEach(city => {
            const tag = document.createElement('div');
            tag.className = 'city-tag';
            tag.innerHTML = `
                <span class="city-tag-name">${city}</span>
                <button class="city-tag-remove">×</button>
            `;
            
            tag.querySelector('.city-tag-name').addEventListener('click', () => {
                this.fetchWeather(city);
            });
            
            tag.querySelector('.city-tag-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSavedCity(city);
            });

            list.appendChild(tag);
        });

        if (this.savedCities.length > 0) {
            this.savedCitiesSection.classList.remove('hidden');
        }
    }

    removeSavedCity(city) {
        this.savedCities = this.savedCities.filter(c => c !== city);
        localStorage.setItem('weatherCities', JSON.stringify(this.savedCities));
        this.renderSavedCities();
        if (this.savedCities.length === 0) {
            this.savedCitiesSection.classList.add('hidden');
        }
    }

    loadDefaultCity() {
        if (this.savedCities.length > 0) {
            this.fetchWeather(this.savedCities[0]);
        }
    }

    hideWelcome() {
        this.welcomeSection.classList.add('hidden');
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.classList.remove('hidden');
        } else {
            this.loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
        }, 5000);
    }

    clearError() {
        this.errorMessage.classList.remove('show');
    }

    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherDashboard();
});