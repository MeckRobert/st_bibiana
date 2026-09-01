'use client';

import React, { useState } from 'react';
import { AppStateProvider, useAppState } from '@/lib/store';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import LoginScreen from '@/components/auth/LoginScreen';

import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';
import LabTechDashboard from '@/components/dashboards/LabTechDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';

import PatientRegistrationModal from '@/components/modals/PatientRegistrationModal';
import NewLabRequestModal from '@/components/modals/NewLabRequestModal';
import EnterTestResultsModal from '@/components/modals/EnterTestResultsModal';

function MainApp() {
  const { currentRole, activeModal } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (currentRole === 'login') {
    return <LoginScreen />;
  }

  const renderDashboard = () => {
    switch (currentRole) {
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'lab_tech':
        return <LabTechDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      default:
        return <ReceptionistDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Body: Sidebar + Main Content View */}
      <div className="flex flex-1 relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} />

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 lg:hidden"
          />
        )}

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderDashboard()}
        </main>
      </div>

      {/* Global Modals Overlay */}
      {activeModal === 'patient_reg' && <PatientRegistrationModal />}
      {activeModal === 'new_request' && <NewLabRequestModal />}
      {activeModal === 'enter_results' && <EnterTestResultsModal />}
    </div>
  );
}

export default function Home() {
  return (
    <AppStateProvider>
      <MainApp />
    </AppStateProvider>
  );
}
