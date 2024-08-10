import CountryView from "./CountryView"

const CountriesDisplay = ({ countriesList, onClick, show, countryIndex, weather, setWeather}) => {
    
    if (countriesList.length > 10){
        return(
            <div> Too many matches, specify another filter</div>
        )
    } 
    else if (countriesList.length < 10 && countriesList.length > 1){
        
        if (!show){
            return(
                <div>
                  {countriesList.map((c, index) => 
                    
                        <li key={c.name.common}>
                            {c.name.common} 
                            <button onClick={() => onClick(index)}>Show</button>
                        </li>
                  )}
                </div>
              )
        } 
        else {
            return (
                <CountryView countriesList={countriesList} 
                    index={countryIndex} 
                    weather={weather} 
                    setWeather={setWeather} />
            ) 
        }
        
    }
    else if (countriesList.length === 1) {

        return(
            <CountryView countriesList={countriesList} 
                index={countryIndex} 
                weather={weather} 
                setWeather={setWeather}/>
        )
    }
}

export default CountriesDisplay