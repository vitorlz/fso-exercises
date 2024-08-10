import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Filter from './components/Filter'
import CountriesDisplay from './components/CountriesDisplay'
import axios from 'axios'

function App() {
 
  const [search, setSearch] = useState("")
  const [countries, setCountries] = useState([])
  const [show, setShow] = useState(false)
  const [countryIndex, setCountryIndex] = useState(0)
  const [weather, setWeather] = useState({ temperature: null, wind: null, icon: null })

  useEffect(() => {
    
    if(search !== ""){
      countryService.getAll().then(countryList => {
        setCountries(countryList.filter(country => country
          .name
          .common
          .toLowerCase()
          .includes(search.trim())))

        setShow(false)
      })

    } else{
      setCountries([])
    }
    
  }    
  , [search])

  const handleFilterChange = (event) => {
    const userInput = event.target.value
    setSearch(userInput.toLowerCase())
  }

  const handleShowOnClick = (index) => {
 
    setShow(!show)
    setCountryIndex(index)
    
  }

  
  return(
  <div>
    <Filter value={search} onChange={handleFilterChange} />
    <CountriesDisplay countriesList={countries} 
      onClick={handleShowOnClick} 
      show={show} 
      countryIndex={countryIndex}
      weather={weather}
      setWeather={setWeather} />
  </div>
 )
}

export default App
