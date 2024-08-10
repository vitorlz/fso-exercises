import weatherService from "../services/weather"
import { useEffect } from 'react'

const CountryView = ({ countriesList, index, weather, setWeather}) => {
   
    console.log(countriesList)
    const country = countriesList[index]
    const languages = Object.values(country.languages)

    useEffect(() => {
        weatherService.getWeather(country.capital).
        then(data => {
            const celsius = data.main.temp - 273.15
            const wind = data.wind.speed
            const icon = data.weather[0].icon
            setWeather({ ...weather, temperature: celsius, wind: wind, icon: icon })
            console.log(data)
        })
    }, [])
    
    return(
        <div>
            <h1>{country.name.common}</h1>
            <div>
                <br />
                <div>Capital: {country.capital}</div>
                <div>Area: {country.area}</div>
                <br />
            </div>
            <div>
                <h2>Languages:</h2>
                <ul>
                    {languages.map(language => 
                    <li key={language}>
                        {language}
                    </li>
                    )}
                </ul>
                <img src={country.flags.png} alt="Country flag" />
            </div>
            <div>
                <h2>Weather in {country.capital}</h2>
                <div>Weather {Math.round(weather.temperature * 100) / 100} Celsius</div>
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}></img>
                <div>Wind {weather.wind} m/s</div>
            </div>
        </div>
    )
}

export default CountryView