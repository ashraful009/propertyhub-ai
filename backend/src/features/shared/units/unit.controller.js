const {
  generateUnitsForProperty,
  getPropertyUnitsService,
  getUnitService,
  updateUnitStatusService,
  updateUnitService,
} = require('./unit.service');
const { successResponse } = require('../../../responses');

const getPropertyUnits = async (req, res, next) => {
  try {
    const data = await getPropertyUnitsService(req.params.propertyId);
    return successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const getUnit = async (req, res, next) => {
  try {
    const unit = await getUnitService(req.params.id);
    return successResponse(res, { unit });
  } catch (error) {
    next(error);
  }
};

const updateUnitStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const unit = await updateUnitStatusService(req.params.id, status);
    return successResponse(res, { unit }, `Unit ${unit.unitNumber} marked as ${status}`);
  } catch (error) {
    next(error);
  }
};

const updateUnit = async (req, res, next) => {
  try {
    const unit = await updateUnitService(req.params.id, req.body);
    return successResponse(res, { unit }, 'Unit updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateUnitsForProperty,
  getPropertyUnits,
  getUnit,
  updateUnitStatus,
  updateUnit,
};
