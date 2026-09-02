import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto bg-[#003368] text-white border-t border-[#002244]">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white text-[#003368] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </div>
              <div>
                <h3 className="font-bold text-[20px] leading-tight text-white">Deepika Care</h3>
                <p className="text-[12px] text-[#74c7ff]">Super Speciality Hospital</p>
              </div>
            </div>
            <p className="text-[13px] text-white/80 leading-relaxed">
              Advanced tertiary healthcare delivering compassionate clinical excellence, cutting-edge diagnostics, and precision surgical care.
            </p>
            <div className="flex gap-2 text-[11px] font-semibold text-[#74c7ff]">
              <span className="px-2 py-0.5 rounded bg-white/10">NABH Accredited</span>
              <span className="px-2 py-0.5 rounded bg-white/10">NABL Certified</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-[13px] text-white/80">
              <li>
                <button
                  onClick={() => onNavigate('book-wizard')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Book Doctor Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-doctor')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Our Medical Specialists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('specialities')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Centers of Excellence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('health-packages')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Preventive Health Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('diagnostics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  MRI & Laboratory Tests
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: 24/7 Emergency */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-3">24/7 Critical Care</h4>
            <div className="p-3.5 rounded-2xl bg-[#ffdad6]/10 border border-[#ffdad6]/20 space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-[#ffdad6] font-bold">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emergency
                </span>
                <span>Emergency Trauma Line</span>
              </div>
              <p className="text-[18px] font-black text-white tracking-wide">
                +91 99999 99999
              </p>
              <p className="text-[12px] text-white/70">
                Immediate ACLS ambulance dispatch & Code Red support.
              </p>
            </div>
          </div>

          {/* Col 4: Hospital Location */}
          <div>
            <h4 className="text-[15px] font-bold text-white mb-3">Hospital Campus</h4>
            <p className="text-[13px] text-white/80 leading-relaxed mb-2">
              Plot 42, Super Speciality Avenue, Medical Enclave, Health City, Landmark: Near Central Metro.
            </p>
            <p className="text-[12px] text-white/70">
              OPD Hours: 08:00 AM - 08:00 PM (Mon-Sat)<br />
              Emergency & ICU: 24 Hours / 365 Days
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-white/10 bg-[#00274f] text-white/60 text-[12px] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Deepika Super Speciality Hospital. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Patient Rights</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
