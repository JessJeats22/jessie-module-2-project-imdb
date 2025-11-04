import mongoose from "mongoose";

const movieSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  // The user who created (added) the movie
  addedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  // Users who have favorited this movie
  favouritedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
}, { timestamps: true }

);

const Movie = mongoose.model ('Movie', movieSchema)

export default Movie;