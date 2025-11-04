import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import isSignedIn from '../middleware/is-signed-in.js';
import isSignedOut from '../middleware/is-signed-out.js';


 const router = express.Router()


// * ALL ROUTES 

// * GET /auth/sign-up
router.get("/sign-up", isSignedOut, (req, res) => {
    res.render("auth/sign-up");
});

// *  POST /auth/sign-up
router.post('/sign-up', async (req, res) => {
    try {
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const username = req.body.username
        const email = req.body.email


        // confirm the passwords match
        if (password !== confirmPassword) return res.status(400).send('Passwords do not match.')


        // confirm the username doens't exist in the DB
        const usernameInDatabase = await User.findOne({ username: username })
        if (usernameInDatabase) return res.status(400).send('Username already taken')


        // confirm the email address doesn't exist
        const emailInDatabase = await User.findOne({ email: email })
        if (emailInDatabase) return res.status(400).send('Email already taken')

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

// * GET /auth/sign-in
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

// * POST /auth/sign-in
router.post('/sign-in', async (req, res) => {

    try {

        // Confirm they are already an existingUser
        const existingUser = await User.findOne({ username: req.body.username })
        if (!existingUser) return res.status(401).send('The username provided was not found.')


        // There is a user! Rely on bcrypt to determine if the entered password matches the one stored in the database
        const validPassword = bcrypt.compareSync(req.body.password, existingUser.password)
        if (!validPassword) return res.status(401).send('Incorrect password was provided.')


        // If password is correct, sign in the user! To do so, update the session store for the cookie to be generated and sent back to client:
        req.session.user = {
            _id: existingUser._id,
            username: existingUser.username
        }

        req.session.save(() => res.redirect('/'))

    } catch (error) {
        console.error(error);
        res.status(500).send('Unexpected error during login.');
    }


});

// * GET /auth/sign-out
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


export default router