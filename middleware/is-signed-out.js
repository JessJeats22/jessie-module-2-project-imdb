const isSignedOut = (req, res, next) => {
  if (!req.session.user) return next() // This line allows access to the route by using next() if the user is signed out
  // If the user is signed in, we will redirect away to the sign in form
  res.redirect('/')
}

export default isSignedOut