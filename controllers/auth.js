import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'


const router = express.Router()


// * get Routes auth/

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});


// * post Routes auth/ 

router.post('/sign-up', async (req, res) => {
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const newUsername = req.body.username
    const newEmail = req.body.email


    // confirm the passwords match
    if (password !== confirmPassword) return res.send('passwords dont match')


    // confirm the username doens't exist in the DB
    const usernameInDatase = await User.findOne ({ username: newUsername})
    if (usernameInDatase) return res.send('username already exists')


    // confirm the email address doesn't exist
    const emailInDatabase = await User.findOne({ email: newEmail })
    if (emailInDatabase) return res.send('email already exists')

    // just before creating a user, make sure to hash the password!
    req.body.password = bcrypt.hashSync(password, 12)


    // Create a new user if all conditions are met 
    const createdUser = await User.create(req.body)
         console.log(createdUser)


    // define route if all good here! 
    res.send('Form submissiohn accepted');
})

export default router