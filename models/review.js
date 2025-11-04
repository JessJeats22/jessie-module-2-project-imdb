import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema ({
  // The movie this review is for
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  // The user who wrote the review
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Review text/content
  content: {
    type: String,
    required: true, // NN (not null)
  },
  // Review rating
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
}, { timestamps: true });

const Review = mongoose.model('Review,', reviewSchema)

export default Review