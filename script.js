var displayText = document.querySelector('.displayText');
displayText.style.whiteSpace = 'pre';

var weatherImage = [
  {
    weather: "none",
    image: [
      "             ",
      "             ",
      "             ",
      "             ",
      "             "
    ]
  },
  {
    weather: "unknown",
    image: [
      "    .-.      ",
      "     __)     ",
      "    (        ",
      "     `-᾿     ",
      "      •      ",
    ]
  },
  {
    weather: "overcast clouds",
    image: [
      "             ",
      "     .--.    ",
      "  .-(    ).  ",
      " (___.__)__) ",
      "             "
    ]
  },
  {
    weather: "light rain",
    image: [
      "     .-.     ",
      "    (   ).   ",
      "   (___(__)  ",
      "    ʻ ʻ ʻ ʻ  ",
      "   ʻ ʻ ʻ ʻ   "
    ]
  },
  {
    weather: "few clouds",
    image: [
      "   \\  /      ",
      " _ /\"\".-.    ",
      "   \\_(   ).  ",
      "   /(___(__) ",
      "             "
    ] 
  },
  {
    weather: "clear sky",
    image: [
      "    \\   /    ",
      "     .-.     ",
      "  ‒ (   ) ‒  ",
      "     `-'     ",
      "    /   \\    "
    ] 
  },
  {
    weather: "scattered clouds",
    image: [
      "             ",
      "     .--.    ",
      "  .-(    ).  ",
      " (___.__)__) ",
      "             "
    ]
  },
  {
    weather: "broken clouds",
    image: [
      "             ",
      "     .--.    ",
      "  .-(    ).  ",
      " (___.__)__) ",
      "             "
    ]
  }
]

var windDir = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];

function getDirection(deg){
  return windDir[Math.floor((deg+22)%360/45)];
}

