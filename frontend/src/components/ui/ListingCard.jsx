import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, isPast } from 'date-fns';

const FOOD_TYPE_COLORS = {
  'veg': 'bg-green-900 text-green-300 border-green-800',
  'non-veg': 'bg-red-900 text-red-300 border-red-800',
  'vegan': 'bg-emerald-900 text-emerald-300 border-emerald-800',
  'mixed': 'bg-yellow-900 text-yellow-300 border-yellow-800',
};

export default function ListingCard({ listing, onClaim, claiming }) {
  const isExpired = isPast(new Date(listing.expiresAt));
  const timeLeft = isExpired
    ? 'Expired'
    : `Expires ${formatDistanceToNow(new Date(listing.expiresAt), { addSuffix: true })}`;

  const urgency = !isExpired && new Date(listing.expiresAt) - new Date() < 2 * 60 * 60 * 1000;

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden hover:border-surface-600 transition-all duration-200 animate-fade-in">
      {/* Image */}
      <div className="aspect-video bg-surface-800 relative overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-surface-600">
            🍱
          </div>
        )}
        <div className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full border ${FOOD_TYPE_COLORS[listing.foodType]}`}>
          {listing.foodType}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-base leading-tight mb-1 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-sm text-surface-200 mb-3">
          {listing.donor?.organizationName || listing.donor?.name} · 📍 {listing.location?.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-surface-200">
            {listing.quantity} {listing.quantityUnit}
          </span>
          <span className={`text-xs font-medium ${urgency ? 'text-red-400' : isExpired ? 'text-surface-200 line-through' : 'text-brand-400'}`}>
            {urgency && '⚠ '}{timeLeft}
          </span>
        </div>

        {onClaim ? (
          <button
            onClick={() => onClaim(listing._id)}
            disabled={claiming || isExpired || listing.status !== 'available'}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-surface-800 disabled:text-surface-200 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            {claiming ? 'Claiming...' : listing.status === 'claimed' ? 'Already Claimed' : 'Claim Batch'}
          </button>
        ) : (
          <Link
            to={`/listings/${listing._id}`}
            className="block w-full text-center bg-surface-800 hover:bg-surface-700 text-white font-medium text-sm py-2.5 rounded-xl transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
