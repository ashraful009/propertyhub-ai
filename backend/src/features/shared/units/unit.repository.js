const Unit = require('./unit.model');

const countUnitsByPropertyId = async (propertyId) => {
  return Unit.countDocuments({ propertyId });
};

const insertUnits = async (units) => {
  return Unit.insertMany(units);
};

const findUnitsByPropertyId = async (propertyId) => {
  return Unit.find({ propertyId }).sort({ floor: 1, unitNumber: 1 });
};

const findUnitById = async (id) => {
  return Unit.findById(id).populate('propertyId', 'title price city').populate('bookedBy', 'name email');
};

const findUnitByIdBasic = async (id) => {
  return Unit.findById(id);
};

const saveUnit = async (unit) => {
  return unit.save();
};

module.exports = {
  countUnitsByPropertyId,
  insertUnits,
  findUnitsByPropertyId,
  findUnitById,
  findUnitByIdBasic,
  saveUnit,
};
