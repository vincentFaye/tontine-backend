const express = require('express')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../model/User')
const config = require('config')
const bcrypt = require('bcryptjs')

// @route    GET api/users
// @desc     Fetch all users
// @access   Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    if (!users) {
      res.status(400).json({ msg: 'Users not found' })
    }
    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('SERVER ERROR')
  }
})

// @route    GET api/users/:id
// @desc     Fetch a user
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ msg: 'User not found' })
    }
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('SERVER ERROR')
  }
})

// @route    POST api/users
// @desc     Create a user
// @access   Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('telephone', 'Telephone is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('password', 'Please enter at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }
  const { name, password, telephone } = req.body
  try {
    let user = await User.findOne({ telephone })
    if (user) {
      return res.status(400).json({ msg: 'User already exist' })
    }
    user = new User({
      name,
      password,
      telephone
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (err, token) => {
      if (err) throw err
      res.json({ token })
    })

  } catch (err) {
    console.log(err.message)
    res.status(500).send('SERVER ERROR')
  }
})

module.exports = router
