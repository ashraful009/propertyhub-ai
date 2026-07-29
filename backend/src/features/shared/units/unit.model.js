const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    
    propertyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Property',
      required: true,
    },

    floor:      { type: Number, required: true, min: 1 },
    unitNumber: { type: String, required: true, trim: true }, 

    status: {
      type:    String,
      enum:    ['available', 'booked', 'sold'],
      default: 'available',
    },

    price:    { type: Number,   default: null   }, 
    size:     { type: String,   default: ''     }, 
    type: {
      type:    String,
      enum:    ['1BHK', '2BHK', '3BHK', '4BHK', 'studio', 'penthouse', 'commercial'],
      default: '2BHK',
    },
    facing:   { type: String, default: '' }, 
    features: [String], 

    bookedBy: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },
  },
  { timestamps: true }
);

unitSchema.index({ propertyId: 1, floor: 1, unitNumber: 1 }, { unique: true });

module.exports = mongoose.model('Unit', unitSchema);
