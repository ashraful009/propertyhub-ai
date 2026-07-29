const mongoose = require('mongoose');

const refundRequestSchema = new mongoose.Schema(
  {
    bookingId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Booking',
      required: true,
      unique:   true, 
      index:    true,
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true, index: true },
    companyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },

    requestedAt:     { type: Date,   default: Date.now },
    amountPaid:      { type: Number, required: true },           
    refundAmount:    { type: Number, required: true },           
    retentionAmount: { type: Number, required: true },           
    retentionPercentage: { type: Number, required: true },       

    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected', 'completed'],
      default: 'approved',
      index:   true,
    },
    processedAt: { type: Date, default: null },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes:       { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RefundRequest', refundRequestSchema);
