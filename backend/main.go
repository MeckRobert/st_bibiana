package main

import (
	"log"
	"net/http"

	"labpro-backend/db"
	"labpro-backend/handlers"
)

func main() {
	store := db.NewStore()
	server := handlers.NewServer(store)

	mux := http.NewServeMux()

	mux.HandleFunc("/api/patients", server.HandlePatients)
	mux.HandleFunc("/api/lab-requests", server.HandleLabRequests)
	mux.HandleFunc("/api/lab-requests/results", server.HandleLabRequests)
	mux.HandleFunc("/api/diagnoses", server.HandleDiagnoses)
	mux.HandleFunc("/api/appointments", server.HandleAppointments)
	mux.HandleFunc("/api/stats", server.HandleStats)

	// Health check endpoint
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","message":"ST BIBIANA DIAGNOSTIC CENTRE Go Backend API is running"}`))
	})

	port := ":8080"
	log.Printf("🧪 ST BIBIANA DIAGNOSTIC CENTRE Go Backend Server running on http://localhost%s\n", port)
	log.Printf("📋 Health check endpoint: http://localhost%s/api/health\n", port)

	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Failed to start Go backend server: %v", err)
	}
}
