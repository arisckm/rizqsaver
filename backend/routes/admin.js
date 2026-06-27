const express = require('express');
const router = express.Router();
const { getUsers, toggleVerify, toggleActive, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/verify', toggleVerify);
router.patch('/users/:id/toggle-active', toggleActive);

module.exports = router;
