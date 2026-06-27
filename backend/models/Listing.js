const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan', 'mixed'],
      required: [true, 'Food type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    quantityUnit: {
      type: String,
      enum: ['kg', 'servings', 'portions', 'packs', 'litres'],
      default: 'servings',
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry time is required'],
    },
    handlingInstructions: { type: String, trim: true },
    imageUrl: { type: String },
    imagePublicId: { type: String }, // for Cloudinary deletion
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'expired', 'cancelled'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Auto-expire listings
listingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
