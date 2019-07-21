const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// item models
const User = require('../../models/User');

// @route /api/users
// @desc  POST Register new user
// @access Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple Valodation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please enter all field' });
  }

  // Check the user
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // no user the create then create the user
    const newUser = new User({
      name,
      email,
      password
    });

    // Create salt & hash
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            jwt.sign(
              { id: user._id },
              config.get('jwtSecret'),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  user: {
                    token,
                    id: user._id,
                    name: user.name,
                    email: user.email
                  }
                });
              }
            );
          })
          .catch(err => console.error(err));
      });
    });
  });
});

module.exports = router;
