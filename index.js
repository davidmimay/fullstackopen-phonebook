require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

const secretKey = process.env.MONGODB_KEY
const url = `mongodb+srv://davidmimay_db_user:${secretKey}@clustergooglecloud.qvqbgpj.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterGoogleCloud`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.static('frontend/dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Routes
app.get('/', (request, response) => {
  response.send('<h1>Server running...</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()
    response.send(`
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      </div>
    `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
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
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})