import mongoose from "mongoose";
import express from 'express'
import isSignedIn from "../middleware/is-signed-in.js";
import Movie from '../models/movie.js'
import { title } from "process";

 const router = express.Router()

// * GET routes /movies/
router.get ('/', (req, res) => {
    res.render('movies/index.ejs')
})

router.get ('/new', (req, res) => {
    res.render('movies/new.ejs')
})


// * POST routes /movies/
router.post('/new', isSignedIn, async (req, res) => {

    try {

    // Verify title doesn't already exist in database
    const newMovie = req.body.title
    const movieInDatabase = await Movie.findOne ({title: title})
    if (movieInDatabase) return res.status(400).send('Movie already exists.')
    

    // create new movie in database 
    const movieCreated = await Movie.create(req.body)
    console.log(movieCreated)

    res.redirect('/')

        }  catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
});


export default router