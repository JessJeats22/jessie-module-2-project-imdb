import mongoose from "mongoose";
import express from 'express'
import isSignedIn from "../middleware/is-signed-in.js";
import Movie from '../models/movie.js'

 const router = express.Router()

// * GET routes /movies/
router.get ('/', (req, res) => {
    res.render('movies/index.ejs')
})

router.get ('/new', (req, res) => {
    res.render('movies/new.ejs')
})

export default router