var currentWeather = [];
fetch('https://api.openweathermap.org/data/2.5/weather?id=1621176&appid=81106a5685c492efbc1759f69e9c262f&lang=en&units=metric')
  .then(
    function(response){
      if (response.status !== 200){
        console.log('error');
        return
      }

      response.json().then(results => {
        displayText.textContent += 'Prakiraan cuaca: ' + results.name + '\n';
        var weather = results.weather[0].description;
        let image = weatherImage.find(item => item.weather === weather);
        if (!image) {
          image = weatherImage.find(item => item.weather === 'unknown');
        }
        
        displayText.textContent += '\n' + image.image[0] + results.weather[0].description; 
        displayText.textContent += '\n' + image.image[1] + results.main.temp_min + '\xB0-' + results.main.temp_max + '\xB0 C';
        displayText.textContent += '\n' + image.image[2] + getDirection(results.wind.deg) + results.wind.speed;
        displayText.textContent += '\n' + image.image[3] + results.main.humidity + '%';
        displayText.textContent += '\n' + image.image[4] + results.main.pressure + ' hPa\n\n';

        fetch('https://api.openweathermap.org/data/2.5/forecast?id=1621176&appid=81106a5685c492efbc1759f69e9c262f&lang=en&units=metric')
        .then(
          function(dailyForecasts){
            dailyForecasts.json().then(forecasts => {
              var forecastArray = [];

              var forecast3days = forecasts.list.map(data => {
                var itemDatetime = new Date(data.dt*1000);
                var itemDate = itemDatetime.getDate();
                var itemTime = itemDatetime.getHours();
                var maxDate = new Date().getDate() + 2;

                if (itemDate <= maxDate){
                  var findDate = forecastArray.filter(data => data.date === itemDate);
                  if (findDate.length === 0){
                    forecastArray.push({
                      date: itemDate,
                      datelong: itemDatetime.toDateString(),
                      forecast3hours: []
                    });
                  }
                }
              });

              var forecast3hours = forecastArray.map(data => {
                forecasts.list.map(item => {
                  var itemDatetime = new Date(item.dt*1000);
                  var itemDate = itemDatetime.getDate();
                  var itemTime = itemDatetime.getHours();
                  if (itemDate === data.date) {
                    if (itemTime === 7 || itemTime === 13 || itemTime === 19 || itemTime === 22){
                     data.forecast3hours.push(item);
                    } 
                  };
                });
              });
              
              for (i=0; i<forecastArray.length; i++){
                var forecast = forecastArray[i];
                var date = forecast.datelong;
                var forecastByTime = forecast.forecast3hours;
                displayText.textContent += '\n                                                         ┌─────────────┐';
                displayText.textContent += '\n┌───────────────────────────────┬────────────────────────┤  '+ String(date).substring(0, 10) + ' ├────────────────────────┬──────────────────────────────┐';
                displayText.textContent += '\n│              Pagi             │            Siang       └──────┬──────┘      Petang            │             Malam            │';
                displayText.textContent += '\n├───────────────────────────────┼───────────────────────────────┼───────────────────────────────┼──────────────────────────────┤';
                
                var morning = forecastByTime.filter(data => new Date(data.dt*1000).getHours() === 7);
                var morningWeather = morning.length > 0 ? morning[0].weather[0].description : '';
                var morningTemp = morning.length > 0 ? morning[0].main.temp_min + '-' + morning[0].main.temp_max + ' C' : '';
                var morningWind = morning.length > 0 ? getDirection(morning[0].wind.deg) + morning[0].wind.speed + ' m/s' : '';
                var morningHumidity = morning.length > 0 ? morning[0].main.humidity + '%' : '';
                var morningPressure = morning.length > 0 ? morning[0].main.pressure + ' hPa' : '';
                let morningImage;
                if (morning.length > 0){
                  morningImage = weatherImage.filter(data => data.weather === morning[0].weather[0].description);
                  if (morningImage.length === 0) {
                    morningImage = weatherImage.filter(data => data.weather === 'unknown');
                  }
                } else {
                  morningImage = weatherImage.filter(data => data.weather === 'none');
                }

                var noon = forecastByTime.filter(data => new Date(data.dt*1000).getHours() === 13);
                var noonWeather = noon.length > 0 ? noon[0].weather[0].description : '';
                var noonTemp = noon.length > 0 ? noon[0].main.temp_min + '-' + noon[0].main.temp_max + ' C' : '';
                var noonWind = noon.length > 0 ? getDirection(noon[0].wind.deg) + noon[0].wind.speed + ' m/s' : '';
                var noonHumidity = noon.length > 0 ? noon[0].main.humidity + '%' : '';
                var noonPressure = noon.length > 0 ? noon[0].main.pressure + ' hPa' : '';
                let noonImage;
                if (noon.length > 0){
                  noonImage = weatherImage.filter(data => data.weather === noon[0].weather[0].description); 
                  if (noonImage.length === 0) {
                    noonImage = weatherImage.filter(data => data.weather === 'unknown');
                  }
                } else {
                  noonImage = weatherImage.filter(data => data.weather === 'none');
                }

                var evening = forecastByTime.filter(data => new Date(data.dt*1000).getHours() === 19);
                var eveningWeather = evening.length > 0 ? evening[0].weather[0].description : '';
                var eveningTemp = evening.length > 0 ? evening[0].main.temp_min + '-' + evening[0].main.temp_max + ' C' : '';
                var eveningWind = evening.length > 0 ? getDirection(evening[0].wind.deg) + evening[0].wind.speed + ' m/s' : '';
                var eveningHumidity = evening.length > 0 ? evening[0].main.humidity + '%' : '';
                var eveningPressure = evening.length > 0 ? evening[0].main.pressure + ' hPa' : '';
                let eveningImage;
                if (evening.length > 0){
                  eveningImage = weatherImage.filter(data => data.weather === evening[0].weather[0].description);
                  if (eveningImage.length === 0) {
                    eveningImage = weatherImage.filter(data => data.weather === 'unknown');
                  }
                } else {
                  eveningImage = weatherImage.filter(data => data.weather === 'none');
                }

                var night = forecastByTime.filter(data => new Date(data.dt*1000).getHours() === 22);
                var nightWeather = night.length > 0 ? night[0].weather[0].description : '';
                var nightTemp = night.length > 0 ? night[0].main.temp_min + '-' + night[0].main.temp_max + ' C' : '';
                var nightWind = night.length > 0 ? getDirection(night[0].wind.deg) + night[0].wind.speed + ' m/s' : '';
                var nightHumidity = night.length > 0 ? night[0].main.humidity + '%' : '';
                var nightPressure = night.length > 0 ? night[0].main.pressure + ' hPa' : '';
                let nightImage;
                if (night.length > 0){
                  nightImage = weatherImage.filter(data => data.weather === night[0].weather[0].description); 
                  if (nightImage.length === 0) {
                    nightImage = weatherImage.filter(data => data.weather === 'unknown');
                  }
                } else {
                  nightImage = weatherImage.filter(data => data.weather === 'none');
                }

                displayText.textContent += '\n│' + morningImage[0].image[0] + '  ' + morningWeather.padEnd(16, ' ') + '│' + noonImage[0].image[0] + '  ' + noonWeather.padEnd(16, ' ') + '│' + eveningImage[0].image[0] + '  ' + eveningWeather.padEnd(16, ' ') + '│' + nightImage[0].image[0] + ' ' + nightWeather.padEnd(16, ' ') + '│';
                displayText.textContent += '\n│' + morningImage[0].image[1] + '  ' + morningTemp.padEnd(16, ' ') + '│' + noonImage[0].image[1] + '  ' + noonTemp.padEnd(16, ' ') + '│' + eveningImage[0].image[1] + '  ' + eveningTemp.padEnd(16, ' ') + '│' + nightImage[0].image[1] + ' ' + nightTemp.padEnd(16, ' ') + '│';
                displayText.textContent += '\n│' + morningImage[0].image[2] + '  ' + morningWind.padEnd(16, ' ') + '│' + noonImage[0].image[2] + '  ' + noonWind.padEnd(16, ' ') + '│' + eveningImage[0].image[2] + '  ' + eveningWind.padEnd(16, ' ') + '│' + nightImage[0].image[2] + ' ' + nightWind.padEnd(16, ' ') + '│';
                displayText.textContent += '\n│' + morningImage[0].image[3] + '  ' + morningHumidity.padEnd(16, ' ') + '│' + noonImage[0].image[3] + '  ' + noonHumidity.padEnd(16, ' ') + '│' + eveningImage[0].image[3] + '  ' + eveningHumidity.padEnd(16, ' ') + '│' + nightImage[0].image[3] + ' ' + nightHumidity.padEnd(16, ' ') + '│';
                displayText.textContent += '\n│' + morningImage[0].image[4] + '  ' + morningPressure.padEnd(16, ' ') + '│' + noonImage[0].image[4] + '  ' + noonPressure.padEnd(16, ' ') + '│' + eveningImage[0].image[4] + '  ' + eveningPressure.padEnd(16, ' ') + '│' + nightImage[0].image[4] + ' ' + nightPressure.padEnd(16, ' ') + '│';
                displayText.textContent += '\n└───────────────────────────────┴───────────────────────────────┴───────────────────────────────┴──────────────────────────────┘';
              }
            });
          }
        )
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
