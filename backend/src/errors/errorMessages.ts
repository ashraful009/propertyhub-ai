export const ERROR_MESSAGES = {
  COMMON: {
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    UNAUTHORIZED: 'Unauthorized',
    MISSING_REQUIRED_FIELDS: 'Missing required fields',
    PERMISSION_DENIED: 'Permission denied. You do not have the required role',
  },

  AUTH: {
    ALL_FIELDS_REQUIRED: 'All fields are required',
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    USER_ALREADY_EXISTS: 'User already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCESS_DENIED_NO_TOKEN: 'Access denied. No token found',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid token or expired token',
  },

  DASHBOARD: {
    UNAUTHORIZED_ROLE: 'Unauthorized or invalid user role',
    FETCH_FAILED: 'Internal Server Error fetching dashboard stats.',
  },

  BOOKING: {
    CUSTOMER_ONLY: 'Only customers can book properties',
    NOT_FOUND: 'Booking not found',
    NOT_FOUND_OR_CANCELED: 'Booking not found or already canceled',
  },

  PROPERTY: {
    NOT_FOUND: 'Property not found',
    NOT_FOUND_OR_NO_UPDATE_PERMISSION: 'Property not found or you do not have permission to update it',
    NOT_FOUND_OR_NO_DELETE_PERMISSION: 'Property not found or you do not have permission to delete it',
  },

  VENDOR: {
    CUSTOMER_ONLY_APPLY: 'Only customers can apply to become a vendor',
    INVALID_REVIEW_STATUS: 'Invalid status. Must be APPROVED or REJECTED',
    REVIEW_FAILED: 'Failed to review application',
  },

  POLICY: {
    NOT_FOUND_OR_MANDATORY: 'Policy not found or is a mandatory system policy that cannot be modified',
  },

  INSTALLMENT: {
    INVALID_INPUT: 'Invalid input. Installments must be between 1 and 24',
    SCHEDULE_NOT_FOUND: 'No installment plan found for this booking',
  },

  PAYMENT: {
    SESSION_ID_REQUIRED: 'Session ID is required',
    PAYMENT_NOT_SUCCESSFUL: 'Payment not successful or already verified',
    INVOICE_NOT_FOUND: 'Invoice not found',
  },

  REFUND: {
    MISSING_BOOKING_ID: 'Missing booking_id',
    CANCELLATION_EXPIRED: 'Cancellation not acceptable. It has been more than 1 month since booking',
    NO_PAYMENT_TO_REFUND: 'No payment found to refund',
    CANCELLATION_FAILED: 'Cancellation failed',
  },

  COMPARE: {
    INVALID_IDS: 'Please provide valid property IDs',
  },
};
