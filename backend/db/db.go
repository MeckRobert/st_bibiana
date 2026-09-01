package db

import (
	"fmt"
	"sync"
	"time"

	"labpro-backend/models"
)

type Store struct {
	mu           sync.RWMutex
	patients     []models.Patient
	requests     []models.LabRequest
	appointments []models.Appointment
	diagnoses    []models.DiagnosisRecord
	reqCounter   int
	patCounter   int
	diagCounter  int
}

var defaultParams = map[string][]models.TestParameter{
	"Complete Blood Count": {
		{ID: "p1", Parameter: "WBC", Result: "5.6", Unit: "10^3/µL", ReferenceRange: "4.0 - 11.0"},
		{ID: "p2", Parameter: "RBC", Result: "4.8", Unit: "10^6/µL", ReferenceRange: "4.5 - 6.0"},
		{ID: "p3", Parameter: "Hemoglobin", Result: "13.5", Unit: "g/dL", ReferenceRange: "13.0 - 17.0"},
		{ID: "p4", Parameter: "Platelets", Result: "250", Unit: "10^3/µL", ReferenceRange: "150 - 450"},
	},
	"Malaria Test": {
		{ID: "p1", Parameter: "P. falciparum Parasites", Result: "Positive (+2)", Unit: "Grade", ReferenceRange: "Negative"},
		{ID: "p2", Parameter: "Platelet Count", Result: "140", Unit: "10^3/µL", ReferenceRange: "150 - 450"},
	},
	"Urinalysis": {
		{ID: "p1", Parameter: "Color / Appearance", Result: "Pale Yellow / Clear", Unit: "-", ReferenceRange: "Yellow / Clear"},
		{ID: "p2", Parameter: "Protein", Result: "Negative", Unit: "mg/dL", ReferenceRange: "Negative"},
		{ID: "p3", Parameter: "Glucose", Result: "Negative", Unit: "mg/dL", ReferenceRange: "Negative"},
		{ID: "p4", Parameter: "WBC Esterase", Result: "Trace", Unit: "HPF", ReferenceRange: "Negative"},
	},
	"Lipid Profile": {
		{ID: "p1", Parameter: "Total Cholesterol", Result: "210", Unit: "mg/dL", ReferenceRange: "< 200"},
		{ID: "p2", Parameter: "Triglycerides", Result: "145", Unit: "mg/dL", ReferenceRange: "< 150"},
		{ID: "p3", Parameter: "HDL (Good)", Result: "52", Unit: "mg/dL", ReferenceRange: "> 40"},
		{ID: "p4", Parameter: "LDL (Bad)", Result: "129", Unit: "mg/dL", ReferenceRange: "< 100"},
	},
	"Widal Test": {
		{ID: "p1", Parameter: "S. Typhi O Antigen", Result: "1:160 Positive", Unit: "Titer", ReferenceRange: "< 1:80"},
		{ID: "p2", Parameter: "S. Typhi H Antigen", Result: "1:160 Positive", Unit: "Titer", ReferenceRange: "< 1:80"},
	},
}

func NewStore() *Store {
	s := &Store{
		patCounter:  5,
		reqCounter:  32,
		diagCounter: 5,
	}
	s.seedData()
	return s
}

