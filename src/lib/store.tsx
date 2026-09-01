'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Patient,
  LabRequest,
  Appointment,
  DiagnosisRecord,
  TestParameter,
  PriorityLevel,
} from './types';
import {
  getPatientsAPI,
  registerPatientAPI,
  getLabRequestsAPI,
  createLabRequestAPI,
  saveTestResultsAPI,
  getDiagnosesAPI,
  createDiagnosisAPI,
} from './api';

interface AppStateContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userProfiles: Record<UserRole, { name: string; title: string }>;
  patients: Patient[];
  requests: LabRequest[];
  appointments: Appointment[];
  diagnoses: DiagnosisRecord[];
  activeModal: 'patient_reg' | 'new_request' | 'enter_results' | null;
  selectedRequestForResults: LabRequest | null;
  openModal: (modal: 'patient_reg' | 'new_request' | 'enter_results', request?: LabRequest) => void;
  closeModal: () => void;
  addPatient: (patient: Omit<Patient, 'id' | 'registeredDate'> & { assignedDoctor?: string; status?: string }) => void;
  addLabRequest: (req: {
    patientId: string;
    patientName: string;
    doctorName: string;
    testCategory: string;
    testName: string;
    priority: PriorityLevel;
    notes?: string;
  }) => void;
  saveTestResults: (requestId: string, parameters: TestParameter[], remarks: string) => void;
  addDiagnosis: (diag: { patientId?: string; patientName: string; condition: string; treatment?: string; doctor: string }) => void;
  stats: {
    receptionist: { todayPatients: number; labRequests: number; pendingPayments: number; appointments: number };
    labTech: { pendingTests: number; inProgress: number; completedToday: number; samplesCollected: number };
    doctor: { todayPatients: number; resultsToReview: number; diagnosesToday: number; followUps: number };
  };
}

const initialPatients: Patient[] = [
  { id: 'PAT-0001', fullName: 'John Mwangi', gender: 'Male', dateOfBirth: '1988-04-12', phone: '+254 712 345678', email: 'john.mwangi@example.com', assignedDoctor: 'Dr. Peter Odhiambo', status: 'Lab Ordered', registeredDate: '2026-08-01' },
  { id: 'PAT-0002', fullName: 'Mary Wanjiku', gender: 'Female', dateOfBirth: '1992-09-24', phone: '+254 722 987654', email: 'mary.w@example.com', assignedDoctor: 'Dr. Peter Odhiambo', status: 'Lab Ordered', registeredDate: '2026-08-02' },
  { id: 'PAT-0003', fullName: 'James Kibera', gender: 'Male', dateOfBirth: '1980-01-15', phone: '+254 733 112233', email: 'jkibera@example.com', assignedDoctor: 'Dr. Grace', status: 'Lab In Progress', registeredDate: '2026-08-05' },
  { id: 'PAT-0004', fullName: 'Grace Njeri', gender: 'Female', dateOfBirth: '1995-11-30', phone: '+254 700 445566', email: 'grace.njeri@example.com', assignedDoctor: 'Dr. Peter Odhiambo', status: 'Lab Ordered', registeredDate: '2026-08-07' },
  { id: 'PAT-0005', fullName: 'Samuel Otieno', gender: 'Male', dateOfBirth: '1985-06-18', phone: '+254 711 778899', email: 'sam.otieno@example.com', assignedDoctor: 'Dr. Grace', status: 'Results Ready', registeredDate: '2026-08-08' },
];

