export const RESPONSE_MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
  },

  DASHBOARD: {
    FETCHED: 'Dashboard data fetched',
  },

  BOOKING: {
    CREATED: 'Booking request submitted successfully',
    FETCHED: 'Bookings fetched',
    STATUS_UPDATED: (status: string) => `Booking status updated to ${status}`,
  },

  PROPERTY: {
    FETCHED: 'Properties fetched',
    CREATED: 'Property added successfully',
    UPDATED: 'Property updated successfully',
    DELETED: 'Property deleted successfully',
  },

  VENDOR: {
    APPLICATION_SUBMITTED: 'Application submitted successfully. Waiting for admin approval',
    APPLICATIONS_FETCHED: 'Applications fetched',
    APPLICATION_REVIEWED: (status: string) =>
      `Application ${status.toLowerCase()} successfully${status === 'APPROVED' ? '. User is now a VENDOR' : ''}`,
    POLICY_FETCHED: 'Vendor policy fetched',
  },

  INSTALLMENT: {
    PREVIEW_GENERATED: 'Preview generated',
    SCHEDULE_GENERATED: 'Installment schedule generated successfully',
    SCHEDULE_FETCHED: 'Schedule retrieved',
  },

  PAYMENT: {
    CHECKOUT_CREATED: 'Checkout session created',
    VERIFIED: 'Payment verified and invoice updated',
  },

  REFUND: {
    CANCELED_WITH_PENALTY: 'Booking canceled successfully. 10% penalty applied',
    AUTO_CANCELED: (count: number) =>
      `${count} defaulted bookings were automatically canceled. Properties marked as AVAILABLE`,
  },

  COMPARE: {
    FETCHED: 'Comparison data fetched',
  },

  SEARCH: {
    FETCHED: 'Search results fetched',
  },

  USER: {
    PROFILE_FETCHED: 'Welcome to your profile',
    VENDOR_DASHBOARD: 'Welcome to vendor dashboard',
    ADMIN_DASHBOARD: 'Welcome to admin dashboard',
  },

  GENERAL: {
    API_WORKING: 'API working',
  },
};
