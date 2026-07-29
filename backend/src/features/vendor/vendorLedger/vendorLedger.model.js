const mongoose = require('mongoose');

const vendorLedgerSchema = new mongoose.Schema(
  {
    companyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Company',
      required: true,
      index:    true,
    },
    type: {
      type:     String,
      enum:     ['refund_debit', 'commission_credit', 'adjustment'],
      required: true,
    },
    
    amount:       { type: Number, required: true },
    balanceAfter: { type: Number, required: true },

    bookingId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Booking',       default: null },
    refundRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RefundRequest', default: null },
    notes:           { type: String, default: '' },
  },
  { timestamps: true }
);

vendorLedgerSchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('VendorLedger', vendorLedgerSchema);
