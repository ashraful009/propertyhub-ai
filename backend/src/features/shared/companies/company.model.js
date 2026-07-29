const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
    description: { type: String, required: true },

    location: {
      address: { type: String, default: '' },
      lat:     { type: Number, default: 0 },
      lng:     { type: Number, default: 0 },
    },

    tradeLicense: { type: String, required: true },

    ownerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedAt:     { type: Date },
    rejectedReason: { type: String, default: '' },

    walletBalance: { type: Number, default: 0 },

    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
