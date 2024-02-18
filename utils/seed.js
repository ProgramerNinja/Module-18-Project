const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thoughts');

mongoose.connect('mongodb://127.0.0.1:27017/socialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedDatabase() {
  try {
    await User.deleteMany();
    await Thought.deleteMany();

  const usersData = [
    {
      username: 'Alice',
      email: 'alice@example.com'
    },
    {
      username: 'Bob',
      email: 'bob@example.com'
    },
    {
      username: 'Charlie',
      email: 'charlie@example.com'
    },
    {
      username: 'David',
      email: 'david@example.com'
    },
    {
      username: 'Eve',
      email: 'eve@example.com'
    }
  ];

  const thoughtsData = [
    {
      thoughtText: 'This is a sample thought by Alice',
      username: 'Alice'
    },
    {
      thoughtText: 'Another sample thought by Bob',
      username: 'Bob'
    },
    {
      thoughtText: 'A thought from Charlie',
      username: 'Charlie'
    },
    {
      thoughtText: 'Random thought by David',
      username: 'David'
    },
    {
      thoughtText: 'Deep thought by Eve',
      username: 'Eve'
    }
  ];


    const users = await User.insertMany(usersData);
    const thoughts = await Thought.insertMany(thoughtsData);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();