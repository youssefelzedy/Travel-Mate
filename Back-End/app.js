const express = require('express')
const dbConnect = require('./dbConnect')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
// for secure 
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')

const cookieParser = require('cookie-parser')
const errorControllers = require(`${__dirname}/controllers/errorControllers`)

dotenv.config()

if (process.env.NODE_ENV === 'development') {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
}

const userRoutes = require('./routes/userRoutes')
const placeRoutes = require('./routes/placeRoutes')
const journeyRoutes = require(`${__dirname}/routes/journeyRoutes`)

dbConnect()
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use('/api', limiter)

app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())

// api routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/places', placeRoutes)
app.use('/api/v1/journeys', journeyRoutes)


app.use(errorControllers)
module.exports = app
