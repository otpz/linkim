const express = require('express')
const cors = require('cors')
const app = express()

const sql = require('mssql/msnodesqlv8')

const config = {
  server: "DESKTOP-NH5JSVA",
  database: "linkim",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
}

const connectDB = () => {
  try {
    sql.connect(config, (err) => {
      if (err) console.log(err)
      else console.log('Database connected 🚀')
    })
  } catch (err) {
    console.log(err)
  }
}

connectDB()


// middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


//routes
app.use('/', require('./routes/routes'))


const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`)
})


module.exports = sql