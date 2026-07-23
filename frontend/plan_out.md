# Remove All Emoji Characters Used as Icons

## Goal
Remove all emoji characters used as icons across the frontend project. Emojis that sit next to text will be removed alongside any extra whitespace. Emojis used alone are flagged for user decision.

## User Review Required

> [!WARNING]
> The following standalone emojis (no accompanying text) were found. Removing them might leave empty elements visually. **Please confirm if you want to add text labels, use a placeholder icon, or just remove them entirely.**

- `D:/propertyhub-ai/frontend/src/components/companyAdmin/ManageProperties.jsx` (Line 136): `<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/ManageProperties.jsx` (Line 187): `<span className="text-5xl block mb-3">📭</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/ManageProperties.jsx` (Line 317): `<span className="text-5xl block mb-3">⚠️</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/PropertyPriceSection.jsx` (Line 19): `<span className="text-2xl">💰</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/VendorRefunds.jsx` (Line 49): `<p className="text-4xl mb-3">📭</p>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/ApartmentSpecStep.jsx` (Line 30): `<span className="text-2xl">🏗️</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/ApartmentSpecStep.jsx` (Line 57): `<span className="text-2xl">🏠</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/ApartmentSpecStep.jsx` (Line 103): `<span className="text-2xl">🗺️</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/BasicInfoStep.jsx` (Line 19): `<span className="text-2xl">📋</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/LandSpecStep.jsx` (Line 23): `<span className="text-2xl">📍</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/LandSpecStep.jsx` (Line 40): `<span className="text-2xl">📏</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/PropertyImagesStep.jsx` (Line 15): `<span className="text-2xl">🖼️</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/PropertyImagesStep.jsx` (Line 43): `<span className="text-4xl block mb-2">🏢</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/PropertyImagesStep.jsx` (Line 60): `<span className="text-2xl">🖼️</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/VillaSpecStep.jsx` (Line 23): `<span className="text-2xl">📍</span>`
- `D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/VillaSpecStep.jsx` (Line 40): `<span className="text-2xl">🏗️</span>`
- `D:/propertyhub-ai/frontend/src/components/customer/BookingDetailModal.jsx` (Line 248): `<span className="text-3xl">📄</span>`
- `D:/propertyhub-ai/frontend/src/components/customer/BookingDetailModal.jsx` (Line 253): `<span className="text-3xl opacity-40">🖼️</span>`
- `D:/propertyhub-ai/frontend/src/components/customer/BookingItemCard.jsx` (Line 79): `<span className="text-amber-600">⚠️</span>`
- `D:/propertyhub-ai/frontend/src/components/customer/CheckoutForm.jsx` (Line 110): `<span className="text-xl">↩️</span>`
- `D:/propertyhub-ai/frontend/src/components/customer/CheckoutPropertySummary.jsx` (Line 10): `<div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>`
- `D:/propertyhub-ai/frontend/src/components/customer/PropertySidebar.jsx` (Line 61): `🏢`
- `D:/propertyhub-ai/frontend/src/components/customer/UnitDetailModal.jsx` (Line 90): `<span className="text-primary-600 text-sm">🏷️</span>`
- `D:/propertyhub-ai/frontend/src/components/shared/BookingManagement.jsx` (Line 47): `<p className="text-4xl mb-4">📭</p>`
- `D:/propertyhub-ai/frontend/src/components/shared/SalesReport.jsx` (Line 217): `<span className="text-5xl block mb-4">📭</span>`
- `D:/propertyhub-ai/frontend/src/components/superAdmin/AutoCancelledBookings.jsx` (Line 57): `<p className="text-4xl mb-3">📭</p>`
- `D:/propertyhub-ai/frontend/src/components/superAdmin/BookingLimitOverrides.jsx` (Line 73): `<p className="text-4xl mb-3">✅</p>`
- `D:/propertyhub-ai/frontend/src/components/superAdmin/MarginTracking.jsx` (Line 260): `<span className="text-base">🔍</span>`
- `D:/propertyhub-ai/frontend/src/components/superAdmin/MarginTracking.jsx` (Line 545): `<span className="text-5xl mb-4">👈</span>`
- `D:/propertyhub-ai/frontend/src/components/superAdmin/RefundRequests.jsx` (Line 48): `<p className="text-4xl mb-3">📭</p>`
- `D:/propertyhub-ai/frontend/src/pages/companyAdmin/MyPropertiesPage.jsx` (Line 89): `<span className="text-5xl block mb-4">📭</span>`
- `D:/propertyhub-ai/frontend/src/pages/customer/CustomerDashboard.jsx` (Line 192): `<span className="text-5xl block mb-4">📭</span>`
- `D:/propertyhub-ai/frontend/src/pages/shared/HomePage.jsx` (Line 154): `<p className="text-4xl mb-3">🏗️</p>`
- `D:/propertyhub-ai/frontend/src/pages/shared/HomePage.jsx` (Line 185): `<span className="text-5xl mb-5 block">🏢</span>`
- `D:/propertyhub-ai/frontend/src/pages/shared/PropertiesPage.jsx` (Line 222): `<p className="text-4xl mb-3">🔍</p>`
- `D:/propertyhub-ai/frontend/src/pages/shared/PropertyDetailPage.jsx` (Line 56): `<p className="text-4xl mb-3">😕</p>`
- `D:/propertyhub-ai/frontend/src/pages/shared/UnauthorizedPage.jsx` (Line 6): `<p className="text-7xl mb-4">🔒</p>`
- `D:/propertyhub-ai/frontend/src/pages/superAdmin/SuperAdminDashboard.jsx` (Line 103): `<span className="text-green-600 text-sm">⚡</span>`

