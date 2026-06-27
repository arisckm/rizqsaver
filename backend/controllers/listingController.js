const Listing = require('../models/Listing');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all available listings (with search + pagination)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, foodType, city } = req.query;

    const filter = { status: 'available', expiresAt: { $gt: new Date() } };

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (foodType) filter.foodType = foodType;
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const total = await Listing.countDocuments(filter);
    const listings = await Listing.find(filter)
      .populate('donor', 'name organizationName city')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('donor', 'name organizationName address city phone');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    res.json({ success: true, data: listing });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a food listing
// @route   POST /api/listings
// @access  Private (verified donors only)
const createListing = async (req, res, next) => {
  try {
    const {
      title, description, foodType, quantity, quantityUnit,
      expiresAt, handlingInstructions,
      'location.address': address,
      'location.city': city,
    } = req.body;

    const listing = await Listing.create({
      donor: req.user._id,
      title,
      description,
      foodType,
      quantity,
      quantityUnit: quantityUnit || 'servings',
      expiresAt,
      handlingInstructions,
      location: {
        address: address || req.body.address,
        city: city || req.body.city,
      },
      imageUrl: req.file?.path || null,
      imagePublicId: req.file?.filename || null,
    });

    await listing.populate('donor', 'name organizationName city');

    res.status(201).json({ success: true, message: 'Listing created.', data: listing });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private (listing owner only)
const updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

    if (listing.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing.' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Cannot update a claimed or expired listing.' });
    }

    // Replace image if new one uploaded
    if (req.file && listing.imagePublicId) {
      await cloudinary.uploader.destroy(listing.imagePublicId);
    }

    const updates = { ...req.body };
    if (req.body['location.address'] || req.body['location.city']) {
      updates.location = {
        address: req.body['location.address'] || listing.location.address,
        city: req.body['location.city'] || listing.location.city,
      };
    }
    if (req.file) {
      updates.imageUrl = req.file.path;
      updates.imagePublicId = req.file.filename;
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.json({ success: true, message: 'Listing updated.', data: listing });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private (listing owner or admin)
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

    if (listing.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (listing.imagePublicId) {
      await cloudinary.uploader.destroy(listing.imagePublicId);
    }

    await listing.deleteOne();
    res.json({ success: true, message: 'Listing removed.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get donor's own listings
// @route   GET /api/listings/my-listings
// @access  Private (donors)
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getListings, getListing, createListing, updateListing, deleteListing, getMyListings };
