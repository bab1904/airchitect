export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EXPLORER = 'EXPLORER',
  FLOOR_PLAN = 'FLOOR_PLAN',
  COST_ESTIMATION = 'COST_ESTIMATION',
  WORKFORCE = 'WORKFORCE',
  WORKLOG = 'WORKLOG',
  MATERIALS = 'MATERIALS',
  CLIENT_REQUESTS = 'CLIENT_REQUESTS',
  PROJECT_LIST = 'PROJECT_LIST',
  TEAM_MANAGEMENT = 'TEAM_MANAGEMENT',
  CONTRACTS = 'CONTRACTS',
  PERMITS = 'PERMITS',
  SCHEDULE = 'SCHEDULE',
  CODE_COMPLIANCE = 'CODE_COMPLIANCE',
  BOQ_OPTIMIZER = 'BOQ_OPTIMIZER',
  PROJECT_PLANS = 'PROJECT_PLANS'
}

export enum UserRole {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  SITE_MANAGER = 'SITE_MANAGER',
  SITE_ENGINEER = 'SITE_ENGINEER',
  CLIENT = 'CLIENT'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  budget: number;
  status: 'Planning' | 'In Progress' | 'Near Completion' | 'Completed' | 'On Hold';
  thumbnail: string;
  completionDate: string;
  team: TeamMember[];
}

export interface ClientRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  image?: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Rejected';
  date: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'Mason' | 'Carpenter' | 'Electrician' | 'Plumber' | 'Helper';
  status: 'Present' | 'Absent' | 'On Leave';
  hourlyRate: number;
  efficiency: number;
}

export interface DailyAttendance {
  date: string;
  Mason: number;
  Carpenter: number;
  Electrician: number;
  Plumber: number;
  Helper: number;
  totalWorkers: number;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minLevel: number;
  unitPrice: number;
}

export interface BOQItem {
  item: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface ProjectStats {
  totalBudget: number;
  spent: number;
  progress: number;
  daysRemaining: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface TeamMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  phone: string;
  rating: number;
  isFavorite: boolean;
}

export interface MaterialRequest {
  id: string;
  projectId: string;
  requesterName: string;
  requesterRole: UserRole;
  materialName: string;
  quantity: number;
  unit: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Ordered';
  date: string;
}

export interface SecurityAlert {
  id: string;
  projectId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: 'THEFT_RISK' | 'INVENTORY_DROP' | 'SUSPICIOUS_ACTIVITY';
  title: string;
  description: string;
  timestamp: string;
  isResolved: boolean;
}

export interface GeneratedDocument {
  id: string;
  projectId: string;
  title: string;
  type: 'Material Tender' | 'Contractor Agreement' | 'Payment Schedule' | 'Building Permit' | 'Fire NOC' | 'Safety Checklist';
  content: string;
  status: 'Draft' | 'Finalized';
  date: string;
}

export interface ScheduleTask {
  id: string;
  phase: string;
  task: string;
  startDay: number;
  durationDays: number;
  dependencies: string[];
  resources: string;
  milestone: boolean;
}

export interface ComplianceCheck {
  category: 'Setbacks' | 'Fire Safety' | 'Ventilation' | 'Sanitation' | 'Structural' | 'General';
  rule: string;
  requirement: string;
  provided: string;
  status: 'Pass' | 'Fail' | 'Warning';
  recommendation: string;
}

export interface ComplianceReport {
  overallStatus: 'Compliant' | 'Non-Compliant' | 'Conditional Approval';
  score: number;
  checks: ComplianceCheck[];
}

export interface OptimizationSuggestion {
  id: string;
  originalItem: string;
  proposedAlternative: string;
  savingsPercentage: number;
  potentialSavingsAmount: number;
  reasoning: string;
  implementationStrategy: string;
}

export interface DailyLog {
  id: string;
  projectId: string;
  date: string;
  author: string;
  role: UserRole;
  workDescription: string;
  weather: 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy';
  issues: string;
  status: 'On Track' | 'Delayed' | 'Ahead';
  images?: string[];
}
