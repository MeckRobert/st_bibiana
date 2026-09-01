package models

type PriorityLevel string
type RequestStatus string

const (
	PriorityNormal PriorityLevel = "Normal"
	PriorityHigh   PriorityLevel = "High"
	PriorityUrgent PriorityLevel = "Urgent"

	StatusPending    RequestStatus = "Pending"
	StatusInProgress RequestStatus = "In Progress"
	StatusCompleted  RequestStatus = "Completed"
)

type Patient struct {
	ID             string `json:"id"`
	FullName       string `json:"fullName"`
	Gender         string `json:"gender"`
	DateOfBirth    string `json:"dateOfBirth"`
	Phone          string `json:"phone"`
	Email          string `json:"email"`
	AssignedDoctor string `json:"assignedDoctor"`
	Status         string `json:"status"` // "Waiting for Consultation", "Lab Ordered", "Results Ready", "Completed"
	RegisteredDate string `json:"registeredDate"`
}

type TestParameter struct {
	ID             string `json:"id"`
	Parameter      string `json:"parameter"`
	Result         string `json:"result"`
	Unit           string `json:"unit"`
	ReferenceRange string `json:"referenceRange"`
}

type LabRequest struct {
	ID           string          `json:"id"`
	PatientID    string          `json:"patientId"`
	PatientName  string          `json:"patientName"`
	DoctorName   string          `json:"doctorName"`
	TestCategory string          `json:"testCategory"`
	TestName     string          `json:"testName"`
	Priority     PriorityLevel   `json:"priority"`
	RequestTime  string          `json:"requestTime"`
	Status       RequestStatus   `json:"status"`
	Notes        string          `json:"notes,omitempty"`
	Remarks      string          `json:"remarks,omitempty"`
	Parameters   []TestParameter `json:"parameters"`
	UpdatedAt    string          `json:"updatedAt,omitempty"`
}

type Appointment struct {
	ID          string `json:"id"`
	Time        string `json:"time"`
	PatientName string `json:"patientName"`
	Type        string `json:"type"`
	Doctor      string `json:"doctor"`
}

type DiagnosisRecord struct {
	ID          string `json:"id"`
	PatientID   string `json:"patientId,omitempty"`
	PatientName string `json:"patientName"`
	Condition   string `json:"condition"`
	Treatment   string `json:"treatment,omitempty"`
	Date        string `json:"date"`
	Doctor      string `json:"doctor"`
}

type Stats struct {
	Receptionist struct {
		TodayPatients   int `json:"todayPatients"`
		LabRequests     int `json:"labRequests"`
		PendingPayments int `json:"pendingPayments"`
		Appointments    int `json:"appointments"`
	} `json:"receptionist"`
	LabTech struct {
		PendingTests     int `json:"pendingTests"`
		InProgress       int `json:"inProgress"`
		CompletedToday   int `json:"completedToday"`
		SamplesCollected int `json:"samplesCollected"`
	} `json:"labTech"`
	Doctor struct {
		TodayPatients   int `json:"todayPatients"`
		ResultsToReview int `json:"resultsToReview"`
		DiagnosesToday  int `json:"diagnosesToday"`
		FollowUps       int `json:"followUps"`
	} `json:"doctor"`
}
