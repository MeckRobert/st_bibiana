'use client';

import React, { useState } from 'react';
import { useAppState } from '@/lib/store';
import { X, FilePlus2 } from 'lucide-react';
import { PriorityLevel } from '@/lib/types';

export default function NewLabRequestModal() {
  const { patients, closeModal, addLabRequest } = useAppState();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [doctorName, setDoctorName] = useState('Dr. Peter');
  const [testCategory, setTestCategory] = useState('Hematology');
  const [testName, setTestName] = useState('Complete Blood Count');
  const [priority, setPriority] = useState<PriorityLevel>('Normal');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId) || patients[0];
    if (!patientObj) return;

    addLabRequest({
      patientId: patientObj.id,
      patientName: patientObj.fullName,
      doctorName,
      testCategory,
      testName,
      priority,
      notes,
    });
  };

  const testsByCategory: Record<string, string[]> = {
    Hematology: ['Complete Blood Count', 'Hemoglobin Level', 'Platelet Count'],
    Parasitology: ['Malaria Test', 'Stool Analysis'],
    Biochemistry: ['Urinalysis', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test'],
    Serology: ['Widal Test', 'Rheumatoid Factor', 'HBsAg Test'],
  };

  const handleCategoryChange = (cat: string) => {
    setTestCategory(cat);
    const availableTests = testsByCategory[cat] || ['Complete Blood Count'];
    setTestName(availableTests[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              RECEPTIONIST / DOCTOR
            </div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FilePlus2 className="w-5 h-5 text-blue-600" />
              New Lab Request
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Dashboard / <span className="font-semibold text-slate-700">New Request</span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium">
          {/* Row 1: Patient & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Patient <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-800"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Doctor <span className="text-rose-500">*</span>
              </label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-800"
              >
                <option value="Dr. Peter">Dr. Peter</option>
                <option value="Dr. Grace">Dr. Grace</option>
                <option value="Dr. Sarah">Dr. Sarah</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category & Test */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Test Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={testCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-800"
              >
                <option value="Hematology">Hematology</option>
                <option value="Parasitology">Parasitology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Serology">Serology</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Test <span className="text-rose-500">*</span>
              </label>
              <select
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-800"
              >
                {(testsByCategory[testCategory] || []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Priority & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-slate-800"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Notes</label>
              <input
                type="text"
                placeholder="Enter notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
