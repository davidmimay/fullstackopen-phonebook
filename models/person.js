const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const secretKey = process.env.MONGODB_KEY
const url = `mongodb+srv://davidmimay_db_user:${secretKey}@clustergooglecloud.qvqbgpj.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ClusterGoogleCloud`

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  }
})

// ELIMINAMOS personSchema.plugin(uniqueValidator) que causaba el conflicto

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)