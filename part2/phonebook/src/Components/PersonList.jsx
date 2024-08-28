import Person from "./Person"

const PersonList = ({list, handleDeletion}) => {

    console.log(list)

    return(
        <ul>
            {list.map(person => 
                <Person key={person.name} person={person} handleDeletion={handleDeletion} />)}
        </ul>
    )
}

export default PersonList