// * Importing Dependencies

import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'

const app = express()

// * Middleware




// * ROUTES 

app.get ('/', (req, res) => {
    res.send('My server is up and running!')
})


// * Server

app.listen(3000, () => console.log('Server up and running on port 3000'))