import mongoose from "mongoose";
import express from 'express'
import isSignedIn from "../middleware/is-signed-in.js";
import Movie from '../models/movie.js'

 const router = express.Router()

// * GET routes /movies/

router.get ('/', (req, res) => {
    res.send ('This will be my movies listing page')
})

router.get ('/new', (req, res) => {
    res.send ('This will be where I display new created movie')
})

export default router