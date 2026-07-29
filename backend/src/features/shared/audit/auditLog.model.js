const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type:     String,
      required: true,
      index:    true,

    },
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',    default: null, index: true },
    bookingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null, index: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    default: null }, 
    notes:       { type: String, default: '' },
    
    meta:        { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
