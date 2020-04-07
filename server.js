const express = require('express')

const app = express()

// Init middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API RUNNING !!!'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`))
