const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');
const MUSTACHE_MAIN_DIR = './main.mustache';

const CONFIG = require("../corimb/services-config/config.json")
/**
  * DATA is the object that contains all
  * the data to be provided to Mustache
  * Notice the "name" and "date" property.
*/
let DATA = {
  name: 'Corina',
  date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Madrid',
  }),
};
/**
  * A - We open 'main.mustache'
  * B - We ask Mustache to render our file with the data
  * C - We create a README.md file with the generated output
  */

 async function setWeatherInformation() {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=madrid&appid=${CONFIG.API_KEY}&units=metric`
    )
      .then(r => r.json())
      .then(r => {
        DATA.city_temperature = Math.round(r.main.temp);
        DATA.city_weather = r.weather[0].description;
        DATA.city_weather_icon = r.weather[0].icon;
        DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Madrid',
        });
        DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Madrid',
        });
      });
  }

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log(output)
  });
}


async function action() {
    /**
     * Fetch Weather
     */
    await setWeatherInformation();
  
    /**
     * Generate README
     */
    generateReadMe();
  }
  
  action();