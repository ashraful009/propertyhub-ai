const {
  findPolicyByRoleTarget,
  createPolicy,
  upsertPolicyInDB,
} = require('./policy.repository');
const { NotFoundError, ValidationError } = require('../../../errors');

const DEFAULT_VENDOR_POLICY = `
<h2>FlatSell Vendor Terms & Conditions</h2>

<p>Welcome to FlatSell. By applying to become a vendor on our platform, you agree to be bound by the following terms and conditions. Please read them carefully before proceeding.</p>

<h3>1. Eligibility & Registration</h3>
<p>To become a vendor on FlatSell, you must be a legally registered business entity or a licensed real estate professional. You must provide accurate and complete information during the registration process. FlatSell reserves the right to verify your credentials and reject any application that does not meet our standards.</p>

<h3>2. Trade License & Documentation</h3>
<p>All vendors are required to provide a valid Trade License or equivalent business registration document. This document must be current and not expired. FlatSell will review your Trade License within 3–5 business days. Submission of fraudulent or expired documents will result in immediate rejection and may lead to legal action.</p>

<h3>3. Property Listings</h3>
<p>All property listings submitted by vendors are subject to review and approval by FlatSell administrators before they appear publicly on the platform. Vendors must ensure that all property information is accurate, up-to-date, and not misleading. False or exaggerated property descriptions are a violation of these terms and may result in suspension.</p>

<h3>4. Fees & Commission</h3>
<p>FlatSell charges a platform margin (commission) on every successful property booking processed through the marketplace. To ensure absolute transparency for our partners, our commission structure is strictly categorized by property type as follows:</p>
<ul>
  <li><strong>Apartments:</strong> 3% platform margin will be deducted from the total booking amount.</li>
  <li><strong>Villas:</strong> 5% platform margin will be deducted from the total booking amount.</li>
  <li><strong>Land:</strong> 7% platform margin will be deducted from the total booking amount.</li>
</ul>
<p>This margin covers platform maintenance, secure Stripe payment processing, automated invoicing, and marketing efforts. FlatSell reserves the right to review and update its fee structure. Any modifications to the commission rates will be communicated to all active vendors with a 30-day written notice prior to implementation.</p>
<h3>5. Content Standards</h3>
<p>All images, descriptions, and content uploaded by vendors must be original and must not infringe on any third-party intellectual property rights. Vendors are prohibited from uploading obscene, defamatory, or illegal content. FlatSell may remove any content that violates these standards without prior notice.</p>

<h3>6. Data Privacy</h3>
<p>Vendors acknowledge that FlatSell collects and processes business data in accordance with our Privacy Policy. Customer data accessed through the FlatSell platform must be handled in compliance with applicable data protection laws. Vendors may not use customer data for purposes other than fulfilling bookings made through FlatSell.</p>

<h3>7. Performance Standards</h3>
<p>Vendors are expected to respond to customer booking requests within 24 hours. Vendors who consistently fail to respond to inquiries or who receive recurring negative reviews may have their accounts suspended or terminated. FlatSell monitors vendor performance and maintains the right to enforce quality standards.</p>

<h3>8. Account Suspension & Termination</h3>
<p>FlatSell reserves the right to suspend or terminate a vendor account at any time if the vendor violates these terms, engages in fraudulent activity, or otherwise acts in a manner detrimental to the platform or its users. Upon termination, the vendor's active listings will be removed from the platform immediately.</p>

<h3>9. Liability</h3>
<p>FlatSell acts solely as a marketplace platform connecting vendors with customers. FlatSell is not a party to any transaction, agreement, or dispute between vendors and customers. Vendors are solely responsible for the accuracy of their listings and for fulfilling commitments made to customers.</p>

<h3>10. Amendments</h3>
<p>FlatSell reserves the right to amend these Terms & Conditions at any time. Vendors will be notified of significant changes via email. Continued use of the platform after notification constitutes acceptance of the updated terms.</p>

<h3>11. Governing Law</h3>
<p>These terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Bangladesh.</p>

<p><strong>By clicking "Continue", you confirm that you have read, understood, and agree to all of the above Terms & Conditions.</strong></p>
`;

const getPolicyService = async (roleTarget) => {
  let policy = await findPolicyByRoleTarget(roleTarget);

  if (!policy && roleTarget === 'vendor') {
    policy = await createPolicy({
      roleTarget: 'vendor',
      title: 'Vendor Terms & Conditions',
      content: DEFAULT_VENDOR_POLICY,
    });
  }

  if (!policy) {
    throw new NotFoundError('Policy not found');
  }

  return policy;
};

const upsertPolicyService = async (roleTarget, title, content) => {
  if (!content) {
    throw new ValidationError('Policy content is required');
  }

  const policy = await upsertPolicyInDB(roleTarget, title, content);
  return policy;
};

module.exports = {
  getPolicyService,
  upsertPolicyService,
};
