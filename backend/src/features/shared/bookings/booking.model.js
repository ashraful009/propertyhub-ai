const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    
    propertyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Property',
      required: true,
    },
    unitId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Unit',
      required: true,
    },
    customerId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    
    companyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Company',
      required: true,
      index:    true,
    },

    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'rejected', 'cancelled'],
      default: 'pending',
      index:   true,
    },
    paymentStatus: {
      type:    String,
      enum:    ['unpaid', 'booking_paid', 'fully_paid'],
      default: 'unpaid',
      index:   true,
    },
    message: {
      type:    String,
      trim:    true,
      default: '',
    },

    totalPrice: {
      type:    Number,
      default: null,
    },
    bookingMoneyPercentage: {
      type:    Number,
      default: 20,
    },
    bookingAmount: {
      type:    Number,
      default: null,
    },

    kycData: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    documents: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    bookingStripeSessionId: {
      type:    String,
      default: null,
    },
    duePaymentStripeSessionId: {
      type:    String,
      default: null,
    },

    installmentPlan: {
      active:                   { type: Boolean, default: false },
      totalCount:               { type: Number,  default: 0     },  
      extraChargePercentage:    { type: Number,  default: 0     },  
      baseAmountPerInstallment: { type: Number,  default: 0     },  
      totalDueAmount:           { type: Number,  default: 0     },  
      createdAt:                { type: Date                    },
    },

    lastPaymentDate:     { type: Date, default: null },

    inactivityWarningSentAt: { type: Date, default: null },
    
    autoCancelCheckedAt: { type: Date, default: null },

    cancellationReason: {
      type:    String,
      enum:    ['inactivity', 'manual', 'refund_requested', null],
      default: null,
    },
    cancelledAt: { type: Date, default: null },
    
    noRefund:    { type: Boolean, default: false },

    refundPolicyAccepted: { type: Boolean, default: false }, 
    refundRequestedAt:    { type: Date,    default: null },
    refundStatus: {
      type:    String,
      enum:    ['none', 'pending', 'approved', 'rejected', 'completed'],
      default: 'none',
    },
    refundAmount:    { type: Number, default: 0 }, 
    retentionAmount: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, paymentStatus: 1 });

bookingSchema.index({ customerId: 1, companyId: 1, status: 1, paymentStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
