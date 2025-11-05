// * Importing Dependencies
import express from 'express'
import morgan from 'morgan'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv/config'
import path from 'path';
import session from 'express-session'
import MongoStore from 'connect-mongo'


// * Importing Controllers / Routers
import authRouter from './controllers/auth.js'
import movieRouter from './controllers/movies.js'
// import reviewRoute from './controllers/reviews.js'


// * Importing Middleware
import isSignedIn from './middleware/is-signed-in.js';
import passUserToView from './middleware/pass-user-to-view'

const app = express()

app.set('view engine', 'ejs');


// * Calling Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
    })
);


// * Calling Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(passUserToView);
app.use(methodOverride('_method'));




// * Calling controllers/Routers - intructing Express app to use certain controllers based on URL pattern
app.use("/auth", authRouter); 
app.use('/movies', isSignedIn, movieRouter);



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