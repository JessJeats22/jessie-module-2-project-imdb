// * Importing Dependencies
import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'
import path from 'path';
import session from 'express-session'
import MongoStore from 'connect-mongo'



// * Importing Controllers
import authRouter from './controllers/auth.js'

// * Importing Middleware
import isSignedIn from './middleware/is-signed-in.js';

const app = express()

// * Calling Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
    })
);


// * Calling Session Middleware

// * Calling controllers/Routers - intructing Express app to use certain controllers based on URL pattern
app.use("/auth", authRouter); 



// * ROUTES 

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});


// * Connections
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔒 Database connection established')
  } catch (error) {
    console.error(error)
  }
}
connect()


// * Server
app.listen(3000, () => console.log('Server up and running on port 3000'))