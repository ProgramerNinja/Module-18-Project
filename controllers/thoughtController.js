const { Thought, User } = require('../models');

// Route to get all thoughts
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts, "success!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to get a single thought by its _id
const getSingleThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought, "success!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function to create a new thought
const createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;
  try {
    const newThought = new Thought({
      thoughtText,
      username
    });
    const savedThought = await newThought.save();
    // Push the created thought's _id to the associated user's thoughts array field
    await User.findByIdAndUpdate(userId, { $push: { thoughts: savedThought._id } });
    res.status(201).json(savedThought, "success!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to update a thought by its _id
const updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought, "success!");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Function to delete a thought by its _id
const deleteThought = async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json({ message: 'Thought deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReactionsForThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId).populate('reactions');

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const reactionIds = thought.reactions.id;
    const reactionPromises = reactionIds.map(async (reactionId) => {
      const reaction = await Thought.reactions.findById(reactionId);
      return {
        id: reactionId,
        username: reaction ? reaction.username : 'Reaction not found'
      };
    });

    const reactions = await Promise.all(reactionPromises);

    res.json(reactions, "success!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addReactionToThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId).populate('reactions');

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const { reactionBody, username, } = req.body;

    const newReaction = ({
      reactionBody,
      username,
    });
    if (newReaction == null) {
      return res.status(404).json({ message: 'Reaction not complete' });
    }

    thought.reactions.push(newReaction);
    await thought.save();

    res.json(thought.reactions, "success!");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReactionFromThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    const reactionId = req.params.reactionId;
    thought.reactions = thought.reactions.filter(reactions => reactions.id.toString() !== reactionId);
    await thought.save();

    res.json({ message: 'Reaction deleted successfully', thought });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export the functions
module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  getReactionsForThought,
  addReactionToThought,
  deleteReactionFromThought,
};