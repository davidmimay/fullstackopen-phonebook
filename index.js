const express = require('express')
const app = express()

// Data
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// Middleware
app.use(express.json())

// Routes
app.get('/', (request, response) => {
  response.send('<h1>Server running...</h1>')
})

app.get('/info', (request, response) => {
  const count = persons.length
  const date = new Date()

  response.send(`
    <div>
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    </div>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id' , (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const randomId = () =>{
  const maxId  = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return Math.floor(Math.random() * 10000) + maxId + 1
}

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = {
    id: randomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  
  response.json(person)
})

// Server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})