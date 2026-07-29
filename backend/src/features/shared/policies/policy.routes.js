const express = require('express');
const { getPolicy, upsertPolicy } = require('./policy.controller');
const { protect, authorize }      = require('../../../middleware/auth.middleware');

const router = express.Router();

router.get('/:roleTarget', getPolicy);

router.put('/:roleTarget', protect, authorize('Super Admin'), upsertPolicy);

module.exports = router;
