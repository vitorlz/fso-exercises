import Person from "./Person"

const PersonList = ({list}) => {

    console.log(list);
    return(
        <ul>
            {list.map(person => 
                <Person key={person.name} person={person} />)}
        </ul>
    )
}

export default PersonList