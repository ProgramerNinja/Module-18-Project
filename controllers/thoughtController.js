const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');

// Route to get all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a new thought
router.post('/thoughts', async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    const newThought = new Thought({
      thoughtText,
      username
    });

    const savedThought = await newThought.save();

    // Push the created thought's _id to the associated user's thoughts array field
    await User.findByIdAndUpdate(userId, { $push: { thoughts: savedThought._id } });

    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a thought by its _id
router.put('/thoughts/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a thought by its _id
router.delete('/thoughts/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to create a reaction for a thought
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  const { reactionBody, username } = req.body;

  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    thought.reactions.push({ reactionBody, username });
    await thought.save();

    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a reaction by its reactionId
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    thought.reactions = thought.reactions.filter(reaction => reaction._id.toString() !== req.params.reactionId);
    await thought.save();

    res.json(thought);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;