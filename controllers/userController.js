const { User, Thought } = require('../models');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getThoughtsById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const thoughtIds = user.thoughts; // Assuming user.thoughts contains an array of thought ids
    const thoughts = await Thought.find({ _id: { $in: thoughtIds } });
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends', 'username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = user.friends;
    const friendPromises = friendIds.map(async (friendId) => {
      const friendUser = await User.findById(friendId);
      return {
        userId: friendId,
        username: friendUser ? friendUser.username : 'User not found'
      };
    });

    const friends = await Promise.all(friendPromises);

    res.json(friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendId = req.body.friendId;
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    user.friends.push(friend);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendId = req.params.friendId;
    user.friends = user.friends.filter(friend => friend.toString() !== friendId);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getThoughtsById,
  getFriends,
  addFriend,
  removeFriend
};