## Open Questions

> [!IMPORTANT]
> - For standalone emojis listed above, should they be removed completely (leaving an empty visual space), or do you want text labels added in their place?
> - Should data keys containing emojis (e.g. `icon` fields in config arrays) be completely removed or set to empty strings? (Default proposed: set to `null` or empty string to avoid breaking component props).

## Proposed Changes

Grouped by file, here are all the emoji occurrences that will be removed.

### [MODIFY] [AddPropertyForm.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/AddPropertyForm.jsx)
- Line 167: `<h2 className="text-xl font-bold text-gray-900 mb-2">Property Submitted! 🏠</h2>`
- Line 290: `<SectionTitle>🏡 Villa — Location</SectionTitle>`
- Line 404: `<SectionTitle>🌿 Land — Location</SectionTitle>`
- Line 555: `) : '🏠 Submit Property for Review'}`

### [MODIFY] [AddPropertyWizard.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/AddPropertyWizard.jsx)
- Line 30: `<h2 className="text-2xl font-bold text-gray-900 mb-2">Property Submitted! 🏠</h2>`
- Line 46: `<span>⚠️</span> {error}`
- Line 87: `{loading ? 'Uploading & Submitting...' : '🏠 Submit Property'}`

### [MODIFY] [EditPropertyModal.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/EditPropertyModal.jsx)
- Line 138: `⚠️ {error}`

### [MODIFY] [InstallmentSetupModal.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/InstallmentSetupModal.jsx)
- Line 141: `<span>📅</span> Installment Policy`
- Line 176: `<span>↩️</span> Refund Policy`
- Line 199: `<span>🚫</span> Inactivity Cancellation`
- Line 253: `<span>⚠️</span> {error}`
- Line 265: `💡 Plan Preview`

### [MODIFY] [LocationPicker.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/LocationPicker.jsx)
- Line 96: `📍 Click anywhere on the map to set your company location`

