'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppState } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { FlaskConical, Mail, Lock, Eye, EyeOff, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginScreen() {
  const { setCurrentRole } = useAppState();
  const [email, setEmail] = useState('jane.receptionist@stbibiana.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('receptionist');

  const roleDetails: Record<UserRole, { title: string; name: string; email: string; icon: string }> = {
    receptionist: {
      title: 'Receptionist',
      name: 'Jane Receptionist',
      email: 'jane.receptionist@stbibiana.com',
      icon: '📋',
    },
    lab_tech: {
      title: 'Lab Technician',
      name: 'Peter Labman',
      email: 'peter.labtech@stbibiana.com',
      icon: '🧪',
    },
    doctor: {
      title: 'Doctor',
      name: 'Dr. Peter Odhiambo',
      email: 'dr.peter@stbibiana.com',
      icon: '🩺',
    },
    login: {
      title: 'Guest',
      name: 'Guest',
      email: '',
      icon: '👤',
    },
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (roleDetails[role]?.email) {
      setEmail(roleDetails[role].email);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Create session & redirect to role dashboard
    setCurrentRole(selectedRole);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[640px]">
        {/* Left Panel: Lab Image Banner (Matching Mockup Top-Left) */}
        <div className="relative flex flex-col justify-between p-8 md:p-12 text-white bg-slate-900 overflow-hidden">
          <Image
            src="/images/lab_microscope_banner.jpg"
            alt="Laboratory Microscope"
            fill
            className="object-cover opacity-45 mix-blend-overlay scale-105 transition-transform duration-1000 hover:scale-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-blue-900/40" />

          {/* Brand Logo & Title Header */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/90 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <FlaskConical className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-extrabold tracking-tight">ST BIBIANA DIAGNOSTIC CENTRE</span>
            </div>
            <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase">
              Laboratory Management System
            </p>
          </div>

          {/* Center / Bottom Tagline */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white">
              Accurate Results, <br />
              Better Healthcare
            </h2>
            <p className="text-slate-300 text-sm max-w-xs leading-relaxed">
              Streamline laboratory workflows, accelerate diagnostic testing, and deliver precise patient outcomes effortlessly.
            </p>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-xs text-slate-400 font-light flex items-center justify-between">
            <span>© 2026 ST BIBIANA DIAGNOSTIC CENTRE. All rights reserved.</span>
            <span className="flex items-center gap-1 text-slate-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Session
            </span>
          </div>
        </div>

        {/* Right Panel: Sign-In Form & Role Selection */}
        <div className="flex flex-col justify-between p-8 md:p-12 bg-white">
          <div className="my-auto max-w-sm mx-auto w-full space-y-6">
            {/* Beaker Icon Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 text-blue-600 border border-blue-100 shadow-inner">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Please sign in to your account
              </p>
            </div>

            {/* Quick Role Selection Cards */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['receptionist', 'lab_tech', 'doctor'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedRole === role
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-600'
                    }`}
                  >
                    <span className="text-base mb-1">{roleDetails[role].icon}</span>
                    <div>
                      <div className="text-[11px] font-bold leading-tight">
                        {roleDetails[role].title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {roleDetails[role].name.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email / Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter email or username"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Dropdown Role Selector Backup */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Active Role Context
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none cursor-pointer transition font-medium"
                  >
                    <option value="receptionist">Receptionist (Jane Receptionist)</option>
                    <option value="lab_tech">Lab Technician (Peter Labman)</option>
                    <option value="doctor">Doctor (Dr. Peter Odhiambo)</option>
                  </select>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Forgot Password */}
              <div className="text-center pt-1">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions have been sent to your email.');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
