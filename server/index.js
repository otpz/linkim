const express = require('express')
const cors = require('cors')
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//routes
app.use('/', require('./routes/routes'))


const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})