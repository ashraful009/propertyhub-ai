const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema(
  {
    
    bookingId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Booking',
      required: true,
      index:    true,
    },
    customerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    propertyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Property',
      required: true,
    },
    companyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Company',
      required: true,
    },

    totalInstallments:     { type: Number, required: true, min: 1, max: 24 },
    extraChargePercentage: { type: Number, required: true, default: 0      },

    installmentNumber: { type: Number, required: true, min: 1 },   
    dueDate:           { type: Date,   required: true        },   

    baseAmount:   { type: Number, required: true },   
    extraCharge:  { type: Number, default: 0     },   
    amountDue:    { type: Number, required: true },   

    status:          { type: String, enum: ['pending', 'paid'], default: 'pending', index: true },
    paidAt:          { type: Date,   default: null },
    paidAmount:      { type: Number, default: 0   }, 
    lateFee:         { type: Number, default: 0   }, 
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

installmentSchema.index({ bookingId: 1, installmentNumber: 1 }, { unique: true });

module.exports = mongoose.model('Installment', installmentSchema);
