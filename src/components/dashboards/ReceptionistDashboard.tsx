'use client';

import React from 'react';
import { useAppState } from '@/lib/store';
import { Users, FileText, Hourglass, Calendar, Plus, ChevronRight } from 'lucide-react';

export default function ReceptionistDashboard() {
  const { stats, requests, appointments, openModal } = useAppState();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">
            Pending
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, Jane!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal('patient_reg')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => openModal('new_request')}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>New Lab Request</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.receptionist.todayPatients}
            </div>
            <div className="text-xs font-medium text-slate-500">Today's Patients</div>
          </div>
        </div>

        {/* Card 2: Lab Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.receptionist.labRequests}
            </div>
            <div className="text-xs font-medium text-slate-500">Lab Requests</div>
          </div>
        </div>

        {/* Card 3: Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Hourglass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.receptionist.pendingPayments}
            </div>
            <div className="text-xs font-medium text-slate-500">Pending Payments</div>
          </div>
        </div>

        {/* Card 4: Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800">
              {stats.receptionist.appointments}
            </div>
            <div className="text-xs font-medium text-slate-500">Appointments</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Requests Table (Left 2/3) & Appointments (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Lab Requests Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Today's Lab Requests</h2>
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
                  <th className="py-3 px-2">Doctor</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-2 font-mono font-medium text-slate-500">{req.id}</td>
                    <td className="py-3 px-2 font-semibold text-slate-800">{req.patientName}</td>
                    <td className="py-3 px-2 text-slate-600">{req.testName}</td>
                    <td className="py-3 px-2 text-slate-600">{req.doctorName}</td>
                    <td className="py-3 px-2 text-right">{getStatusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointments Agenda Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Appointments</h2>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg font-mono">
                      {apt.time}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400">{apt.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
