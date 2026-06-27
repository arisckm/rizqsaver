const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

// @desc    Claim a food listing (atomic to prevent race conditions)
// @route   POST /api/bookings/:listingId
// @access  Private (receivers only)
const claimListing = async (req, res, next) => {
  try {
    // Atomic findOneAndUpdate to prevent double-claiming
    const listing = await Listing.findOneAndUpdate(
      {
        _id: req.params.listingId,
        status: 'available',
        expiresAt: { $gt: new Date() },
      },
      {
        status: 'claimed',
        claimedBy: req.user._id,
        claimedAt: new Date(),
      },
      { new: true }
    );

    if (!listing) {
      return res.status(409).json({
        success: false,
        message: 'This listing is no longer available. It may have already been claimed.',
      });
    }

    const booking = await Booking.create({
      listing: listing._id,
      receiver: req.user._id,
      donor: listing.donor,
      pickupNotes: req.body.pickupNotes || '',
    });

    await booking.populate([
      { path: 'listing', select: 'title location expiresAt imageUrl quantity quantityUnit' },
      { path: 'donor', select: 'name organizationName phone address' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Listing claimed successfully!',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get receiver's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (receivers)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ receiver: req.user._id })
      .populate('listing', 'title location expiresAt imageUrl quantity quantityUnit status')
      .populate('donor', 'name organizationName phone city')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get incoming bookings for donor's listings
// @route   GET /api/bookings/incoming
// @access  Private (donors)
const getIncomingBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ donor: req.user._id })
      .populate('listing', 'title quantity quantityUnit imageUrl location')
      .populate('receiver', 'name email organizationName phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark booking as completed
// @route   PATCH /api/bookings/:id/complete
// @access  Private (donor of that booking)
const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    if (booking.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ success: true, message: 'Booking marked as completed.', data: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { claimListing, getMyBookings, getIncomingBookings, completeBooking };
