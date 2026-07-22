const AuditLog = require('./auditLog.model');

const createAuditLog = async (data) => {
  return AuditLog.create(data);
};

module.exports = { createAuditLog };
