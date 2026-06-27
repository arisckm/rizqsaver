const express = require('express');
const router = express.Router();
const {
  getListings, getListing, createListing, updateListing, deleteListing, getMyListings,
} = require('../controllers/listingController');
const { protect, authorize, requireVerified } = require('../middleware/auth');
const { validate, listingSchema } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

router.get('/', getListings);
router.get('/my-listings', protect, authorize('donor'), getMyListings);
router.get('/:id', getListing);

router.post(
  '/',
  protect,
  authorize('donor'),
  requireVerified,
  upload.single('image'),
  validate(listingSchema),
  createListing
);

router.put('/:id', protect, authorize('donor'), upload.single('image'), updateListing);
router.delete('/:id', protect, authorize('donor', 'admin'), deleteListing);

module.exports = router;