func (s *Store) seedData() {
	s.patients = []models.Patient{
		{ID: "PAT-0001", FullName: "John Mwangi", Gender: "Male", DateOfBirth: "1988-04-12", Phone: "+254 712 345678", Email: "john.mwangi@example.com", AssignedDoctor: "Dr. Peter Odhiambo", Status: "Lab Ordered", RegisteredDate: "2026-08-01"},
		{ID: "PAT-0002", FullName: "Mary Wanjiku", Gender: "Female", DateOfBirth: "1992-09-24", Phone: "+254 722 987654", Email: "mary.w@example.com", AssignedDoctor: "Dr. Peter Odhiambo", Status: "Lab Ordered", RegisteredDate: "2026-08-02"},
		{ID: "PAT-0003", FullName: "James Kibera", Gender: "Male", DateOfBirth: "1980-01-15", Phone: "+254 733 112233", Email: "jkibera@example.com", AssignedDoctor: "Dr. Grace", Status: "Lab In Progress", RegisteredDate: "2026-08-05"},
		{ID: "PAT-0004", FullName: "Grace Njeri", Gender: "Female", DateOfBirth: "1995-11-30", Phone: "+254 700 445566", Email: "grace.njeri@example.com", AssignedDoctor: "Dr. Peter Odhiambo", Status: "Lab Ordered", RegisteredDate: "2026-08-07"},
		{ID: "PAT-0005", FullName: "Samuel Otieno", Gender: "Male", DateOfBirth: "1985-06-18", Phone: "+254 711 778899", Email: "sam.otieno@example.com", AssignedDoctor: "Dr. Grace", Status: "Results Ready", RegisteredDate: "2026-08-08"},
	}

	s.requests = []models.LabRequest{
		{
			ID:           "REQ-00032",
			PatientID:    "PAT-0001",
			PatientName:  "John Mwangi",
			DoctorName:   "Dr. Peter",
			TestCategory: "Hematology",
			TestName:     "Complete Blood Count",
			Priority:     models.PriorityNormal,
			RequestTime:  "08:30 AM",
			Status:       models.StatusPending,
			Notes:        "Routine blood checkup prior to minor procedure.",
			Parameters:   defaultParams["Complete Blood Count"],
		},
		{
			ID:           "REQ-00031",
			PatientID:    "PAT-0002",
			PatientName:  "Mary Wanjiku",
			DoctorName:   "Dr. Peter",
			TestCategory: "Parasitology",
			TestName:     "Malaria Test",
			Priority:     models.PriorityHigh,
			RequestTime:  "08:15 AM",
			Status:       models.StatusPending,
			Notes:        "High fever and chills for 3 days.",
			Parameters:   defaultParams["Malaria Test"],
		},
		{
			ID:           "REQ-00030",
			PatientID:    "PAT-0003",
			PatientName:  "James Kibera",
			DoctorName:   "Dr. Grace",
			TestCategory: "Biochemistry",
			TestName:     "Urinalysis",
			Priority:     models.PriorityNormal,
			RequestTime:  "07:45 AM",
			Status:       models.StatusInProgress,
			Notes:        "Mild dysuria.",
			Parameters:   defaultParams["Urinalysis"],
		},
		{
			ID:           "REQ-00029",
			PatientID:    "PAT-0004",
			PatientName:  "Grace Njeri",
			DoctorName:   "Dr. Peter",
			TestCategory: "Biochemistry",
			TestName:     "Lipid Profile",
			Priority:     models.PriorityNormal,
			RequestTime:  "07:30 AM",
			Status:       models.StatusPending,
			Notes:        "Fasting profile evaluation.",
			Parameters:   defaultParams["Lipid Profile"],
		},
		{
			ID:           "REQ-00028",
			PatientID:    "PAT-0005",
			PatientName:  "Samuel Otieno",
			DoctorName:   "Dr. Grace",
			TestCategory: "Serology",
			TestName:     "Widal Test",
			Priority:     models.PriorityHigh,
			RequestTime:  "07:10 AM",
			Status:       models.StatusCompleted,
			Remarks:      "Titer positive for Salmonella Typhi.",
			Parameters:   defaultParams["Widal Test"],
		},
	}

	s.appointments = []models.Appointment{
		{ID: "1", Time: "09:00 AM", PatientName: "Peter Kimani", Type: "General Checkup", Doctor: "Dr. Peter"},
		{ID: "2", Time: "10:00 AM", PatientName: "Linda Achieng", Type: "Consultation", Doctor: "Dr. Grace"},
		{ID: "3", Time: "11:00 AM", PatientName: "Brian Oduor", Type: "Review Results", Doctor: "Dr. Peter"},
		{ID: "4", Time: "01:00 PM", PatientName: "Catherine Moraa", Type: "Consultation", Doctor: "Dr. Grace"},
		{ID: "5", Time: "02:00 PM", PatientName: "David Kiarie", Type: "General Checkup", Doctor: "Dr. Peter"},
	}

	s.diagnoses = []models.DiagnosisRecord{
		{ID: "d1", PatientID: "PAT-0001", PatientName: "John Mwangi", Condition: "Typhoid Fever", Treatment: "Ciprofloxacin 500mg BD x 7 days", Date: "2026-08-09", Doctor: "Dr. Peter Odhiambo"},
		{ID: "d2", PatientID: "PAT-0002", PatientName: "Mary Wanjiku", Condition: "Malaria", Treatment: "Artemether/Lumefantrine BD x 3 days", Date: "2026-08-09", Doctor: "Dr. Peter Odhiambo"},
		{ID: "d3", PatientID: "PAT-0003", PatientName: "James Kibera", Condition: "UTI", Treatment: "Nitrofurantoin 100mg BD x 5 days", Date: "2026-08-08", Doctor: "Dr. Grace"},
		{ID: "d4", PatientID: "PAT-0004", PatientName: "Grace Njeri", Condition: "High Cholesterol", Treatment: "Atorvastatin 10mg OD + Low Fat Diet", Date: "2026-08-08", Doctor: "Dr. Peter Odhiambo"},
		{ID: "d5", PatientID: "PAT-0005", PatientName: "Samuel Otieno", Condition: "Typhoid Fever", Treatment: "Azithromycin 500mg OD x 5 days", Date: "2026-08-07", Doctor: "Dr. Grace"},
	}
}

