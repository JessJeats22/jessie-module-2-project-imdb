// * Importing Dependencies
import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'
import path from 'path';





// * Importing Controllers
import authRouter from './controllers/auth.js'

// * Importing Middleware

const app = express()

// * Calling Middleware

// * Calling Session Middleware

// * Calling controllers/Routers - intructing Express app to use certain controllers based on URL pattern
app.use("/auth", authRouter); 



// * ROUTES 

app.get ('/', (req, res) => {
    res.render('index.ejs')
})


// * Server
app.listen(3000, () => console.log('Server up and running on port 3000'))