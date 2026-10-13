import { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'

// Components
const Filter = ({filterName, handleFilterChange}) => (
  <p>Filter shown with <input value={filterName} onChange={handleFilterChange}/></p>
)

const PersonsForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <div>
    <form onSubmit={addName}>
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div><button type="submit">add</button></div>
    </form>
  </div>
)

const Person = ({person, deletePerson}) => (
  <p>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id, person.name)}>X</button>
  </p>
)

const Persons = ({filterDisplay, deletePerson}) => (
  <div>
    {filterDisplay.map(person => <Person key={person.id} person={person} deletePerson={deletePerson} />)}
  </div>
)

const Notification = ({type, message}) => {
  if (message === null){
    return null
  }
  return (<div className={`notification ${type}`}>{message}</div>)
}

const App = () => {
  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  // Event handlers
  const addName = (event) => {
    event.preventDefault()
    console.log('Button clicked', event.target);

    const oldName = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if (oldName) {
      console.log('Cannot add it, perhaps update')
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, want to update?`)
      if (confirmUpdate) {
        const updatedPerson = { ...oldName, number: newNumber}
        personService
          .update(oldName.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== oldName.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${newName}`, 'success')
          })
          .catch(error => {
            console.log('Error updating person', error)
            showNotification(`Information of '${oldName.name}' has already been removed from server`, 'error')
            setPersons(persons.filter(person => person.id !== oldName.id))
          })
      }
    }

    else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Created ${returnedPerson.name}`, 'success')
        })
        .catch(error => {
          console.log('Error saving person', error)
          showNotification(`Cannot save contact`, 'error')
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`, 'success')
        })
        .catch(error => {
          console.log(`The person ${name} was already deleted from server`, error)
          showNotification(`Information of '${name}' has already been removed from server`, 'error')
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const showNotification = (message, type) => {
    setErrorMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  // Array
  const filterDisplay = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
  
  // Effect
  useEffect (() => {
    console.log('Effect')
    personService
      .getAll()
      .then(initialPersons => setPersons (initialPersons))
      .catch((err) => {
        console.log(err)
      })
  }, [])

  // Interface
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={messageType} />
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}/>
      <h3>Create</h3>
      <PersonsForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <div><i>debug: {newName} {newNumber}</i></div>
      <Persons filterDisplay={filterDisplay} deletePerson={deletePerson}/>
    </div>
  )
}

export default App