const express = require('express');
const router = express.Router();

// bring the middleware
const auth = require('../../middleware/auth');

// item models
const Item = require('../../models/Item');

// @route /api/items
// @desc GET all item
// @access Public
router.get('/', (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => {
      res.json(items);
    })
    .catch(err => console.log(err));
});

// @route /api/items
// @desc create POST
// @access Public
router.post('/', auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem
    .save()
    .then(item => res.json(item))
    .catch(err => console.log(err));
});

// @route /api/items/:id
// @desc DELETE item by id
// @access Public
router.delete('/:id', auth, (req, res) => {
  Item.findById(req.params.id)
    .then(item =>
      item.remove().then(() => {
        res.json({ success: true });
      })
    )
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