const defaultParametersMap: Record<string, TestParameter[]> = {
  'Complete Blood Count': [
    { id: 'p1', parameter: 'WBC', result: '5.6', unit: '10^3/µL', referenceRange: '4.0 - 11.0' },
    { id: 'p2', parameter: 'RBC', result: '4.8', unit: '10^6/µL', referenceRange: '4.5 - 6.0' },
    { id: 'p3', parameter: 'Hemoglobin', result: '13.5', unit: 'g/dL', referenceRange: '13.0 - 17.0' },
    { id: 'p4', parameter: 'Platelets', result: '250', unit: '10^3/µL', referenceRange: '150 - 450' },
  ],
  'Malaria Test': [
    { id: 'p1', parameter: 'P. falciparum Parasites', result: 'Positive (+2)', unit: 'Grade', referenceRange: 'Negative' },
    { id: 'p2', parameter: 'Platelet Count', result: '140', unit: '10^3/µL', referenceRange: '150 - 450' },
  ],
  'Urinalysis': [
    { id: 'p1', parameter: 'Color / Appearance', result: 'Pale Yellow / Clear', unit: '-', referenceRange: 'Yellow / Clear' },
    { id: 'p2', parameter: 'Protein', result: 'Negative', unit: 'mg/dL', referenceRange: 'Negative' },
    { id: 'p3', parameter: 'Glucose', result: 'Negative', unit: 'mg/dL', referenceRange: 'Negative' },
    { id: 'p4', parameter: 'WBC Esterase', result: 'Trace', unit: 'HPF', referenceRange: 'Negative' },
  ],
  'Lipid Profile': [
    { id: 'p1', parameter: 'Total Cholesterol', result: '210', unit: 'mg/dL', referenceRange: '< 200' },
    { id: 'p2', parameter: 'Triglycerides', result: '145', unit: 'mg/dL', referenceRange: '< 150' },
    { id: 'p3', parameter: 'HDL (Good)', result: '52', unit: 'mg/dL', referenceRange: '> 40' },
    { id: 'p4', parameter: 'LDL (Bad)', result: '129', unit: 'mg/dL', referenceRange: '< 100' },
  ],
  'Widal Test': [
    { id: 'p1', parameter: 'S. Typhi O Antigen', result: '1:160 Positive', unit: 'Titer', referenceRange: '< 1:80' },
    { id: 'p2', parameter: 'S. Typhi H Antigen', result: '1:160 Positive', unit: 'Titer', referenceRange: '< 1:80' },
  ],
};

const initialRequests: LabRequest[] = [
  {
    id: 'REQ-00032',
    patientId: 'PAT-0001',
    patientName: 'John Mwangi',
    testCategory: 'Hematology',
    testName: 'Complete Blood Count',
    doctorName: 'Dr. Peter',
    priority: 'Normal',
    requestTime: '08:30 AM',
    status: 'Pending',
    notes: 'Routine blood checkup prior to minor procedure.',
    parameters: defaultParametersMap['Complete Blood Count'],
  },
  {
    id: 'REQ-00031',
    patientId: 'PAT-0002',
    patientName: 'Mary Wanjiku',
    testCategory: 'Parasitology',
    testName: 'Malaria Test',
    doctorName: 'Dr. Peter',
    priority: 'High',
    requestTime: '08:15 AM',
    status: 'Pending',
    notes: 'High fever and chills for 3 days.',
    parameters: defaultParametersMap['Malaria Test'],
  },
  {
    id: 'REQ-00030',
    patientId: 'PAT-0003',
    patientName: 'James Kibera',
    testCategory: 'Biochemistry',
    testName: 'Urinalysis',
    doctorName: 'Dr. Grace',
    priority: 'Normal',
    requestTime: '07:45 AM',
    status: 'In Progress',
    notes: 'Mild dysuria.',
    parameters: defaultParametersMap['Urinalysis'],
  },
  {
    id: 'REQ-00029',
    patientId: 'PAT-0004',
    patientName: 'Grace Njeri',
    testCategory: 'Biochemistry',
    testName: 'Lipid Profile',
    doctorName: 'Dr. Peter',
    priority: 'Normal',
    requestTime: '07:30 AM',
    status: 'Pending',
    notes: 'Fasting profile evaluation.',
    parameters: defaultParametersMap['Lipid Profile'],
  },
  {
    id: 'REQ-00028',
    patientId: 'PAT-0005',
    patientName: 'Samuel Otieno',
    testCategory: 'Serology',
    testName: 'Widal Test',
    doctorName: 'Dr. Grace',
    priority: 'High',
    requestTime: '07:10 AM',
    status: 'Completed',
    remarks: 'Titer positive for Salmonella Typhi.',
    parameters: defaultParametersMap['Widal Test'],
  },
];