### [MODIFY] [ManageProperties.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/ManageProperties.jsx)
- Line 13: `pending:  '⏳',`
- Line 14: `approved: '✅',`
- Line 15: `rejected: '❌',`
- Line 19: `Apartments: '🏢', Villas: '🏡', Land: '🌾',`
- Line 136: `<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>`
- Line 187: `<span className="text-5xl block mb-3">📭</span>`
- Line 217: `{CATEGORY_ICONS[p.category] || '🏢'}`
- Line 241: `📍 {p.city}`
- Line 284: `✏️ Edit`
- Line 294: `{processing[p._id] === 'deleting' ? '...' : '🗑️ Delete'}`
- Line 317: `<span className="text-5xl block mb-3">⚠️</span>`

### [MODIFY] [PropertyPriceSection.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/PropertyPriceSection.jsx)
- Line 14: `const hint = "💡 Booking money is calculated automatically from your company's Booking Policy settings.";`
- Line 19: `<span className="text-2xl">💰</span>`

### [MODIFY] [PropertyRequests.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/PropertyRequests.jsx)
- Line 79: `<p className="text-4xl mb-3">{mode === 'admin' ? '✅' : '📭'}</p>`

### [MODIFY] [VendorApplicationForm.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/VendorApplicationForm.jsx)
- Line 86: `<h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted! 🎉</h2>`

### [MODIFY] [VendorRefunds.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/VendorRefunds.jsx)
- Line 49: `<p className="text-4xl mb-3">📭</p>`

### [MODIFY] [ApartmentSpecStep.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/ApartmentSpecStep.jsx)
- Line 30: `<span className="text-2xl">🏗️</span>`
- Line 57: `<span className="text-2xl">🏠</span>`
- Line 103: `<span className="text-2xl">🗺️</span>`

### [MODIFY] [BasicInfoStep.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/BasicInfoStep.jsx)
- Line 5: `const CATEGORY_ICONS = { Apartments: '🏢', Villas: '🏡', Land: '🌿' };`
- Line 19: `<span className="text-2xl">📋</span>`

### [MODIFY] [LandSpecStep.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/LandSpecStep.jsx)
- Line 23: `<span className="text-2xl">📍</span>`
- Line 40: `<span className="text-2xl">📏</span>`

### [MODIFY] [PropertyImagesStep.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/PropertyImagesStep.jsx)
- Line 15: `<span className="text-2xl">🖼️</span>`
- Line 43: `<span className="text-4xl block mb-2">🏢</span>`
- Line 60: `<span className="text-2xl">🖼️</span>`

### [MODIFY] [VillaSpecStep.jsx](file:///D:/propertyhub-ai/frontend/src/components/companyAdmin/wizard/VillaSpecStep.jsx)
- Line 23: `<span className="text-2xl">📍</span>`
- Line 40: `<span className="text-2xl">🏗️</span>`

### [MODIFY] [BookingDetailModal.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/BookingDetailModal.jsx)
- Line 51: `'Personal Information':  '👤',`
- Line 52: `'Contact Information':   '📞',`
- Line 53: `'Financial Information': '💳',`
- Line 54: `'Property Details':      '🏠',`
- Line 55: `'Nominee Information':   '👥',`
- Line 184: `<span>🔑</span> Account Holder`
- Line 208: `<span>{SECTION_ICONS[section] || '📄'}</span> {section}`
- Line 229: `<span>📎</span> Uploaded Documents`
- Line 248: `<span className="text-3xl">📄</span>`
- Line 249: `<span className="text-xs font-medium">View ↗</span>`
- Line 253: `<span className="text-3xl opacity-40">🖼️</span>`
- Line 272: `<span>📝</span> Message`
- Line 283: `<span>📅</span> Booking Details`

### [MODIFY] [BookingItemCard.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/BookingItemCard.jsx)
- Line 68: `{b.propertyId?.category === 'villa' ? '🏡' : b.propertyId?.category === 'land' ? '🌿' : '🏢'}`
- Line 79: `<span className="text-amber-600">⚠️</span>`
- Line 102: `📅 Set Installment`
- Line 110: `📅 {b.installmentPlan.totalCount}-Installment Plan`
- Line 118: `🚫 NO REFUND`
- Line 123: `↩️ REFUNDED`
- Line 166: `💳 Pay Installment`
- Line 232: `{refunding === b._id ? 'Processing…' : '↩️ Request Refund'}`
- Line 250: `📥 Download Invoice`

