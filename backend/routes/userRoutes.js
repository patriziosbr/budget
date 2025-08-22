const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUserById, requestPasswordReset, resetPassword, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/getUserById', protect, getUserById)
router.put('/updateUser', protect, updateUser)
router.delete('/:id', protect, deleteUser)
// Route to request password reset
router.post('/requestPasswordReset', requestPasswordReset);

// Route to reset password
router.post('/resetPassword', resetPassword);


module.exports = router;