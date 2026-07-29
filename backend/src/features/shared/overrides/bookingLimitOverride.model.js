const mongoose = require('mongoose');

const bookingLimitOverrideSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
      index:    true,
    },
    overrideLimit: { type: Number, required: true, min: 1, max: 1000 },
    grantedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grantedAt:     { type: Date,   default: Date.now },
    reason:        { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookingLimitOverride', bookingLimitOverrideSchema);
