const express = require('express')
const router = express.Router()

// @route    POST api/users
// @desc     Fetch all users
// @access   Public
router.get('/', (req, res) => {
  res.json({ msg: 'Users routes'})
})

module.exports = router
