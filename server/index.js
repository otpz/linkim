const express = require('express')
const dotenv = require('dotenv').config()
const sql = require('mssql/msnodesqlv8')
const cookieParser = require('cookie-parser')
const ejs = require('ejs');
const path = require('path')

const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

console.log(__dirname)

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB,
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
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

//routes
app.use('/', require('./routes/routes'))

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`)
})


module.exports = sql