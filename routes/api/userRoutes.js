const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  addThought,
  removeThought,
  getFriends,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser);

router.route('/:userId').get(getSingleUser).delete(deleteUser);

router.route('/:uesrId/friends').post(addFriend).get(getFriends);

router.route('/:uesrId/friends/:friendId').delete(removeFriend);

router.route('/:uesrId/thoughts').post(addThought);

router.route('/:userId/assignments/:assignmentId').delete(removeThought);
module.exports = router;
