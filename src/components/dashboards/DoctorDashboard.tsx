'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store';
import { Users, FileCheck2, Stethoscope, Calendar, ChevronRight, Plus, TestTube2, CheckCircle2, Activity } from 'lucide-react';
import { LabRequest } from '@/lib/types';

export default function DoctorDashboard() {
  const { stats, requests, patients, diagnoses, openModal, addDiagnosis } = useAppState();

  const [selectedPatientForDiag, setSelectedPatientForDiag] = useState<string | null>(null);
  const [condition, setCondition] = useState('');
  const [treatment, setTreatment] = useState('');

  // Assigned Patients for Dr. Peter / active doctor
  const doctorPatients = patients.filter((p) => p.assignedDoctor?.includes('Peter') || !p.assignedDoctor);
  // Lab Results ready for review (Completed lab requests)
  const completedResults = requests.filter((r) => r.status === 'Completed');
  // Pending lab requests ordered by Doctor
  const pendingLabRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'In Progress');

  const handleCompleteDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition) return;

    const patientObj = patients.find((p) => p.id === selectedPatientForDiag) || patients[0];
    addDiagnosis({
      patientId: patientObj?.id,
      patientName: patientObj?.fullName || 'John Mwangi',
      condition,
      treatment,
      doctor: 'Dr. Peter Odhiambo',
    });

    setSelectedPatientForDiag(null);
    setCondition('');
    setTreatment('');
  };

  return (
    <div className="space-y-6">
      {/* Doctor Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Clinical Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, Dr. Peter Odhiambo!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('new_request')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Order Lab Test</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {doctorPatients.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Assigned Patients</div>
          </div>
        </div>

        {/* Card 2: Results to Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {completedResults.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Completed Lab Results</div>
          </div>
        </div>

        {/* Card 3: Diagnoses Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {diagnoses.length}
            </div>
            <div className="text-xs font-medium text-slate-500">Diagnoses Recorded</div>
          </div>
        </div>

        {/* Card 4: Follow Ups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.doctor.followUps}
            </div>
            <div className="text-xs font-medium text-slate-500">Follow Ups</div>
          </div>
        </div>
      </div>

      {/* Workflow Step 1: Assigned Patients Queue (From Receptionist Registration) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              1. Assigned Patients Queue (From Receptionist)
            </h2>
            <p className="text-xs text-slate-500">
              Patients registered and assigned to you for consultation and lab testing
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-2">Patient ID</th>
                <th className="py-2.5 px-2">Patient Name</th>
                <th className="py-2.5 px-2">Gender / DOB</th>
                <th className="py-2.5 px-2">Workflow Status</th>
                <th className="py-2.5 px-2 text-right">Doctor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {doctorPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-2 font-mono font-bold text-blue-600">{p.id}</td>
                  <td className="py-3 px-2 font-bold text-slate-800">{p.fullName}</td>
                  <td className="py-3 px-2 text-slate-600">
                    {p.gender} • {p.dateOfBirth}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        p.status === 'Results Ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Lab Ordered'
                          ? 'bg-blue-100 text-blue-800'
                          : p.status === 'Diagnosed & Completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status || 'Waiting for Consultation'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => openModal('new_request')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg shadow-xs transition"
                    >
                      + Order Lab Test
                    </button>
                    <button
                      onClick={() => setSelectedPatientForDiag(p.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg shadow-xs transition"
                    >
                      Record Final Diagnosis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Returned Lab Results (Left 2/3) & Recent Diagnoses (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Returned Completed Lab Results */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TestTube2 className="w-5 h-5 text-emerald-600" />
                2. Returned Lab Test Results (From Lab Tech)
              </h2>
              <p className="text-xs text-slate-500">
                Completed lab tests with entered parameter values returned to Doctor
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {completedResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No completed lab test results returned yet.
              </div>
            ) : (
              completedResults.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600">{req.id}</span>
                      <span className="text-sm font-bold text-slate-800 ml-2.5">
                        {req.patientName}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Results Complete
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-semibold">
                    Test: <span className="text-slate-900">{req.testName}</span> ({req.testCategory})
                  </div>

                  {/* Parameter Values Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                          <th className="py-2 px-2.5">Parameter</th>
                          <th className="py-2 px-2.5">Lab Result</th>
                          <th className="py-2 px-2.5">Unit</th>
                          <th className="py-2 px-2.5">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {req.parameters.map((param) => (
                          <tr key={param.id}>
                            <td className="py-1.5 px-2.5 font-bold text-slate-800">
                              {param.parameter}
                            </td>
                            <td className="py-1.5 px-2.5 font-bold text-blue-700">{param.result}</td>
                            <td className="py-1.5 px-2.5 font-mono text-slate-500">{param.unit}</td>
                            <td className="py-1.5 px-2.5 font-mono text-slate-500">
                              {param.referenceRange}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {req.remarks && (
                    <div className="text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                      <span className="font-bold">Lab Tech Remarks: </span>
                      {req.remarks}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setSelectedPatientForDiag(req.patientId)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Issue Final Diagnosis</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Diagnoses List & Record Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">3. Sickness & Diagnoses Log</h2>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {diagnoses.map((diag) => (
                <div
                  key={diag.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">{diag.patientName}</div>
                    <span className="text-[10px] font-mono text-slate-400">{diag.date}</span>
                  </div>
                  <div className="text-xs font-bold text-rose-600">{diag.condition}</div>
                  {diag.treatment && (
                    <div className="text-[11px] text-slate-600">
                      Rx: <span className="font-medium">{diag.treatment}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 font-medium pt-0.5">{diag.doctor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Final Diagnosis Modal Inline Overlay */}
      {selectedPatientForDiag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              Record Final Diagnosis & Sickness Data
            </h3>

            <form onSubmit={handleCompleteDiagnosis} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                  {patients.find((p) => p.id === selectedPatientForDiag)?.fullName || 'Patient'}{' '}
                  ({selectedPatientForDiag})
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Diagnosed Condition / Sickness <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Typhoid Fever, Malaria, UTI"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Prescription / Treatment Plan
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ciprofloxacin 500mg BD x 7 days, hydration"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForDiag(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20"
                >
                  Save & Complete Diagnosis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
