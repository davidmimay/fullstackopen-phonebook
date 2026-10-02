const express = require('express')
const morgan = require('morgan')
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

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Functions
const randomId = () => {
  const maxId  = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return Math.floor(Math.random() * 10000) + maxId + 1
}

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

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const nameExists = persons.some( person => person.name.toLowerCase() === body.name.toLowerCase())

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
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

// Final Middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})