// ============================================
// API Response Wrapper
// ============================================
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

// ============================================
// User & Auth
// ============================================
export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: IUser;
}

// ============================================
// Property
// ============================================
export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface IProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: PropertyStatus;
  is_approved?: boolean;
  vendor_id: string;
  vendor_name?: string;
  vendor_email?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Booking
// ============================================
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface IBooking {
  id: string;
  property_id: string;
  customer_id: string;
  vendor_id: string;
  booking_amount: number;
  status: BookingStatus;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Installment
// ============================================
export interface IInstallmentPlan {
  id: string;
  booking_id: string;
  total_due_amount: number;
  number_of_installments: number;
  charge_percentage: number;
  total_charge_amount: number;
  total_payable_amount: number;
  created_at?: string;
}

export interface IInstallmentMilestone {
  id: string;
  plan_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'UNPAID' | 'PAID' | 'LATE';
  stripe_charge_id?: string;
  late_fee?: number;
  paid_at?: string;
}

export interface InstallmentPreview {
  total_due: number;
  number_of_installments: number;
  charge_percentage: number;
  total_charge_amount: number;
  total_payable_amount: number;
  per_installment_amount: string;
}

export interface InstallmentSchedule {
  plan: IInstallmentPlan;
  milestones: IInstallmentMilestone[];
}

// ============================================
// Invoice
// ============================================
export interface IInvoice {
  id: string;
  user_id: string;
  booking_id: string;
  milestone_id?: string | null;
  stripe_session_id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  created_at?: string;
  paid_at?: string;
}

// ============================================
// Vendor Application
// ============================================
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IVendorApplication {
  id: string;
  user_id: string;
  company_name: string;
  location: string;
  full_address: string;
  company_mail: string;
  phone: string;
  document_url: string;
  status: ApplicationStatus;
  applicant_name?: string;
  applicant_email?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Policy
// ============================================
export interface IPolicy {
  id: string;
  policy_type: 'VENDOR_POLICY' | 'CUSTOMER_POLICY';
  title: string;
  content: string;
  is_mandatory: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// Dashboard Data Types
// ============================================
export interface AdminDashboardData {
  totalRevenue: string;
  revenueByCompany: { company_name: string; revenue: string }[];
  userStatistics: { role: string; count: string }[];
  propertyStatus: { status: string; count: string }[];
  pendingVendorApplications: string;
}

export interface VendorDashboardData {
  refundStats: {
    canceled_count: string;
    total_refunded: string;
    penalty_revenue: string;
  };
  totalSales: string;
  propertyInsights: { status: string; count: string }[];
  upcomingDuesNextMonth: string;
  defaultersLastMonth: {
    customer_id?: string;
    customer_name: string;
    email: string;
    phone: string;
    property: string;
    amount: number;
    due_date: string;
  }[];
  recentBookings: {
    id: string;
    customer_name: string;
    property: string;
    created_at: string;
  }[];
}

export interface CustomerDashboardData {
  myPropertiesCount: string;
  financialOverview: {
    totalPaid: number;
    totalDue: number;
  };
  upcomingPayment: {
    amount: number;
    due_date: string;
    property_title: string;
  } | null;
  paymentHistory: {
    amount: number;
    status: string;
    created_at: string;
    stripe_session_id: string;
  }[];
}