### [MODIFY] [CheckoutForm.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/CheckoutForm.jsx)
- Line 76: `<span className="text-lg">{fileData[key] ? '✅' : '📎'}</span>`
- Line 110: `<span className="text-xl">↩️</span>`
- Line 149: `<>💳 Proceed to Payment — ৳{bookingMoney.toLocaleString()}</>`

### [MODIFY] [CheckoutPropertySummary.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/CheckoutPropertySummary.jsx)
- Line 10: `<div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>`
- Line 15: `<p className="text-gray-500 text-xs mt-0.5">📍 {property.address}, {property.city}</p>`

### [MODIFY] [CheckoutSidebarSummary.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/CheckoutSidebarSummary.jsx)
- Line 12: `💰 Payment Summary`
- Line 32: `💡 You will pay <strong>৳{bookingMoney.toLocaleString()}</strong> now as booking money.`
- Line 39: `{['🔒 Secure', '💳 Stripe', '🛡️ Protected'].map((badge) => (`

### [MODIFY] [InstallmentListModal.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/InstallmentListModal.jsx)
- Line 41: `'⚠️ This installment is overdue.\n\n' +`
- Line 210: `{downloadingId === inst._id ? '...' : '📥 Invoice'}`
- Line 240: `⚠️ This installment is past its due date (the 15th). A ৳5,000 late fee will be added at payment.`

### [MODIFY] [PropertyAboutTab.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/PropertyAboutTab.jsx)
- Line 41: `['privatePool',    '🏊 Pool'],`
- Line 42: `['garden',         '🌳 Garden'],`
- Line 43: `['garage',         '🚗 Garage'],`
- Line 44: `['rooftopTerrace', '🌇 Rooftop'],`
- Line 45: `['servantRoom',    '🛏️ Servant Room'],`
- Line 46: `['securitySystem', '🔒 Security'],`
- Line 87: `['electricityLine',    '⚡ Electricity'],`
- Line 88: `['gasWaterConnection',  '💧 Gas/Water'],`
- Line 89: `['drainageSystem',      '🚰 Drainage'],`
- Line 109: `{ l: '🏫 School',   v: landDetails.nearbySchool },`
- Line 110: `{ l: '🏥 Hospital', v: landDetails.nearbyHospital },`
- Line 111: `{ l: '🏪 Market',   v: landDetails.nearbyMarket },`

### [MODIFY] [PropertyHeroGallery.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/PropertyHeroGallery.jsx)
- Line 80: `<span className="text-6xl">{categoryIcons[category] || '🏢'}</span>`

### [MODIFY] [PropertySidebar.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/PropertySidebar.jsx)
- Line 32: `{cat === 'apartment' ? '🏗️ View Floor Plan' : cat === 'villa' ? '🏡 View Villa Preview' : '🌿 View Land Preview'}`
- Line 48: `📋 Request Booking`
- Line 61: `🏢`

