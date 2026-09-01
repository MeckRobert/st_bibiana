'use client';

import React from 'react';
import { useAppState } from '@/lib/store';
import { Clock, TestTube2, CheckCircle2, Package, ChevronRight, Edit3 } from 'lucide-react';
import { LabRequest } from '@/lib/types';

export default function LabTechDashboard() {
  const { stats, requests, openModal } = useAppState();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-100 text-rose-700">
            High
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
            Normal
          </span>
        );
    }
  };

  const pendingRequests = requests.filter((r) => r.status !== 'Completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, Peter!</p>
        </div>
        <div>
          <button
            onClick={() => openModal('enter_results')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Enter Test Results</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Tests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.labTech.pendingTests}
            </div>
            <div className="text-xs font-medium text-slate-500">Pending Tests</div>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <TestTube2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.labTech.inProgress}
            </div>
            <div className="text-xs font-medium text-slate-500">In Progress</div>
          </div>
        </div>

        {/* Card 3: Completed Today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.labTech.completedToday}
            </div>
            <div className="text-xs font-medium text-slate-500">Completed Today</div>
          </div>
        </div>

        {/* Card 4: Samples Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.labTech.samplesCollected}
            </div>
            <div className="text-xs font-medium text-slate-500">Samples Collected</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Tests Table & Donut Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tests Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Pending Tests</h2>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Patient</th>
                  <th className="py-3 px-2">Test</th>
                  <th className="py-3 px-2">Priority</th>
                  <th className="py-3 px-2">Request Time</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {pendingRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-2 font-mono font-medium text-slate-500">{req.id}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800">{req.patientName}</td>
                    <td className="py-3 px-2 text-slate-600">{req.testName}</td>
                    <td className="py-3 px-2">{getPriorityBadge(req.priority)}</td>
                    <td className="py-3 px-2 font-mono text-slate-500">{req.requestTime}</td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => openModal('enter_results', req)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition"
                      >
                        Enter Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Samples Collection Visualizer Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 pb-4 mb-4 border-b border-slate-100">
              Samples Collection
            </h2>

            {/* Donut Graphic */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-slate-100 stroke-current"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 1: Collected (Green) */}
                <path
                  className="text-emerald-500 stroke-current"
                  strokeDasharray="33, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 2: Pending (Amber) */}
                <path
                  className="text-amber-500 stroke-current"
                  strokeDasharray="50, 100"
                  strokeDashoffset="-33"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Segment 3: Not Collected (Rose) */}
                <path
                  className="text-rose-400 stroke-current"
                  strokeDasharray="17, 100"
                  strokeDashoffset="-83"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-800">4</span>
                <span className="text-[11px] font-medium text-slate-400">Today</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 text-xs font-semibold pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-600">Collected</span>
                </div>
                <span className="text-slate-800 font-bold">4</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="text-slate-600">Pending</span>
                </div>
                <span className="text-slate-800 font-bold">6</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="text-slate-600">Not Collected</span>
                </div>
                <span className="text-slate-800 font-bold">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
