import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,   // must be filled in
        unique: true,     // no duplicates allowed
    
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // converts all to lowercase for consistency
    
    },
    password: {
        type: String,
        required: true
    }
});

// Function help in the object of "User" that creates or retrieves a model (in this case User model)
const User = mongoose.model('User', userSchema)

export default User