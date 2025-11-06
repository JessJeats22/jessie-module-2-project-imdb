import mongoose from "mongoose";
import express from 'express'
import Movie from '../models/movie.js'
import isSignedIn from "../middleware/is-signed-in.js";
import methodOverride from 'method-override'

const router = express.Router()

// * Routes


// * GET - /movies
router.get('/', async (req, res) => {
  try {
    // Fetching all movies from MongoDB
      const movies = await Movie.find().populate('addedBy'); // includes username of whoever added it
      console.log(movies)
    // Render your EJS view and pass movies in
      res.render('movies/index', {movies});

  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading movies');
  }
});

// * GET - /movies/new
router.get('/new', (req, res) => {
    res.render('movies/new.ejs')
})

// * DELETE - /movies/movieId
router.delete('/:movieId', isSignedIn, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (movie.addedBy.equals(req.session.user._id)) {
      await movie.deleteOne();
      res.redirect('/movies');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


// * GET - /movies/:movieID/edit - 
router.get('/:movieId/edit', async (req, res) => {
  try {
    const currentMovie = await Movie.findById(req.params.movieId);
    res.render('movies/edit.ejs', {
      movie: currentMovie
    })
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }


})

// * GET - /movies/:movieID — display one movie by its ID
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

     const userHasFavourited = movie.favouritedByUsers.some((user) =>
      user.equals(req.session.user._id)
    );


    // otherwise, show the movie details on a page
     res.render('movies/show.ejs', {
      movie: movie,
      userHasFavourited: userHasFavourited,
    });

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


      // Before create a new movie, ensure that the logged in user is assigned as the owner
        req.body.addedBy = req.session.user._id

        // create new movie in database and attach to logged in user 
        const newMovie = new Movie(req.body);
        await newMovie.save();
        console.log('movieCreated', newMovie);

        // redirect to movies index page to see it in the list 
        res.redirect('/movies')

    } catch (error) {
        console.error(error)
        return res.status(500).send('Something went wrong. Please try again later.')
    }
});

// * UPDATE ROUTES 

// controllers/listings.js

router.put('/:movieId', isSignedIn, async (req, res) => {
  try {
    const currentMovie = await Movie.findById(req.params.movieId);
    if (currentMovie.addedBy.equals(req.session.user._id)) {
      await currentMovie.updateOne(req.body);
      res.redirect('/movies');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});



// * POST FAVOURITES - Add user to favourites -/movies/movieId...

router.post('/:movieId/favourited-by/:userId', isSignedIn, async (req, res) => {
  try {

   await Movie.findByIdAndUpdate(req.params.movieId, {
      $push: { favouritedByUsers: req.params.userId },
    });

    if (!Movie) return res.status(404).send("Movie not found");

    res.redirect(`/movies/${req.params.movieId}`);
    
   } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong. Please try again later.')
  }
})


// controllers/listings.js

router.delete('/:movieId/favourited-by/:userId', async (req, res) => {
  try {
   const movieId = req.params.movieId
    await Movie.findByIdAndUpdate(movieId, {
      $pull: { favouritedByUsers: req.params.userId  }
    })

    if (!Movie) return res.status(404).send("Movie not found");

    res.redirect(`/movies/${movieId}`);

 } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong. Please try again later.')
  }
})




export default router