### [MODIFY] [UnitDetailModal.jsx](file:///D:/propertyhub-ai/frontend/src/components/customer/UnitDetailModal.jsx)
- Line 90: `<span className="text-primary-600 text-sm">🏷️</span>`
- Line 99: `{ icon: '📐', label: 'Square Feet',     value: flatType.sqft ? '${flatType.sqft} sft' : '—' },`
- Line 100: `{ icon: '💰', label: 'Price (BDT)',      value: flatType.pricePerUnit ? '৳${Number(flatType.pricePerUnit).toLocaleString()}' : '—' },`
- Line 101: `{ icon: '🛏️', label: 'Bedrooms',         value: flatType.bedrooms ?? '—' },`
- Line 102: `{ icon: '🚿', label: 'Washrooms',        value: flatType.bathrooms ?? '—' },`
- Line 103: `{ icon: '🍳', label: 'Kitchen',          value: flatType.kitchen || '—' },`
- Line 104: `{ icon: '🍽️', label: 'Dining',           value: flatType.dining || '—' },`
- Line 105: `{ icon: '🖼️', label: 'Drawing',          value: flatType.drawing || '—' },`
- Line 106: `{ icon: '🅿️', label: 'Parking Area',     value: flatType.parking || '—' },`
- Line 119: `<p className="text-gray-500 text-xs mb-1">📝 Type Description</p>`
- Line 179: `{loading ? 'Confirming...' : '📋 Request Booking'}`
- Line 190: `{unit.status === 'booked' ? '⏳ This unit is already booked' : '🚫 This unit has been sold'}`

### [MODIFY] [BookingManagement.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/BookingManagement.jsx)
- Line 47: `<p className="text-4xl mb-4">📭</p>`

### [MODIFY] [Footer.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/Footer.jsx)
- Line 84: `© {year} FlatSell. All rights reserved.`

### [MODIFY] [Navbar.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/Navbar.jsx)
- Line 12: `links.push({ label: 'Admin Dashboard',   path: '/dashboard/super-admin',   icon: '⚡' });`
- Line 14: `links.push({ label: 'Company Dashboard', path: '/dashboard/company-admin', icon: '🏢' });`
- Line 16: `links.push({ label: 'Seller Dashboard',  path: '/dashboard/seller',        icon: '🏠' });`
- Line 18: `links.push({ label: 'My Profile',        path: '/dashboard/customer',      icon: '👤' });`
- Line 136: `🏷️ Become a Vendor`
- Line 321: `🏷️ Become a Vendor`

### [MODIFY] [PropertyCard.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/PropertyCard.jsx)
- Line 132: `📐 {property.landDetails.totalSize} Katha`

### [MODIFY] [SalesReport.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/SalesReport.jsx)
- Line 34: `const CAT_ICONS = { apartment: '🏢', villa: '🏡', land: '🌿' };`
- Line 111: `{mode === 'admin' ? '📈 Platform Sales Report' : '📈 My Sales Report'}`
- Line 129: `? (<><span className="animate-spin">⏳</span> Generating...</>)`
- Line 130: `: (<>📥 Download Report</>)}`
- Line 190: `{ label: 'Total Bookings',         value: bookings.length,      icon: '📋', color: 'blue'    },`
- Line 191: `{ label: 'Revenue Collected',       value: fmt(totalRevenue),    icon: '💰', color: 'emerald' },`
- Line 192: `{ label: 'Total Property Volume',   value: fmt(totalVolume),     icon: '📊', color: 'primary' },`
- Line 217: `<span className="text-5xl block mb-4">📭</span>`
- Line 243: `<span className="text-base">{CAT_ICONS[b.propertyId?.category] || '🏠'}</span>`

### [MODIFY] [VillaVisualizer.jsx](file:///D:/propertyhub-ai/frontend/src/components/shared/VillaVisualizer.jsx)
- Line 2: `{ key: 'privatePool',    label: 'Swimming Pool', icon: '🏊', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' },`
- Line 3: `{ key: 'garden',         label: 'Garden',        icon: '🌳', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },`
- Line 4: `{ key: 'garage',         label: 'Garage',        icon: '🚗', color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30' },`
- Line 5: `{ key: 'rooftopTerrace', label: 'Rooftop',       icon: '🌇', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30' },`
- Line 6: `{ key: 'servantRoom',    label: 'Servant Room',  icon: '🛏️', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },`
- Line 7: `{ key: 'securitySystem', label: 'Security',      icon: '🔒', color: 'from-red-500/20 to-red-600/10 border-red-500/30' },`
- Line 32: `🌇 Rooftop`
- Line 52: `🛏️ {v.bedrooms} Bed`
- Line 57: `🚿 {v.bathrooms} Bath`
- Line 62: `🛋️ Living`
- Line 67: `🍳 Kitchen`
- Line 72: `🍽️ Dining`
- Line 77: `🛏️ Servant`
- Line 89: `🚗 Garage`
- Line 94: `🔒 Security`
- Line 102: `🌳 Garden`
- Line 107: `🏊 Swimming Pool`

