'use client';

import React from 'react';
import { useAppState } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { FlaskConical, Bell, Menu, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { currentRole, setCurrentRole, userProfiles } = useAppState();
  const activeProfile = userProfiles[currentRole];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left section: Logo and sidebar toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <span className="text-sm sm:text-base md:text-lg font-bold text-slate-800 tracking-tight">ST BIBIANA DIAGNOSTIC CENTRE</span>
        </div>
      </div>

      {/* Right section: Role Quick Switcher, Notifications & Profile */}
      <div className="flex items-center space-x-1 md:space-x-2"> 
        {/* Role Switcher Pill for instant demonstration */}
        {/* <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200"> */}
          {/* <span className="text-[11px] font-semibold uppercase text-slate-400 px-2.5"> */}
            {/* Role: */}
          {/* </span> */}
          {/* {(['receptionist', 'lab_tech', 'doctor'] as UserRole[]).map((role) => ( */}
            {/* </header><button */}
              {/* key={role} */}
              {/* onClick={() => setCurrentRole(role)} */}
              {/* className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${ */}
                {/* currentRole === role */}
                  {/* ? 'bg-blue-600 text-white shadow-xs' */}
                  {/* : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' */}
              {/* }`} */}
            {/* > */}
              {/* {role === 'receptionist' && 'Receptionist'} */}
              {/* {role === 'lab_tech' && 'Lab Tech'} */}
              {/* {role === 'doctor' && 'Doctor'} */}
            {/* </button> */}
          {/* ))} */}
        {/* </div> */}

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center overflow-hidden border border-slate-300">
            <User className="w-5 h-5 text-slate-600" />
          </div>

          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {activeProfile.name}
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              {activeProfile.title}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => setCurrentRole('login')}
            title="Sign Out to Login Screen"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