const initialAppointments: Appointment[] = [
  { id: '1', time: '09:00 AM', patientName: 'Peter Kimani', type: 'General Checkup', doctor: 'Dr. Peter' },
  { id: '2', time: '10:00 AM', patientName: 'Linda Achieng', type: 'Consultation', doctor: 'Dr. Grace' },
  { id: '3', time: '11:00 AM', patientName: 'Brian Oduor', type: 'Review Results', doctor: 'Dr. Peter' },
  { id: '4', time: '01:00 PM', patientName: 'Catherine Moraa', type: 'Consultation', doctor: 'Dr. Grace' },
  { id: '5', time: '02:00 PM', patientName: 'David Kiarie', type: 'General Checkup', doctor: 'Dr. Peter' },
];

const initialDiagnoses: DiagnosisRecord[] = [
  { id: 'd1', patientId: 'PAT-0001', patientName: 'John Mwangi', condition: 'Typhoid Fever', treatment: 'Ciprofloxacin 500mg BD x 7 days', date: '2026-08-09', doctor: 'Dr. Peter Odhiambo' },
  { id: 'd2', patientId: 'PAT-0002', patientName: 'Mary Wanjiku', condition: 'Malaria', treatment: 'Artemether/Lumefantrine BD x 3 days', date: '2026-08-09', doctor: 'Dr. Peter Odhiambo' },
  { id: 'd3', patientId: 'PAT-0003', patientName: 'James Kibera', condition: 'UTI', treatment: 'Nitrofurantoin 100mg BD x 5 days', date: '2026-08-08', doctor: 'Dr. Grace' },
  { id: 'd4', patientId: 'PAT-0004', patientName: 'Grace Njeri', condition: 'High Cholesterol', treatment: 'Atorvastatin 10mg OD', date: '2026-08-08', doctor: 'Dr. Peter Odhiambo' },
  { id: 'd5', patientId: 'PAT-0005', patientName: 'Samuel Otieno', condition: 'Typhoid Fever', treatment: 'Azithromycin 500mg OD', date: '2026-08-07', doctor: 'Dr. Grace' },
];

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('login');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('stbibiana_session_role') as UserRole | null;
      if (savedRole && ['receptionist', 'lab_tech', 'doctor'].includes(savedRole)) {
        setCurrentRoleState(savedRole);
      } else {
        setCurrentRoleState('login');
      }
    }
  }, []);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (typeof window !== 'undefined') {
      if (role === 'login') {
        localStorage.removeItem('stbibiana_session_role');
      } else {
        localStorage.setItem('stbibiana_session_role', role);
      }
    }
  };

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [requests, setRequests] = useState<LabRequest[]>(initialRequests);
  const [appointments] = useState<Appointment[]>(initialAppointments);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(initialDiagnoses);

  const [activeModal, setActiveModal] = useState<'patient_reg' | 'new_request' | 'enter_results' | null>(null);
  const [selectedRequestForResults, setSelectedRequestForResults] = useState<LabRequest | null>(null);

  // Sync initial state from Go backend if running
  useEffect(() => {
    async function loadBackendData() {
      const apiPatients = await getPatientsAPI();
      if (apiPatients && apiPatients.length > 0) setPatients(apiPatients);

      const apiRequests = await getLabRequestsAPI();
      if (apiRequests && apiRequests.length > 0) setRequests(apiRequests);

      const apiDiagnoses = await getDiagnosesAPI();
      if (apiDiagnoses && apiDiagnoses.length > 0) setDiagnoses(apiDiagnoses);
    }
    loadBackendData();
  }, []);

  const userProfiles: Record<UserRole, { name: string; title: string }> = {
    login: { name: 'Guest User', title: 'Sign In Required' },
    receptionist: { name: 'Jane Receptionist', title: 'Receptionist' },
    lab_tech: { name: 'Peter Labman', title: 'Lab Technician' },
    doctor: { name: 'Dr. Peter Odhiambo', title: 'Doctor' },
  };

  const openModal = (modal: 'patient_reg' | 'new_request' | 'enter_results', request?: LabRequest) => {
    if (request) {
      setSelectedRequestForResults(request);
    } else if (modal === 'enter_results' && requests.length > 0) {
      setSelectedRequestForResults(requests[0]);
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRequestForResults(null);
  };

  // Step 1: Receptionist registers patient & assigns to Doctor
  const addPatient = async (patientData: Omit<Patient, 'id' | 'registeredDate'> & { assignedDoctor?: string; status?: string }) => {
    const newId = `PAT-${String(patients.length + 1).padStart(4, '0')}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      assignedDoctor: patientData.assignedDoctor || 'Dr. Peter Odhiambo',
      status: 'Waiting for Consultation',
      registeredDate: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPatient, ...prev]);
    closeModal();

    // Call Go Backend API
    registerPatientAPI(newPatient);
  };

  // Step 2: Doctor/Receptionist orders Lab Request
  const addLabRequest = async (reqData: {
    patientId: string;
    patientName: string;
    doctorName: string;
    testCategory: string;
    testName: string;
    priority: PriorityLevel;
    notes?: string;
  }) => {
    const nextNum = requests.length + 28 + 1;
    const newReqId = `REQ-${String(nextNum).padStart(5, '0')}`;
    const defaultParams = defaultParametersMap[reqData.testName] || [
      { id: 'p1', parameter: 'Test Result', result: 'Pending', unit: '-', referenceRange: 'Normal' },
    ];

    const newReq: LabRequest = {
      id: newReqId,
      patientId: reqData.patientId,
      patientName: reqData.patientName,
      doctorName: reqData.doctorName,
      testCategory: reqData.testCategory,
      testName: reqData.testName,
      priority: reqData.priority,
      requestTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      notes: reqData.notes,
      parameters: defaultParams,
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // Update patient status in UI queue
    setPatients((prev) =>
      prev.map((p) => (p.id === reqData.patientId ? { ...p, status: 'Lab Ordered' } : p))
    );

    closeModal();

    // Call Go Backend API
    createLabRequestAPI(reqData);
  };

  // Step 3: Lab Tech submits parameters & results, sending info back to Doctor
  const saveTestResults = async (requestId: string, updatedParams: TestParameter[], remarks: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          // Update patient status so Doctor gets notified results are ready
          setPatients((pPrev) =>
            pPrev.map((p) => (p.id === req.patientId ? { ...p, status: 'Results Ready' } : p))
          );

          return {
            ...req,
            parameters: updatedParams,
            remarks,
            status: 'Completed',
            updatedAt: new Date().toISOString(),
          };
        }
        return req;
      })
    );

    closeModal();

    // Call Go Backend API
    saveTestResultsAPI(requestId, updatedParams, remarks);
  };

  // Step 4: Doctor records final diagnosis and completes patient sickness record
  const addDiagnosis = async (diagData: {
    patientId?: string;
    patientName: string;
    condition: string;
    treatment?: string;
    doctor: string;
  }) => {
    const newDiag: DiagnosisRecord = {
      id: `d${diagnoses.length + 1}`,
      patientId: diagData.patientId,
      patientName: diagData.patientName,
      condition: diagData.condition,
      treatment: diagData.treatment,
      date: new Date().toISOString().split('T')[0],
      doctor: diagData.doctor,
    };

    setDiagnoses((prev) => [newDiag, ...prev]);

    // Update patient status to Diagnosed & Completed
    if (diagData.patientId) {
      setPatients((prev) =>
        prev.map((p) => (p.id === diagData.patientId ? { ...p, status: 'Diagnosed & Completed' } : p))
      );
    }

    // Call Go Backend API
    createDiagnosisAPI(diagData);
  };

  const stats = {
    receptionist: {
      todayPatients: 32 + (patients.length - initialPatients.length),
      labRequests: requests.length,
      pendingPayments: 5,
      appointments: appointments.length,
    },
    labTech: {
      pendingTests: requests.filter((r) => r.status === 'Pending').length,
      inProgress: requests.filter((r) => r.status === 'In Progress').length,
      completedToday: requests.filter((r) => r.status === 'Completed').length,
      samplesCollected: 4,
    },
    doctor: {
      todayPatients: 22,
      resultsToReview: requests.filter((r) => r.status === 'Completed').length,
      diagnosesToday: diagnoses.length,
      followUps: 5,
    },
  };

  return (
    <AppStateContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        userProfiles,
        patients,
        requests,
        appointments,
        diagnoses,
        activeModal,
        selectedRequestForResults,
        openModal,
        closeModal,
        addPatient,
        addLabRequest,
        saveTestResults,
        addDiagnosis,
        stats,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
