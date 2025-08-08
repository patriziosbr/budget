const express = require('express');
const router = express.Router();

const { getNotaSpese, setNotaSpese, updateNotaSpese } = require('../controllers/notaSpeseController');
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(protect, getNotaSpese).post(protect, setNotaSpese) //shortcut
router.route('/:id').put(protect, updateNotaSpese)
// .delete(protect, deleteGoal) //shortcut

// router.get('/', getGoals)
// router.post('/', setGoals)
// router.put('/:id', editGoals)
// router.delete('/:id', deleteGoals)


module.exports = router;