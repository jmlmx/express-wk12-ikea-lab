require('dotenv').config()
const app = require('./app')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => console.log('Mongo is doing its thing'))

app.listen(PORT, () => {
    console.log(`We are hot and rollin' on port ${PORT}`)
})