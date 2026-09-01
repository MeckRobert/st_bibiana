'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/lib/store';
import { X, FileSpreadsheet } from 'lucide-react';
import { TestParameter } from '@/lib/types';

export default function EnterTestResultsModal() {
  const { selectedRequestForResults, closeModal, saveTestResults, requests } = useAppState();

  const activeReq = selectedRequestForResults || requests[0];

  const [parameters, setParameters] = useState<TestParameter[]>([]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (activeReq) {
      setParameters(activeReq.parameters || []);
      setRemarks(activeReq.remarks || '');
    }
  }, [activeReq]);

  if (!activeReq) return null;

  const handleResultChange = (paramId: string, val: string) => {
    setParameters((prev) =>
      prev.map((p) => (p.id === paramId ? { ...p, result: val } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTestResults(activeReq.id, parameters, remarks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              LAB TECHNICIAN
            </div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Enter Test Results
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Dashboard / Test Results / <span className="font-semibold text-slate-700">Enter Results</span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-medium">
          {/* Summary Banner */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Patient</div>
              <div className="text-xs font-bold text-slate-800">
                {activeReq.patientName}{' '}
                <span className="text-slate-500 font-normal">({activeReq.patientId})</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">Test</div>
              <div className="text-xs font-bold text-slate-800">{activeReq.testName}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-medium">Request ID</div>
              <div className="text-xs font-mono font-bold text-blue-600">{activeReq.id}</div>
            </div>
          </div>

          {/* Test Parameters Table */}
          <div>
            <div className="text-xs font-bold text-slate-800 mb-2">Test Parameters</div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Reference Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {param.parameter}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          required
                          value={param.result}
                          onChange={(e) => handleResultChange(param.id, e.target.value)}
                          className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        />
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{param.unit}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {param.referenceRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Remarks</label>
            <textarea
              rows={2}
              placeholder="Enter remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition"
            >
              Save Results
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
