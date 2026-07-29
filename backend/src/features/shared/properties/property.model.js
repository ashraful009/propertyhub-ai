const mongoose = require('mongoose');

const flatTypeSchema = new mongoose.Schema(
  {
    label:       { type: String, default: '' },  
    sqft:        { type: Number, default: 0  },  
    pricePerUnit:{ type: Number, default: 0  },  
    bedrooms:    { type: Number, default: 0  },
    bathrooms:   { type: Number, default: 0  },
    kitchen:     { type: String, enum: ['Yes', 'No'], default: 'Yes' },
    dining:      { type: String, enum: ['Yes', 'No'], default: 'Yes' },
    drawing:     { type: String, enum: ['Yes', 'No'], default: 'No'  },
    parking:     { type: String, enum: ['Yes', 'No'], default: 'No'  },
    description: { type: String, default: '' },
  },
  { _id: true }
);

const villaDetailsSchema = new mongoose.Schema(
  {
    
    area:             { type: String, default: '' },
    roadAccess:       { type: String, default: '' },   
    neighborhood:     { type: String, enum: ['Residential', 'Resort'], default: 'Residential' },

    totalLandSize:    { type: Number, default: 0 },    
    totalFloors:      { type: Number, default: 0 },
    bedrooms:         { type: Number, default: 0 },
    bathrooms:        { type: Number, default: 0 },
    living:           { type: String, enum: ['Yes', 'No'], default: 'Yes' },
    dining:           { type: String, enum: ['Yes', 'No'], default: 'Yes' },
    kitchen:          { type: String, enum: ['Yes', 'No'], default: 'Yes' },
    description:      { type: String, default: '' },

    constructionYear: { type: Number, default: 0 },
    developerName:    { type: String, default: '' },
    materialsQuality: { type: String, default: '' },   
    earthquakeResistant: { type: String, enum: ['Yes', 'No'], default: 'No' },

    privatePool:      { type: String, enum: ['Yes', 'No'], default: 'No' },
    garden:           { type: String, enum: ['Yes', 'No'], default: 'No' },
    garage:           { type: String, enum: ['Yes', 'No'], default: 'No' },
    rooftopTerrace:   { type: String, enum: ['Yes', 'No'], default: 'No' },
    servantRoom:      { type: String, enum: ['Yes', 'No'], default: 'No' },
    securitySystem:   { type: String, enum: ['Yes', 'No'], default: 'No' },
    
  },
  { _id: false }
);

const landDetailsSchema = new mongoose.Schema(
  {
    
    area:              { type: String, default: '' },
    roadAccess:        { type: String, enum: ['Yes', 'No'], default: 'No' },

    totalSize:         { type: Number, default: 0 },   
    plotShape:         { type: String, enum: ['Square', 'Rectangle', 'Irregular'], default: 'Rectangle' },

    landType:          { type: String, enum: ['Residential', 'Commercial', 'Agricultural'], default: 'Residential' },
    fillingStatus:     { type: String, enum: ['Low land', 'Ready to use'], default: 'Ready to use' },
    constructionReady: { type: String, enum: ['Yes', 'No'], default: 'No' },

    khatianNumber:     { type: String, default: '' },
    dagNumber:         { type: String, default: '' },
    landOwnership:     { type: String, enum: ['Single owner', 'Multiple owners'], default: 'Single owner' },
    anyDispute:        { type: String, enum: ['Yes', 'No'], default: 'No' },

    electricityLine:   { type: String, enum: ['Yes', 'No'], default: 'No' },
    gasWaterConnection:{ type: String, enum: ['Yes', 'No'], default: 'No' },
    drainageSystem:    { type: String, enum: ['Yes', 'No'], default: 'No' },

    nearbySchool:      { type: String, default: '' },
    nearbyHospital:    { type: String, default: '' },
    nearbyMarket:      { type: String, default: '' },
    futureDevelopment: { type: String, default: '' },
    
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    
    title: {
      type:     String,
      required: [true, 'Property title is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Property description is required'],
    },
    price: {
      type:     Number,
      required: [true, 'Price is required'],
      min:      [0, 'Price cannot be negative'],
    },

    category: {
      type:     String,
      enum:     ['apartment', 'villa', 'land'],
      required: true,
    },

    mainImage:     { type: String, default: '' },   
    galleryImages: [String],                         

    companyId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Company',
      required: true,
    },
    addedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isActive:       { type: Boolean, default: true  }, 
    approvedAt:     { type: Date },
    rejectedReason: { type: String, default: '' },

    address:  { type: String, required: true, trim: true },
    city:     { type: String, required: true, trim: true },

    totalUnitsCount: { type: Number, default: 0    }, 
    landSize:        { type: String, default: ''   }, 
    handoverTime:    { type: String, default: ''   }, 

    totalFloors:   { type: Number, min: 1, default: 1 },
    unitsPerFloor: { type: Number, min: 1, default: 1 },

    flatTypes: [flatTypeSchema],

    villaDetails: { type: villaDetailsSchema, default: undefined },

    landDetails: { type: landDetailsSchema, default: undefined },

    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

propertySchema.index({ status: 1, isActive: 1, category: 1, city: 1 });

module.exports = mongoose.model('Property', propertySchema);
