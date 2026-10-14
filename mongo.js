const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://davidmimay_db_user:${password}@clustergooglecloud.qvqbgpj.mongodb.net/?appName=ClusterGoogleCloud`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Save contact
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} 
// Show contacts if password only is provided
else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Please provide correct arguments: node mongo.js <password> <name> <number>')
  mongoose.connection.close()
}