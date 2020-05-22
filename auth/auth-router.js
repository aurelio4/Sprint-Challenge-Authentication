const router = require('express').Router();
const Auth = require('./auth-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const rounds = process.env.BCRYPT_ROUNDS || 8

    if(!username || !password) {
      res.status(400).json({ error: 'missing data' })
    } else {
      const hash = bcrypt.hashSync(password, rounds)
      const newUser = { username, password: hash }
      const token = createToken(newUser)
      const addUser = await Auth.createUser(newUser)
      res.status(201).json({ addUser, token })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "server error, sorry" })
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const user = await Auth.findBy({ username })
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = createToken(user)
        res.status(200).json({ success: 'logged in', token })
      } else {
        res.status(400).json({ error: "missing data" })
      }
    } else {
      res.status(400).json({ error: "missing data" })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "server error, sorry" })
  }
});

function createToken(user) {
  const jwtSecret = process.env.JWT_SECRET || 'jwtsecret123'
  const payload = {
    sub: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
