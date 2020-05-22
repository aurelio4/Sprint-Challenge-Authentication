const jwt = require('jsonwebtoken')

/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    const jwtSecret = process.env.JWT_SECRET || 'jwtsecret123'

    jwt.verify(token, jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({
          error: 'bad token'
        })
      } else {
        req.jwt = decodedToken
        next()
      }
    })
  } else {
    res.status(400).json({
      error: 'please provide authentication information'
    })
  }
};
