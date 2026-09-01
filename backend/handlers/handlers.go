package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"labpro-backend/db"
	"labpro-backend/models"
)

type Server struct {
	store *db.Store
}

func NewServer(store *db.Store) *Server {
	return &Server{store: store}
}

// Enable CORS for frontend requests
func enableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

func (s *Server) HandlePatients(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		patients := s.store.GetPatients()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(patients)

	case http.MethodPost:
		var p models.Patient
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, "Invalid patient payload", http.StatusBadRequest)
			return
		}
		created := s.store.RegisterPatient(p)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(created)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) HandleLabRequests(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	path := r.URL.Path
	// Handle POST /api/lab-requests/results
	if r.Method == http.MethodPost && strings.HasSuffix(path, "/results") {
		var body struct {
			RequestID  string                 `json:"requestId"`
			Parameters []models.TestParameter `json:"parameters"`
			Remarks    string                 `json:"remarks"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid test results payload", http.StatusBadRequest)
			return
		}
		updated, ok := s.store.SaveTestResults(body.RequestID, body.Parameters, body.Remarks)
		if !ok {
			http.Error(w, "Lab request not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(updated)
		return
	}

	switch r.Method {
	case http.MethodGet:
		requests := s.store.GetLabRequests()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(requests)

	case http.MethodPost:
		var req models.LabRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid lab request payload", http.StatusBadRequest)
			return
		}
		created := s.store.CreateLabRequest(req)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(created)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) HandleDiagnoses(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	switch r.Method {
	case http.MethodGet:
		diagnoses := s.store.GetDiagnoses()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(diagnoses)

	case http.MethodPost:
		var d models.DiagnosisRecord
		if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
			http.Error(w, "Invalid diagnosis payload", http.StatusBadRequest)
			return
		}
		created := s.store.CreateDiagnosis(d)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(created)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) HandleAppointments(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if r.Method == http.MethodGet {
		appointments := s.store.GetAppointments()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(appointments)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (s *Server) HandleStats(w http.ResponseWriter, r *http.Request) {
	if enableCORS(w, r) {
		return
	}

	if r.Method == http.MethodGet {
		stats := s.store.GetStats()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
		return
	}
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
