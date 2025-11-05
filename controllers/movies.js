import mongoose from "mongoose";
import express from 'express'
import isSignedIn from "../middleware/is-signed-in.js";
import Movie from '../models/movie.js'
import { title } from "process";
import { asyncWrapProviders } from "async_hooks";
import methodOverride from 'method-override'

const router = express.Router()

// * GET ROUTES /movies
router.get('/', async (req, res) => {
  try {
    // Fetching all movies from MongoDB

    const movies = await Movie.find().populate('addedBy'); // includes username of whoever added it
    res.locals.movies = movies;
    // Render your EJS view and pass movies in

      res.render('movies/index');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading movies');
  }
});

// * movies/new
router.get('/new', (req, res) => {
    res.render('movies/new.ejs')
})

// * DELETE ROUTES

router.delete("/:movieId", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.movieId)
  res.redirect('/movies')
});





// * movies/:movieID/edit - edit movie 
router.get('/:movieId/edit', async (req, res) => {
  res.render('movies/edit', { Movie });


})



// * movies/:movieID — display one movie by its ID
// this route will display a specific movie based on it ID
router.get('/:movieId', async (req, res) => {
  try {
    // get the id from the URL (like /movies/abc123)
    const movieId = req.params.movieId;

    // Use Mongoose to find that specific movie in the database
    const movie = await Movie.findById(movieId).populate('addedBy');

    // If no movie is found, show an error
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // otherwise, show the movie details on a page
    res.render('movies/show.ejs', { movie });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading movie');
  }
});



// * POST ROUTES /movies/
router.post('/', isSignedIn, async (req, res) => {

    try {
        // Verify title doesn't already exist in database
        const movieInDatabase = await Movie.findOne({ title: req.body.title })
        if (movieInDatabase) return res.status(400).send('Movie already exists.')


        // create new movie in database and attach to logged in user 
        const newMovie = new Movie(req.body);
        newMovie.addedBy = req.session.user._id;

        // save movie to database
        await newMovie.save();
        console.log('movieCreated', newMovie);

        // redirect to movies index page to see it in the list 
        res.redirect('/movies')

    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
});

// * EDIT ROUTES 

router.put('/:movieId/edit', (req, res) =>{
  res.send ('This is where we edit movies')

})




export default router