// Patient Workflows
func (s *Store) GetPatients() []models.Patient {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.patients
}

func (s *Store) RegisterPatient(p models.Patient) models.Patient {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.patCounter++
	p.ID = fmt.Sprintf("PAT-%04d", s.patCounter)
	p.RegisteredDate = time.Now().Format("2006-01-02")
	if p.AssignedDoctor == "" {
		p.AssignedDoctor = "Dr. Peter Odhiambo"
	}
	p.Status = "Waiting for Consultation"
	s.patients = append([]models.Patient{p}, s.patients...)
	return p
}

// Lab Request Workflows
func (s *Store) GetLabRequests() []models.LabRequest {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.requests
}

func (s *Store) CreateLabRequest(req models.LabRequest) models.LabRequest {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.reqCounter++
	req.ID = fmt.Sprintf("REQ-%05d", s.reqCounter)
	req.RequestTime = time.Now().Format("03:04 PM")
	req.Status = models.StatusPending
	req.UpdatedAt = time.Now().Format(time.RFC3339)

	if params, ok := defaultParams[req.TestName]; ok {
		req.Parameters = params
	} else {
		req.Parameters = []models.TestParameter{
			{ID: "p1", Parameter: "Test Result", Result: "Pending", Unit: "-", ReferenceRange: "Normal"},
		}
	}

	// Update patient status in workflow
	for i := range s.patients {
		if s.patients[i].ID == req.PatientID {
			s.patients[i].Status = "Lab Ordered"
			break
		}
	}

	s.requests = append([]models.LabRequest{req}, s.requests...)
	return req
}

func (s *Store) SaveTestResults(reqID string, params []models.TestParameter, remarks string) (models.LabRequest, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()

	for i := range s.requests {
		if s.requests[i].ID == reqID {
			s.requests[i].Parameters = params
			s.requests[i].Remarks = remarks
			s.requests[i].Status = models.StatusCompleted
			s.requests[i].UpdatedAt = time.Now().Format(time.RFC3339)

			// Update patient status so assigned doctor gets notified results are ready
			for pIdx := range s.patients {
				if s.patients[pIdx].ID == s.requests[i].PatientID {
					s.patients[pIdx].Status = "Results Ready"
					break
				}
			}

			return s.requests[i], true
		}
	}
	return models.LabRequest{}, false
}

// Diagnosis Workflows
func (s *Store) GetDiagnoses() []models.DiagnosisRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.diagnoses
}

func (s *Store) CreateDiagnosis(d models.DiagnosisRecord) models.DiagnosisRecord {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.diagCounter++
	d.ID = fmt.Sprintf("d%d", s.diagCounter)
	d.Date = time.Now().Format("2006-01-02")
	if d.Doctor == "" {
		d.Doctor = "Dr. Peter Odhiambo"
	}

	// Complete patient workflow
	for i := range s.patients {
		if s.patients[i].ID == d.PatientID || s.patients[i].FullName == d.PatientName {
			s.patients[i].Status = "Diagnosed & Completed"
			break
		}
	}

	s.diagnoses = append([]models.DiagnosisRecord{d}, s.diagnoses...)
	return d
}

func (s *Store) GetAppointments() []models.Appointment {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.appointments
}

func (s *Store) GetStats() models.Stats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var st models.Stats

	// Receptionist stats
	st.Receptionist.TodayPatients = len(s.patients) + 27
	st.Receptionist.LabRequests = len(s.requests)
	st.Receptionist.PendingPayments = 5
	st.Receptionist.Appointments = len(s.appointments)

	// Lab Tech stats
	pendingCount := 0
	inProgressCount := 0
	completedCount := 0
	for _, r := range s.requests {
		switch r.Status {
		case models.StatusPending:
			pendingCount++
		case models.StatusInProgress:
			inProgressCount++
		case models.StatusCompleted:
			completedCount++
		}
	}
	st.LabTech.PendingTests = pendingCount
	st.LabTech.InProgress = inProgressCount
	st.LabTech.CompletedToday = completedCount + 25
	st.LabTech.SamplesCollected = 4

	// Doctor stats
	st.Doctor.TodayPatients = len(s.patients) + 17
	st.Doctor.ResultsToReview = completedCount
	st.Doctor.DiagnosesToday = len(s.diagnoses) + 3
	st.Doctor.FollowUps = 5

	return st
}
