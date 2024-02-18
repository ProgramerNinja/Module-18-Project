const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  getReactionsForThought,
  addReactionToThought,
  deleteReactionFromThought,
} = require('../../controllers/thoughtController.js');

router.route('/')
  .get(getThoughts)
  .post(createThought);

router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
.get(getReactionsForThought)
.post(addReactionToThought);

router.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReactionFromThought);

module.exports = router;