### [MODIFY] [AutoCancelledBookings.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/AutoCancelledBookings.jsx)
- Line 10: `{ id: 'inactivity',       label: '🚫 Auto (Inactivity)' },`
- Line 11: `{ id: 'refund_requested', label: '↩️ Refund-Cancelled'  },`
- Line 12: `{ id: 'manual',           label: '✋ Manual'            },`
- Line 57: `<p className="text-4xl mb-3">📭</p>`

### [MODIFY] [BookingLimitOverrides.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/BookingLimitOverrides.jsx)
- Line 73: `<p className="text-4xl mb-3">✅</p>`

### [MODIFY] [BookingPoliciesSettings.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/BookingPoliciesSettings.jsx)
- Line 12: `icon: '👤',`
- Line 26: `icon: '📞',`
- Line 37: `icon: '💳',`
- Line 47: `icon: '🏠',`
- Line 59: `icon: '👥',`
- Line 69: `icon: '📄',`
- Line 81: `{ key: 'apartment', label: 'Apartments', icon: '🏢', color: 'from-blue-600 to-blue-800',   border: 'border-blue-500/30',   activeBg: 'bg-blue-500/15',   activeText: 'text-blue-600' },`
- Line 82: `{ key: 'villa',     label: 'Villas',     icon: '🏡', color: 'from-emerald-600 to-emerald-800', border: 'border-emerald-500/30', activeBg: 'bg-emerald-500/15', activeText: 'text-emerald-600' },`
- Line 83: `{ key: 'land',      label: 'Land',       icon: '🌿', color: 'from-amber-600 to-amber-800', border: 'border-amber-500/30', activeBg: 'bg-amber-500/15', activeText: 'text-amber-600' },`
- Line 180: `📋 Booking Policies`
- Line 234: `💰 Booking Money Percentage`
- Line 270: `✅ Required KYC & Booking Fields`
- Line 367: `<>💾 Save {activeCat?.label} Policy</>`

### [MODIFY] [CompanyApproval.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/CompanyApproval.jsx)
- Line 77: `📄 View Trade License Document`
- Line 87: `{loadingIds.has(c._id) ? '⏳ Approving...' : '✓ Approve'}`
- Line 93: `{loadingIds.has(c._id) ? '⏳ Processing...' : '✕ Reject'}`
- Line 113: `↗ Open in New Tab`

### [MODIFY] [MarginTracking.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/MarginTracking.jsx)
- Line 251: `? <><span className="animate-spin">⏳</span> Generating PDF...</>`
- Line 252: `: <>📥 Download Margin Report</>`
- Line 260: `<span className="text-base">🔍</span>`
- Line 333: `<span>⚠️</span> {filterError}`
- Line 364: `📅 {DATE_PRESETS.find((p) => p.key === applied.filterType)?.label}`
- Line 374: `🏢 Report: {selectedCompanyName}`
- Line 390: `flex items-center justify-center text-2xl">💰</div>`
- Line 405: `flex items-center justify-center text-2xl">📊</div>`
- Line 420: `flex items-center justify-center text-2xl">📝</div>`
- Line 438: `🏢 Commission Breakdown by Company`
- Line 486: `<h3 className="text-lg font-bold text-gray-900">🏠 Property Breakdown</h3>`
- Line 545: `<span className="text-5xl mb-4">👈</span>`

