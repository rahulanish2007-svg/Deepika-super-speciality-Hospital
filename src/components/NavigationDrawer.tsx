import React from 'react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
  onOpenAiAssistant: () => void;
  appointmentCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenAiAssistant,
  appointmentCount,
}) => {
  const handleItemClick = (view: string, data?: any) => {
    onNavigate(view, data);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        id="drawer-overlay"
        onClick={onClose}
        className={`fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-xs z-[55] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer */}
      <aside
        id="nav-drawer"
        className={`fixed inset-y-0 left-0 z-[60] bg-white h-full w-80 max-w-[85vw] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5eeff] bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#003368] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_hospital
              </span>
            </div>
            <div>
              <h2 className="font-bold text-[19px] text-[#003368] leading-tight">Deepika Care</h2>
              <p className="text-[12px] text-[#006491] font-medium">Super Speciality Hospital</p>
            </div>
          </div>
          <button
            id="close-menu-btn"
            onClick={onClose}
            className="p-2 -mr-2 text-[#424750] hover:text-[#003368] hover:bg-[#e5eeff] rounded-xl transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Emergency Fast Action Banner in Drawer */}
        <div className="p-4 bg-[#ffdad6]/60 border-b border-[#ffdad6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            <div>
              <p className="text-[13px] font-bold text-[#93000a]">24/7 Emergency Line</p>
              <p className="text-[12px] font-semibold text-[#ba1a1a]">+91 99999 99999</p>
            </div>
          </div>
          <button
            onClick={() => handleItemClick('emergency')}
            className="px-3 py-1.5 bg-[#ba1a1a] text-white text-[12px] font-semibold rounded-lg shadow-xs hover:bg-[#93000a] transition-colors cursor-pointer"
          >
            Open
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-1">
          <button
            onClick={() => handleItemClick('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'home' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">home</span>
            <span>Home</span>
          </button>

          <button
            onClick={() => handleItemClick('book-wizard')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'book-wizard' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">calendar_add_on</span>
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => handleItemClick('find-doctor')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'find-doctor' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">person_search</span>
            <span>Find a Doctor</span>
          </button>

          <button
            onClick={() => handleItemClick('specialities')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'specialities' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">stethoscope</span>
            <span>Specialities & Clinics</span>
          </button>

          <button
            onClick={() => handleItemClick('health-packages')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'health-packages' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">package_2</span>
            <span>Health Packages</span>
          </button>

          <button
            onClick={() => handleItemClick('diagnostics')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'diagnostics' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[#003368]">biotech</span>
            <span>Lab & Diagnostics</span>
          </button>

          <button
            onClick={() => handleItemClick('my-appointments')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors text-left cursor-pointer ${
              currentView === 'my-appointments' ? 'bg-[#e5eeff] text-[#003368] font-semibold' : 'text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#003368]">person_book</span>
              <span>My Appointments</span>
            </div>
            {appointmentCount > 0 && (
              <span className="px-2 py-0.5 bg-[#006491] text-white text-[12px] font-bold rounded-full">
                {appointmentCount}
              </span>
            )}
          </button>

          <div className="pt-2 pb-1 border-t border-[#e5eeff]">
            <p className="px-3.5 text-[11px] font-semibold text-[#737782] uppercase tracking-wider mb-1">
              AI Smart Features
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAiAssistant();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[15px] font-medium bg-gradient-to-r from-[#e5eeff] to-[#eff4ff] text-[#003368] hover:from-[#dce9ff] hover:to-[#e5eeff] transition-all cursor-pointer border border-[#c2c6d2]/40"
            >
              <div className="w-7 h-7 rounded-lg bg-[#003368]/10 flex items-center justify-center text-[#003368]">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div className="text-left">
                <span className="font-semibold block text-[14px]">AI Health Assistant</span>
                <span className="text-[11px] text-[#006491] block">Symptom Checker & Triage</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#e5eeff] bg-[#f8f9ff] text-[12px] text-[#737782]">
          <p className="font-semibold text-[#0b1c30]">Deepika Super Speciality</p>
          <p>Plot 42, Medical Enclave, Health City</p>
          <p className="mt-1 text-[11px]">NABH & NABL Accredited Center</p>
        </div>
      </aside>
    </>
  );
};
