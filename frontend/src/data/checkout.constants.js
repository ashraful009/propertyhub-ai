export const PAYMENT_METHODS = [
  { id: 'full', label: 'Full Payment', description: 'Pay the complete booking amount now.' },
  { id: 'installment', label: 'Installment Plan', description: 'Pay in structured monthly installments.' }
];

export const INITIAL_CHECKOUT_STATE = {
  paymentMethod: 'full',
  agreedToTerms: false,
};

export const SECTION_ORDER = [
  'Personal Information',
  'Address Information',
  'Emergency Contact',
  'Financial Information'
];

export const SECTION_ICONS = {
  'Personal Information': '',
  'Address Information': '',
  'Emergency Contact': '',
  'Financial Information': ''
};

export const FIELD_META = [
  { key: 'fullName', label: 'Full Name', type: 'text', section: 'Personal Information', required: true },
  { key: 'phone', label: 'Phone Number', type: 'text', section: 'Personal Information', required: true },
  { key: 'email', label: 'Email Address', type: 'text', section: 'Personal Information', required: true },
  { key: 'nid', label: 'NID / Passport', type: 'text', section: 'Personal Information', required: true },
  { key: 'presentAddress', label: 'Present Address', type: 'textarea', section: 'Address Information', required: true },
  { key: 'permanentAddress', label: 'Permanent Address', type: 'textarea', section: 'Address Information', required: true },
  { key: 'emergencyName', label: 'Contact Person Name', type: 'text', section: 'Emergency Contact', required: true },
  { key: 'emergencyPhone', label: 'Contact Person Phone', type: 'text', section: 'Emergency Contact', required: true },
  { key: 'emergencyRelation', label: 'Relationship', type: 'text', section: 'Emergency Contact', required: true }
];