### [MODIFY] [PolicyCenter.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/PolicyCenter.jsx)
- Line 12: `{ id: 'settings',   label: '⚙️ Settings',           render: () => <PolicySettings /> },`
- Line 13: `{ id: 'cancelled',  label: '🚫 Auto-Cancelled',     render: () => <AutoCancelledBookings /> },`
- Line 14: `{ id: 'refunds',    label: '↩️ Refund Requests',    render: () => <RefundRequests /> },`
- Line 15: `{ id: 'limits',     label: '🚦 Booking Limits',     render: () => <BookingLimitOverrides /> },`

### [MODIFY] [PolicySettings.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/PolicySettings.jsx)
- Line 81: `{saving ? 'Saving…' : '💾 Save Settings'}`

### [MODIFY] [RefundRequests.jsx](file:///D:/propertyhub-ai/frontend/src/components/superAdmin/RefundRequests.jsx)
- Line 48: `<p className="text-4xl mb-3">📭</p>`

### [MODIFY] [checkout.constants.js](file:///D:/propertyhub-ai/frontend/src/data/checkout.constants.js)
- Line 19: `'Personal Information': '👤',`
- Line 20: `'Address Information': '🏠',`
- Line 21: `'Emergency Contact': '🚨',`
- Line 22: `'Financial Information': '💳'`

### [MODIFY] [propertyOptions.js](file:///D:/propertyhub-ai/frontend/src/data/propertyOptions.js)
- Line 4: `Apartments: '🏢',`
- Line 5: `Villas: '🏡',`
- Line 6: `Land: '🌿',`

### [MODIFY] [useAddProperty.js](file:///D:/propertyhub-ai/frontend/src/hooks/useAddProperty.js)
- Line 8: `Apartments: '🏢',`
- Line 9: `Villas:     '🏡',`
- Line 10: `Land:       '🌿',`

### [MODIFY] [CompanyAdminDashboard.jsx](file:///D:/propertyhub-ai/frontend/src/pages/companyAdmin/CompanyAdminDashboard.jsx)
- Line 12: `{ id: 'manage',  label: '📦 Manage Properties' },`
- Line 13: `{ id: 'add',     label: '➕ Add Property'       },`
- Line 14: `{ id: 'pending', label: '📋 My Submissions'     },`
- Line 15: `{ id: 'bookings',label: '📅 Bookings / Leads'   },`
- Line 16: `{ id: 'refunds', label: '💸 Refunds'            },`
- Line 17: `{ id: 'sales',   label: '📈 Sales Report'       },`
- Line 18: `{ id: 'settings',label: '⚙️ Settings'            },`
- Line 74: `➕ Add New`

### [MODIFY] [MyPropertiesPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/companyAdmin/MyPropertiesPage.jsx)
- Line 7: `unpaid:       { label: 'Unpaid',       color: 'text-amber-600',   bg: 'bg-amber-500/15 border-amber-500/30',   icon: '⏳' },`
- Line 8: `booking_paid: { label: 'Booking Paid', color: 'text-blue-600',    bg: 'bg-blue-500/15 border-blue-500/30',     icon: '💳' },`
- Line 9: `fully_paid:   { label: 'Fully Paid',   color: 'text-emerald-600', bg: 'bg-emerald-500/15 border-emerald-500/30',icon: '✅' },`
- Line 11: `paid:         { label: 'Paid',         color: 'text-emerald-600', bg: 'bg-emerald-500/15 border-emerald-500/30',icon: '✅' },`
- Line 89: `<span className="text-5xl block mb-4">📭</span>`
- Line 125: `{prop?.category === 'villa' ? '🏡' : prop?.category === 'land' ? '🌿' : '🏢'}`
- Line 144: `📍 {prop?.address}, {prop?.city}`
- Line 249: `<>💳 Pay {formatCurrency(dueAmount)}</>`

### [MODIFY] [BookingCheckoutPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/customer/BookingCheckoutPage.jsx)
- Line 230: `<span className="text-5xl block mb-4">{isTotal ? '🚦' : '⛔'}</span>`
- Line 239: `📨 Contact Super Admin`

