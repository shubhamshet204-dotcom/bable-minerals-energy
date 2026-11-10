export type AdminRole = 'Super Admin' | 'Procurement Head' | 'Risk & Credit Officer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin: string;
}

export type RFQStatus = 'Pending' | 'Reviewing' | 'Quoted' | 'Approved' | 'Dispatched' | 'Rejected';

export interface AdminRFQ {
  id: string;
  companyName: string;
  buyerName: string;
  phone: string;
  email: string;
  category: string;
  material: string;
  quantityMT: number;
  destinationCity: string;
  pinCode: string;
  paymentMode: 'credit' | 'cash';
  estimatedValue: number;
  submittedAt: string;
  status: RFQStatus;
  notes?: string;
}

export interface CreditApplication {
  id: string;
  companyName: string;
  gstin: string;
  annualTurnoverCr: number;
  requestedCreditCr: number;
  approvedCreditCr?: number;
  tenorDays: 30 | 60 | 90;
  cibilCommercialScore: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  appliedDate: string;
}

export interface SupplierPartner {
  id: string;
  name: string;
  type: 'Steel Rolling Mill' | 'Petrochemical Refinery' | 'Port Terminal' | 'Mineral Mine';
  location: string;
  annualCapacity: string;
  rating: number;
  status: 'Active' | 'Audit Pending' | 'Suspended';
  materialsSupplied: string[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  category: 'PRICING' | 'AUTH' | 'CREDIT' | 'RFQ' | 'SYSTEM';
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}
