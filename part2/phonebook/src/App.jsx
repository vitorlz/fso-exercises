import { useState } from 'react'
import SearchFilter from './Components/SearchFilter'
import AddPersonForm from './Components/AddPersonForm'
import PersonList from './Components/PersonList'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredList, setFiltered] = useState([...persons])

  const addName = (event) => {
    event.preventDefault()
    const findDuplicate = persons.filter(person => person.name.trim() === newName.trim())

    if(findDuplicate.length === 0){
      const updatedPersons = [...persons, {name: newName, number: newNumber}]
      setPersons(updatedPersons)
      setNewName('')
      setNewNumber('')
      setFiltered(updatedPersons.filter(person => person
        .name
        .toLowerCase()
        .includes(search.toLowerCase())))
    } 
    else {
      alert(`${newName} is already added to phonebook`)
    }
  
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setFiltered(persons.filter(person => person
      .name
      .toLowerCase()
      .includes(event.target.value.toLowerCase())))
  }

  return(
    <div>
      <h2>Phonebook</h2>
      <SearchFilter value={search} onChange={handleSearch} />
      <h1>Add a new person</h1>
      <AddPersonForm 
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <PersonList list={filteredList}/>
    </div>
  )
}

export default App
