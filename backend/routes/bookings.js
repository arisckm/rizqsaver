const express = require('express');
const router = express.Router();
const { claimListing, getMyBookings, getIncomingBookings, completeBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/:listingId', protect, authorize('receiver'), claimListing);
router.get('/my-bookings', protect, authorize('receiver'), getMyBookings);
router.get('/incoming', protect, authorize('donor'), getIncomingBookings);
router.patch('/:id/complete', protect, authorize('donor'), completeBooking);

module.exports = router;
