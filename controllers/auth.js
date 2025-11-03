import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedIn from '../middleware/is-signed-in.js';


const router = express.Router()


// * Routes 

// * GET /auth/sign-up

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});



// *  POST /auth/sign-up

router.post('/sign-up', async (req, res) => {
    try{
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const username = req.body.username
    const email = req.body.email


    // confirm the passwords match
    if (password !== confirmPassword) return res.send('passwords dont match')


    // confirm the username doens't exist in the DB
    const usernameInDatabase = await User.findOne ({ username: username})
    if (usernameInDatabase) return res.send('username already exists')


    // confirm the email address doesn't exist
    const emailInDatabase = await User.findOne({ email: email })
    if (emailInDatabase) return res.send('email already exists')

    // just before creating a user, make sure to hash the password!
    req.body.password = bcrypt.hashSync(password, 12)


    // Create a new user if all conditions are met 
    const createdUser = await User.create(req.body)
         console.log(createdUser)


    // define route if all good here! 
    res.redirect('/auth/sign-in');
    } catch (error) {
    console.error(error)
    return res.status(500).send('Something went wrong. Please try again later.')
  }
});

// * GET auth/sign-in
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

// * POST /auth/sign-in

router.post ('/sign-in', async (req,res) => {

    // confirm the Username exists
    const existingUser = await User.findOne( {username: req.body.username})
    if (!existingUser) return res.send ("Login failed. Please try again")


    // confirm the username + password match 
    // rely on bcrypt to determine if the entered password matches the one stored in the database
        const validPassword = bcrypt.compareSync(req.body.password, existingUser.password)
        if (!validPassword) return res.send ("Login failed. Please try again")


        res.send('request to sign in received')
});


export default router