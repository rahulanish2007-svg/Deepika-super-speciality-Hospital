import React from 'react';
import { Calendar, PhoneCall, Stethoscope, Search, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigate?: (view: string, data?: any) => void;
  onOpenMenu?: () => void;
  onNavigateEmergency?: () => void;
  onNavigateHome?: () => void;
  onOpenAppointments?: () => void;
  appointmentCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'home',
  onNavigate = (_view: string, _data?: any) => {},
  onOpenMenu = () => {},
  onNavigateEmergency,
  onNavigateHome,
  onOpenAppointments,
  appointmentCount = 0,
}) => {
  const isEmergency = currentView === 'emergency';
  const isWizard = currentView === 'book-wizard';

  const navigateTo = (view: string, data?: any) => {
    if (view === 'home' && onNavigateHome) {
      onNavigateHome();
      return;
    }
    if (view === 'emergency' && onNavigateEmergency) {
      onNavigateEmergency();
      return;
    }
    if (view === 'my-appointments' && onOpenAppointments) {
      onOpenAppointments();
      return;
    }
    if (onNavigate) {
      onNavigate(view, data);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 shadow-sm bg-white/95 backdrop-blur-md border-b border-[#e5eeff]/80 transition-all duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand / Nav toggle */}
          <div className="flex items-center gap-3">
            <button
              id="menu-btn"
              onClick={onOpenMenu}
              className="p-2 -ml-2 text-[#003368] hover:bg-[#e5eeff]/50 rounded-xl transition-colors cursor-pointer active:scale-95 duration-200"
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu
              </span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#003368] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[20px] text-[#003368] leading-tight tracking-tight">
                  Deepika
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#006491] tracking-wider -mt-0.5 hidden sm:inline-block">
                  Super Speciality
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('book-wizard')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'book-wizard'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigateTo('find-doctor')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'find-doctor'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigateTo('specialities')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'specialities'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Specialities
            </button>
            <button
              onClick={() => navigateTo('health-packages')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'health-packages'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Health Packages
            </button>
            <button
              onClick={() => navigateTo('diagnostics')}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                currentView === 'diagnostics'
                  ? 'text-[#003368] bg-[#e5eeff] font-semibold'
                  : 'text-[#424750] hover:text-[#003368] hover:bg-[#eff4ff]'
              }`}
            >
              Diagnostics
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Appointments badge button */}
            <button
              onClick={() => navigateTo('my-appointments')}
              className="relative p-2 text-[#003368] hover:bg-[#e5eeff] rounded-xl transition-colors cursor-pointer"
              title="My Appointments"
            >
              <span className="material-symbols-outlined text-[24px]">
                calendar_month
              </span>
              {appointmentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#006491] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {appointmentCount}
                </span>
              )}
            </button>

            {/* Emergency Button - prominent red action matching screenshot */}
            <button
              id="emergency-header-btn"
              onClick={() => navigateTo('emergency')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-[14px] font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                isEmergency
                  ? 'bg-[#93000a] text-white ring-2 ring-red-300'
                  : 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
              <span>Emergency</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
