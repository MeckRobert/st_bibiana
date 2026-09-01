'use client';

import React from 'react';
import { useAppState } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Settings,
  Clock,
  TestTube2,
  CheckCircle2,
  Stethoscope,
  FileText,
  Pill,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen }: SidebarProps) {
  const { currentRole, openModal } = useAppState();

  const getRoleHeader = () => {
    switch (currentRole) {
      case 'receptionist':
        return 'RECEPTIONIST';
      case 'lab_tech':
        return 'LAB TECHNICIAN';
      case 'doctor':
        return 'DOCTOR';
      default:
        return 'NAVIGATION';
    }
  };

  const getMenuItems = () => {
    switch (currentRole) {
      case 'receptionist':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'Patients', icon: Users, modal: 'patient_reg' as const },
          { id: 'new_request', label: 'New Request', icon: FilePlus2, modal: 'new_request' as const },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'lab_tech':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'pending_tests', label: 'Pending Tests', icon: Clock },
          { id: 'sample_collection', label: 'Sample Collection', icon: TestTube2 },
          { id: 'test_results', label: 'Test Results', icon: FileText, modal: 'enter_results' as const },
          { id: 'completed_tests', label: 'Completed Tests', icon: CheckCircle2 },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'doctor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'Patients', icon: Users },
          { id: 'lab_results', label: 'Lab Results', icon: FileText },
          { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } flex flex-col justify-between pt-16 lg:pt-0 font-sans shadow-sm`}
    >
      <div className="p-4 space-y-6">
        {/* Category Role Title */}
        <div className="text-[11px] font-bold text-slate-400 tracking-wider px-3 uppercase">
          {getRoleHeader()}
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.modal) {
                    openModal(item.modal);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Button at Sidebar Bottom */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {currentRole === 'receptionist' && (
          <button
            onClick={() => openModal('patient_reg')}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>+ Register Patient</span>
          </button>
        )}
        {currentRole === 'lab_tech' && (
          <button
            onClick={() => openModal('enter_results')}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>+ Enter Test Results</span>
          </button>
        )}
        {currentRole === 'doctor' && (
          <button
            onClick={() => openModal('new_request')}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>+ Order Lab Test</span>
          </button>
        )}
      </div>
    </aside>
  );
}
