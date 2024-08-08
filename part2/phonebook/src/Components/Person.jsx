const Person = ({person, handleDeletion}) => {
    
    return(
        <div>
            <li key={person.name}>
                {person.name} {person.number}
                <button onClick={() => handleDeletion(person.id)}>delete</button>
            </li>
           
        </div>
    )
    
}

export default Person