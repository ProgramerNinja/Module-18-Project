const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a single user by its _id and populate thoughts and friends data
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new user
router.post('/users', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a user by its _id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a user by its _id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all thoughts of a user by user's _id
router.get('/users/:id/thoughts', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.thoughts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all friends of a user by user's _id
router.get('/users/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendId = req.body.friendId;
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    user.friends.push(friendId);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;