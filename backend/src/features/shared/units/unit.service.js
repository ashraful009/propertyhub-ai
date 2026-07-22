const {
  countUnitsByPropertyId,
  insertUnits,
  findUnitsByPropertyId,
  findUnitById,
  findUnitByIdBasic,
  saveUnit,
} = require('./unit.repository');
const { NotFoundError, ValidationError } = require('../../../errors');

const generateUnitsForProperty = async (property) => {
  const existing = await countUnitsByPropertyId(property._id);
  if (existing > 0) return;

  const units = [];
  for (let floor = 1; floor <= property.totalFloors; floor++) {
    for (let ui = 0; ui < property.unitsPerFloor; ui++) {
      const letter = String.fromCharCode(65 + ui);
      units.push({
        propertyId: property._id,
        floor,
        unitNumber: `${floor}${letter}`,
        status: 'available',
      });
    }
  }
  await insertUnits(units);
};

const getPropertyUnitsService = async (propertyId) => {
  const units = await findUnitsByPropertyId(propertyId);

  const grouped = {};
  units.forEach((u) => {
    if (!grouped[u.floor]) grouped[u.floor] = [];
    grouped[u.floor].push(u);
  });

  const total = units.length;
  const available = units.filter((u) => u.status === 'available').length;
  const booked = units.filter((u) => u.status === 'booked').length;
  const sold = units.filter((u) => u.status === 'sold').length;

  return { units, grouped, stats: { total, available, booked, sold } };
};

const getUnitService = async (unitId) => {
  const unit = await findUnitById(unitId);
  if (!unit) {
    throw new NotFoundError('Unit not found');
  }
  return unit;
};

const updateUnitStatusService = async (unitId, status) => {
  if (!['available', 'booked', 'sold'].includes(status)) {
    throw new ValidationError('Invalid status');
  }

  const unit = await findUnitByIdBasic(unitId);
  if (!unit) {
    throw new NotFoundError('Unit not found');
  }

  unit.status = status;
  if (status !== 'booked') unit.bookedBy = null;
  await saveUnit(unit);

  return unit;
};

const updateUnitService = async (unitId, updateData) => {
  const { price, size, type, features, facing } = updateData;

  const unit = await findUnitByIdBasic(unitId);
  if (!unit) {
    throw new NotFoundError('Unit not found');
  }

  if (price !== undefined) unit.price = Number(price);
  if (size !== undefined) unit.size = size;
  if (type !== undefined) unit.type = type;
  if (facing !== undefined) unit.facing = facing;
  if (features !== undefined) unit.features = features;

  await saveUnit(unit);

  return unit;
};

module.exports = {
  generateUnitsForProperty,
  getPropertyUnitsService,
  getUnitService,
  updateUnitStatusService,
  updateUnitService,
};