### [MODIFY] [BookingSuccessPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/customer/BookingSuccessPage.jsx)
- Line 96: `{isDuePayment ? '✅ Fully Paid' : '💳 Booking Money Paid'}`

### [MODIFY] [CustomerDashboard.jsx](file:///D:/propertyhub-ai/frontend/src/pages/customer/CustomerDashboard.jsx)
- Line 22: `unpaid:       { label: 'Unpaid',       color: 'text-amber-600',   icon: '⏳' },`
- Line 23: `booking_paid: { label: 'Booking Paid', color: 'text-blue-600',    icon: '💳' },`
- Line 24: `fully_paid:   { label: 'Fully Paid',   color: 'text-emerald-600', icon: '✅' },`
- Line 25: `paid:         { label: 'Paid',         color: 'text-emerald-600', icon: '✅' },`
- Line 192: `<span className="text-5xl block mb-4">📭</span>`

### [MODIFY] [BecomeVendorPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/shared/BecomeVendorPage.jsx)
- Line 128: `📋 Read & Accept Terms`

### [MODIFY] [HomePage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/shared/HomePage.jsx)
- Line 11: `{ key: 'apartment',  icon: '🏢', label: 'Apartments', gradient: 'from-blue-600/25 to-blue-900/20',   border: 'hover:border-blue-500/40'  },`
- Line 12: `{ key: 'villa',      icon: '🏡', label: 'Villas',     gradient: 'from-pink-600/25 to-pink-900/20',   border: 'hover:border-pink-500/40'  },`
- Line 13: `{ key: 'land',       icon: '🌿', label: 'Land',       gradient: 'from-green-600/25 to-green-900/20', border: 'hover:border-green-500/40' },`
- Line 154: `<p className="text-4xl mb-3">🏗️</p>`
- Line 185: `<span className="text-5xl mb-5 block">🏢</span>`

### [MODIFY] [PropertiesPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/shared/PropertiesPage.jsx)
- Line 10: `{ value: 'apartment',  label: '🏢 Apartments'  },`
- Line 11: `{ value: 'villa',      label: '🏡 Villas'       },`
- Line 12: `{ value: 'land',       label: '🌿 Land'         },`
- Line 222: `<p className="text-4xl mb-3">🔍</p>`

### [MODIFY] [PropertyDetailPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/shared/PropertyDetailPage.jsx)
- Line 18: `apartment: '🏢', villa: '🏡', land: '🌿',`
- Line 56: `<p className="text-4xl mb-3">😕</p>`
- Line 192: `📍 {address}, {city}`

### [MODIFY] [UnauthorizedPage.jsx](file:///D:/propertyhub-ai/frontend/src/pages/shared/UnauthorizedPage.jsx)
- Line 6: `<p className="text-7xl mb-4">🔒</p>`

### [MODIFY] [SuperAdminDashboard.jsx](file:///D:/propertyhub-ai/frontend/src/pages/superAdmin/SuperAdminDashboard.jsx)
- Line 12: `{ id: 'pending',   label: '⏳ Pending Properties'  },`
- Line 13: `{ id: 'manage',    label: '📦 Manage All'           },`
- Line 14: `{ id: 'add',       label: '➕ Add Property'         },`
- Line 15: `{ id: 'companies', label: '🏢 Company' },`
- Line 16: `{ id: 'margin',    label: '💰 Margin'     },`
- Line 17: `{ id: 'sales',     label: '📈 Sales Report'         },`
- Line 18: `{ id: 'policies',  label: '🛡️ Policies'             },`
- Line 89: `➕ Add Property`
- Line 103: `<span className="text-green-600 text-sm">⚡</span>`

## Verification Plan
- Run a final `grep_search` for emoji character sets (`\p{Emoji_Presentation}`) to ensure 0 results remain in the frontend.
- Run the frontend build and linter to check that no layout/jsx was broken.
- Manually inspect any flagged standalone emoji components.
