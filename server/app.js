const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const PORT = 3000

const fileRouter = require('./routes/file')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/file', express.static('uploads'))

app.use('/file', fileRouter)

app.listen(PORT, () => {
    console.log(`Server Start!!, port is ${PORT}`)
})