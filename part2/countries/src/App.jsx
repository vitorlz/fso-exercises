import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Filter from './components/Filter'
import CountriesDisplay from './components/CountriesDisplay'

function App() {
 
  const [search, setSearch] = useState("")
  const [countries, setCountries] = useState([])
  const [show, setShow] = useState(false)
  const [countryIndex, setCountryIndex] = useState(0)

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
                      countryIndex={countryIndex} />
  </div>
 )
}

export default App
