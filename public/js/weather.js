function fetchWeather(city = 'An Giang', apiKey = '4aabef534d426073a54e9163fe76578d') {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const temperature = data.main.temp;
			const weatherDescription = data.weather[0].description;
			const cityName = data.name;

			const weatherElement = document.getElementById('weather');
			if (weatherElement) {
				weatherElement.innerHTML = `
					<a href="/weather" style="text-decoration: none; color: inherit;">
						<i class="fa fa-cloud-sun"></i> ${temperature}°C, ${weatherDescription} in ${cityName}
					</a>
				`;
			}
		})
		.catch(error => {
			console.error('Error fetching weather data:', error);
			const weatherElement = document.getElementById('weather');
			if (weatherElement) {
				weatherElement.innerHTML = '<a href="/weather" style="color:red;">Failed to load weather</a>';
			}
		});
}