import axios from "axios"

const api_key = import.meta.env.VITE_WEATHER_KEY
const baseUrl = `https://api.openweathermap.org`

const getWeather = (city) => {
    const request = axios.get(`${baseUrl}/data/2.5/weather?q=${city}&appid=${api_key}`)
    return request.then(response => response.data)
}

const getWeatherIcon = (id) => {
    const request = axios.get(`${baseUrl}/img/wn/${id}@2x.png`)
    return request.then(response => response.data)
}


export default { getWeather, getWeatherIcon }