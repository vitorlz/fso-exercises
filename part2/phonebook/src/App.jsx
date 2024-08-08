import { useState, useEffect } from 'react'
import SearchFilter from './Components/SearchFilter'
import AddPersonForm from './Components/AddPersonForm'
import PersonList from './Components/PersonList'
import axios from 'axios'
import personService from './services/persons'
import Notification from './Components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredList, setFiltered] = useState([])
  const [notification, setNotification] = useState(
    {
      msg: null,
      color: null
    }
  )

  useEffect(() => {
    
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
      setFiltered(initialPersons)
    })

  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const findDuplicate = persons.filter(person => person.name.trim() === newName.trim())
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if(findDuplicate.length === 0){

      personService.create(newPerson).then(returnedPerson => {
        const updatedPersons = [...persons, returnedPerson]
        setPersons(updatedPersons)
        setNewName('')
        setNewNumber('')
        setFiltered(updatedPersons.filter(person => person
          .name
          .toLowerCase()
          .includes(search.toLowerCase())))
        setNotification(
          {
            msg: `Added ${newName}`,
            color: "green"
          }
        )
        setTimeout(() => {
          setNotification({ msg: null, color: null })
        }, 5000)
      })
    } 
    else {
      const confirmationMsg = `${newName} is already added to phonebook, replace the old number with a new one?`

      if(confirm(confirmationMsg)) {
        const newNameId = findDuplicate[0].id

        personService.update(newNameId, newPerson).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== newNameId ? person : returnedPerson))
          setFiltered(persons.map(person => person.id !== newNameId ? person : returnedPerson))
          setNotification(
            {
              msg: `Updated ${newName}'s number`,
              color: 'green'
            }
          )
          setTimeout(() => {
            setNotification({ msg: null, color: null })
          }, 5000)
        })
        .catch(error => {
          setNotification( 
            {
              msg: `Information of ${newName} has already been removed from the server`,
              color: 'red'
            }
          )
          setPersons(persons.filter(p => p.id !== newNameId))
          setFiltered(persons.filter(p => p.id !== newNameId))
          setTimeout(() => {
            setNotification({ msg: null, color: null })
          }, 5000)
        })

    }
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

  const handleDeletion = (id) => {
    
    const toBeDeleted = persons.find(person => person.id === id).name

    if(confirm(`Delete ${toBeDeleted}?`)){
      personService.deleteById(id).then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
        setFiltered(persons.filter(person => person.id !== id))
      })
    }
  }

  return(
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.msg} color={notification.color} />
      <SearchFilter value={search} onChange={handleSearch} />
      <h2>Add a new person</h2>
      <AddPersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <PersonList list={filteredList} handleDeletion={handleDeletion}/>
    </div>
  )
}

export default App
