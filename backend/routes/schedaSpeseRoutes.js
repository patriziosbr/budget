const express = require('express');
const router = express.Router();

const { getSchedaSpese, setSchedaSpese, updateSchedaSpese, deleteSchedaSpese, singleSchedaSpeseGet } = require('../controllers/schedaSpeseController');
const { protect } = require('../middleware/authMiddleware')
const { checkSpesaAccess } = require('../middleware/checkSpesaAccess');

router.route('/').get(protect, getSchedaSpese).post(protect, setSchedaSpese)//shortcut
router.route('/:id').put(protect, checkSpesaAccess('write'), updateSchedaSpese).delete(protect, deleteSchedaSpese).get(protect, singleSchedaSpeseGet) //update

module.exports = router;