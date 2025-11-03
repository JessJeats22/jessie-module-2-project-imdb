const isSignedIn = (req, res, next) => {
  if (req.session.user) return next() // This line allows access to the route by using next() if the user is signed in
  // If the user is not signed in, we will redirect away to the sign in form
  res.redirect('/auth/sign-in')
}

export default isSignedIn