package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"labpro-backend/db"
	"labpro-backend/handlers"
)

func TestHealthAndEndpoints(t *testing.T) {
	store := db.NewStore()
	server := handlers.NewServer(store)

	// Test GET /api/patients
	req := httptest.NewRequest("GET", "/api/patients", nil)
	w := httptest.NewRecorder()
	server.HandlePatients(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", w.Code)
	}

	// Test GET /api/lab-requests
	req = httptest.NewRequest("GET", "/api/lab-requests", nil)
	w = httptest.NewRecorder()
	server.HandleLabRequests(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK for lab requests, got %d", w.Code)
	}

	// Test GET /api/stats
	req = httptest.NewRequest("GET", "/api/stats", nil)
	w = httptest.NewRecorder()
	server.HandleStats(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK for stats, got %d", w.Code)
	}
}
