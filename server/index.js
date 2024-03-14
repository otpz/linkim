const express = require('express')
const dotenv = require('dotenv').config()
const sql = require('mssql/msnodesqlv8')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const path = require('path')
const exceptionMiddleware = require('./middlewares/exceptionMiddleware')
const userLocalMiddleware = require('./middlewares/userLocalMiddleware')
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs');


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
app.use(express.static(__dirname));
app.use(session({
  name: 'sessionid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
  },
}))
app.use(userLocalMiddleware)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

//routes
app.use('/', require('./routes/routes'))

//error middleware
app.use(exceptionMiddleware)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`)
})

module.exports = sql