const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify / unverify a donor
// @route   PATCH /api/admin/users/:id/verify
// @access  Private (admin)
const toggleVerify = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role !== 'donor') return res.status(400).json({ success: false, message: 'Only donor accounts can be verified.' });

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully.`,
      data: { id: user._id, isVerified: user.isVerified },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Deactivate / activate a user
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private (admin)
const toggleActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (err) {
    next(err);
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, donors, receivers, listings, bookings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'receiver' }),
      Listing.countDocuments(),
      Booking.countDocuments(),
    ]);

    const activeListings = await Listing.countDocuments({ status: 'available' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        totalUsers, donors, receivers,
        totalListings: listings,
        activeListings,
        totalBookings: bookings,
        completedBookings,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, toggleVerify, toggleActive, getStats };
