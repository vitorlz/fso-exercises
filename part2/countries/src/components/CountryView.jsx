const CountryView = ({ countriesList, index }) => {
   
    console.log(countriesList)
    const country = countriesList[index]
    const languages = Object.values(country.languages)

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
        </div>
    )
}

export default CountryView