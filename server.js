const express = require('express')
const connectDB = require('./config/db')
const app = express()

// Init DB
connectDB()

// Init middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API RUNNING !!!'))

// Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`))
