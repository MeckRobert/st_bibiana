export type UserRole = 'login' | 'receptionist' | 'lab_tech' | 'doctor';

export interface UserProfile {
  name: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  phone: string;
  email: string;
  assignedDoctor?: string;
  status?: string;
  registeredDate: string;
}

export type PriorityLevel = 'Normal' | 'High' | 'Urgent';
export type RequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'New';

export interface TestParameter {
  id: string;
  parameter: string;
  result: string;
  unit: string;
  referenceRange: string;
}

export interface LabRequest {
  id: string; // e.g., REQ-00032
  patientId: string;
  patientName: string;
  testCategory: string;
  testName: string;
  doctorName: string;
  priority: PriorityLevel;
  requestTime: string;
  status: RequestStatus;
  notes?: string;
  remarks?: string;
  parameters: TestParameter[];
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  time: string; // e.g. "09:00 AM"
  patientName: string;
  type: string; // e.g. "General Checkup", "Consultation", "Review Results"
  doctor: string;
}

export interface DiagnosisRecord {
  id: string;
  patientId?: string;
  patientName: string;
  condition: string;
  treatment?: string;
  date: string;
  doctor: string;
}
