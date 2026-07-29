const { createAuditLog } = require('./audit.repository');

const logAudit = async ({ action, userId = null, bookingId = null, performedBy = null, notes = '', meta = null }) => {
  try {
    await createAuditLog({ action, userId, bookingId, performedBy, notes, meta });
  } catch (err) {
    console.error(`️  Audit log write failed [${action}]:`, err.message);
  }
};

module.exports = { logAudit };
