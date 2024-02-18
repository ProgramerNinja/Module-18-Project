const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getThoughtsById,
  getFriends,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:userId')
  .get(getSingleUser)
  .delete(deleteUser)
  .put(updateUser);

router.route('/:userId/friends')
  .get(getFriends)
  .post(addFriend);

router.route('/:userId/friends/:friendId')
  .delete(removeFriend);

router.route('/:userId/thoughts/')
  .get(getThoughtsById);

module.exports = router;