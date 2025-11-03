import express from 'express'
import User from '../models/user.js'


 const router = express.Router()


// * get Routes auth/

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});


export default router