/*
 * It gets the pageId.html file and then puts the data into the app div
 * pageId - This is the id of the page that you want to change to.
 */
export function changePage(pageId) {
    /* Using the jQuery get method to get the pageId.html file and then it is using the jQuery html
    method to put the data into the app div. */
    $.get(`pages/${pageId}.html`, function(data) {
        $("#app").html(data);
        getInfo();
    })
    
};

function getInfo() {
    // Create constants to retrieve the base URL and API key
    const baseurl = `https://api.weatherapi.com/v1/forecast.json?key=`;
    const apikey = `958a504c2c94412cb2a204804232808`;

    // Attach a click event listener to the element with the id "submit"
    $("#submit").on("click", (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Get values from input fields
        let cityInput = $("#city").val();
        let zipInput = $("#zip").val();
        let forecastDays = $("#forecastDays").val();

        // Check if forecastDays is empty or not a valid number
    if (!forecastDays || isNaN(forecastDays)) {
        // Set a default value for forecastDays
        forecastDays = 7;
    } 
    // Check if forecastDays is greater than 7
    if (forecastDays > 7) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter 7 days or less',
          })
    } else {
        Swal.fire(
            'Success!',
            'Forecast generated below.',
            'success'
          )
    }

        // Check if either cityInput or zipInput is not empty
        if (cityInput !== '' || zipInput !== '') {
            
            let apiUrl;

            // Construct the API URL based on user input
            if (cityInput !== '') {
                
                // If a city is provided, construct the city API URL
                apiUrl = `${baseurl}${apikey}&q=${cityInput}&days=7&aqi=no&alerts=no`;
            } else if (zipInput !== '') {
                
                // If a zip code is provided, construct the zip code API URL
                apiUrl = `${baseurl}${apikey}&q=${zipInput}&days=7&aqi=no&alerts=no`;
            }

            // Make an AJAX request to the API and handle the response
            $.getJSON(apiUrl, (data) => {
                console.log(data);

                // Extract and store location-related data
                const cityName = data.location.name;
                const forecastCityName = data.location.name;
                const region = data.location.region;
                const localTime = data.location.localtime;

                // Extract and store current weather data
                const currentWeather = data.current.condition.text;
                const temperature = data.current.temp_c;
                const iconUrl = data.current.condition.icon;

                // Limit the display of forecast days based on user input
                const numberOfForecastDays = parseInt(forecastDays);
                const forecastContainer = $("#forecast-container");
                const forecastDayElements = forecastContainer.find(".home-day");

                // Remove excess forecast day elements
                for (let i = numberOfForecastDays; i < forecastDayElements.length; i++) {
                    $(forecastDayElements[i]).remove();
                }

                // Loop through forecast data for each day and update the DOM
                for (let i = 0; i < numberOfForecastDays; i++) {
                    const dayData = data.forecast.forecastday[i].day;
                    const dayElement = $(".home-day").eq(i);
                    
                    // Update forecast day information
                    dayElement.find("#forecastDate").text(data.forecast.forecastday[i].date);
                    dayElement.find("#avg-temp").text(`Average Temp: ${dayData.avgtemp_c}°C`);
                    dayElement.find("#max-temp").text(`Max Temp: ${dayData.maxtemp_c}°C`);
                    dayElement.find("#low-temp").text(`Low Temp: ${dayData.mintemp_c}°C`);
                    dayElement.find("#forecast-txt").text(dayData.condition.text);
                    dayElement.find("#forecast-icon").attr("src", dayData.condition.icon);
                }

                // Display basic weather information in the DOM
                // Location information
                $('#forecast-city-name').text(`Forecast for the Week: ${forecastCityName}`);
                $("#city-name").text(cityName);
                $("#region").text(region);
                $("#local-time").text(localTime);

                // Current weather information
                $("#temperature").text(`${temperature}°C`);
                $("#currentWeather").text(currentWeather);
                $("#weather-icon").attr("src", iconUrl);

            }).fail(function(e) {
                console.log("error", e);
            });
        } else {
            // Display an alert if either city/zip or forecastDays are empty
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter either a city or zip code and specify the number of forecast days.',
                
              })
        }
    });
}
