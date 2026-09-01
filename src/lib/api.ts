import { Patient, LabRequest, TestParameter, DiagnosisRecord, PriorityLevel } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      console.warn(`API Error ${res.status} on ${endpoint}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    // Graceful fallback to local state if backend is unreachable
    console.info(`Backend API ${API_BASE_URL} not reachable, using local fallback state.`);
    return null;
  }
}

export async function getPatientsAPI(): Promise<Patient[] | null> {
  return fetchJSON<Patient[]>('/patients');
}

export async function registerPatientAPI(
  patientData: Omit<Patient, 'id' | 'registeredDate'> & { assignedDoctor?: string }
): Promise<Patient | null> {
  return fetchJSON<Patient>('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
}

export async function getLabRequestsAPI(): Promise<LabRequest[] | null> {
  return fetchJSON<LabRequest[]>('/lab-requests');
}

export async function createLabRequestAPI(reqData: {
  patientId: string;
  patientName: string;
  doctorName: string;
  testCategory: string;
  testName: string;
  priority: PriorityLevel;
  notes?: string;
}): Promise<LabRequest | null> {
  return fetchJSON<LabRequest>('/lab-requests', {
    method: 'POST',
    body: JSON.stringify(reqData),
  });
}

export async function saveTestResultsAPI(
  requestId: string,
  parameters: TestParameter[],
  remarks: string
): Promise<LabRequest | null> {
  return fetchJSON<LabRequest>('/lab-requests/results', {
    method: 'POST',
    body: JSON.stringify({ requestId, parameters, remarks }),
  });
}

export async function getDiagnosesAPI(): Promise<DiagnosisRecord[] | null> {
  return fetchJSON<DiagnosisRecord[]>('/diagnoses');
}

export async function createDiagnosisAPI(diagnosisData: {
  patientId?: string;
  patientName: string;
  condition: string;
  treatment?: string;
  doctor: string;
}): Promise<DiagnosisRecord | null> {
  return fetchJSON<DiagnosisRecord>('/diagnoses', {
    method: 'POST',
    body: JSON.stringify(diagnosisData),
  });
}
