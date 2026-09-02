import React from 'react';
import { SPECIALITIES_DATA, DOCTORS_DATA, HEALTH_PACKAGES_DATA } from '../data/hospitalData';
import { Speciality, Doctor } from '../types';

interface HomeScreenProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenAiAssistant: () => void;
  onSelectSpeciality: (speciality: Speciality) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenAiAssistant,
  onSelectSpeciality,
  onSelectDoctor,
}) => {
  const featuredSpecialities = SPECIALITIES_DATA.slice(0, 4);
  const featuredDoctors = DOCTORS_DATA.slice(0, 2);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 pb-16">
      {/* Hero Section */}
      <section className="flex flex-col gap-6">
        {/* Hero Image Container */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-ambient mb-1 group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRxmPnYIZxoUErNu-_MLurl3g9Lh8QjNnrdFrTl4Z-V6nyI5N4zgVPfA-6RPtRckfAq0o9d_6-lKStEdrKLjHPc2-q8dF50KgwsEAz4SwXpNefIORK0zndF7LV5FrKoJAP9NGQ1Jp0cy5KDZ0fKbI6Z_IhyWOeveWeqci0azO371r8bWZuBte2YAfMddbGArPsLtF4x9Y2HNLNFIVa0PH59S4Jpb_SalQ2zdEeheLRINsC3o3834M"
            alt="Deepika Super Speciality Hospital Reception"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003368]/85 via-[#003368]/25 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-5 sm:p-7">
            <span className="bg-white text-[#003368] font-bold text-[12px] px-3.5 py-1.5 rounded-full mb-2.5 inline-block shadow-sm">
              Premium Care
            </span>
            <p className="text-white/90 text-[13px] sm:text-[14px] font-medium max-w-md drop-shadow-sm">
              NABH Accredited • 24/7 Tertiary Medical & Trauma Center
            </p>
          </div>
        </div>

        {/* Hero Title & Description */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-bold text-[#003368] leading-tight tracking-tight">
            Advanced Super Speciality Healthcare, Designed Around You.
          </h1>
          <p className="text-[16px] sm:text-[17px] text-[#424750] leading-relaxed max-w-3xl">
            Expert doctors, advanced diagnostics, modern technology and compassionate care—all under one roof.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <button
            onClick={() => onNavigate('book-wizard')}
            className="w-full sm:flex-1 bg-gradient-to-r from-[#003368] to-[#006491] text-white py-4 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-ambient hover:shadow-lg active:scale-98 transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              calendar_month
            </span>
            <span>Book an Appointment</span>
          </button>

          <button
            onClick={() => onNavigate('find-doctor')}
            className="w-full sm:flex-1 bg-white border border-[#c2c6d2] text-[#003368] hover:bg-[#eff4ff] hover:border-[#003368] py-4 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-xs active:scale-98 transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
            <span>Find a Doctor</span>
          </button>
        </div>
      </section>

      {/* AI Health Assistant Card */}
      <section>
        <div className="bg-[#eff4ff] rounded-3xl p-6 sm:p-7 flex flex-col gap-4 relative overflow-hidden border border-[#dce9ff] shadow-sm">
          {/* Subtle Ambient Glows */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#74c7ff] rounded-full opacity-25 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#0b4a8d] rounded-full opacity-15 blur-3xl pointer-events-none"></div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-13 h-13 rounded-2xl bg-[#003368]/10 text-[#003368] flex items-center justify-center shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-[30px]">
                smart_toy
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[20px] font-bold text-[#0b1c30] leading-snug">
                Not sure which specialist you need?
              </h3>
              <p className="text-[14px] text-[#424750] leading-relaxed">
                Describe your symptoms and our AI assistant will guide you to the right department.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAiAssistant}
            className="w-full bg-white text-[#003368] py-3.5 px-5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm border border-[#c2c6d2] hover:border-[#003368] hover:bg-[#f8f9ff] active:scale-98 transition-all duration-200 cursor-pointer relative z-10"
          >
            <span className="material-symbols-outlined text-[20px] text-[#006491]">
              chat
            </span>
            <span>Ask AI Health Assistant</span>
          </button>

          <p className="text-[11px] text-[#737782] text-center mt-0.5 relative z-10">
            AI advice is for guidance only and not a substitute for professional medical consultation.
          </p>
        </div>
      </section>

      {/* Quick Actions Grid (Exact 6-Box Bento layout matching the screenshot) */}
      <section className="flex flex-col gap-3.5">
        <h2 className="text-[21px] font-bold text-[#0b1c30] tracking-tight">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Book Appointment */}
          <button
            onClick={() => onNavigate('book-wizard')}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#e5eeff] items-start hover:border-[#006491]/40 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e5eeff] group-hover:bg-[#003368] text-[#003368] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                calendar_add_on
              </span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#0b1c30] block">
                Book Appointment
              </span>
              <span className="text-[12px] text-[#737782] hidden sm:block">
                Instant doctor slots
              </span>
            </div>
          </button>

          {/* 2. Find a Doctor */}
          <button
            onClick={() => onNavigate('find-doctor')}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#e5eeff] items-start hover:border-[#006491]/40 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e5eeff] group-hover:bg-[#003368] text-[#003368] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                person_search
              </span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#0b1c30] block">
                Find a Doctor
              </span>
              <span className="text-[12px] text-[#737782] hidden sm:block">
                Top super-specialists
              </span>
            </div>
          </button>

          {/* 3. Find a Speciality */}
          <button
            onClick={() => onNavigate('specialities')}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#e5eeff] items-start hover:border-[#006491]/40 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e5eeff] group-hover:bg-[#003368] text-[#003368] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                stethoscope
              </span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#0b1c30] block">
                Find a Speciality
              </span>
              <span className="text-[12px] text-[#737782] hidden sm:block">
                10+ clinical departments
              </span>
            </div>
          </button>

          {/* 4. Lab & Diagnostics */}
          <button
            onClick={() => onNavigate('diagnostics')}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#e5eeff] items-start hover:border-[#006491]/40 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e5eeff] group-hover:bg-[#003368] text-[#003368] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                biotech
              </span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#0b1c30] block">
                Lab & Diagnostics
              </span>
              <span className="text-[12px] text-[#737782] hidden sm:block">
                MRI, CT, Blood tests
              </span>
            </div>
          </button>

          {/* 5. Health Packages */}
          <button
            onClick={() => onNavigate('health-packages')}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#e5eeff] items-start hover:border-[#006491]/40 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#e5eeff] group-hover:bg-[#003368] text-[#003368] group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                package_2
              </span>
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#0b1c30] block">
                Health Packages
              </span>
              <span className="text-[12px] text-[#737782] hidden sm:block">
                Preventive screenings
              </span>
            </div>
          </button>

          {/* 6. Emergency Care (Highlighted Red) */}
          <button
            onClick={() => onNavigate('emergency')}
            className="bg-[#ffdad6] hover:bg-[#ffc9c2] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-ambient border border-[#ba1a1a]/20 items-start active:scale-98 transition-all duration-200 cursor-pointer text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ba1a1a]/15 text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <div>
              <span className="font-bold text-[15px] text-[#93000a] block">
                Emergency Care
              </span>
              <span className="text-[12px] text-[#ba1a1a] font-medium hidden sm:block">
                24/7 Trauma & Ambulance
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Specialities Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[21px] font-bold text-[#0b1c30]">Our Specialities</h2>
            <p className="text-[13px] text-[#737782]">World-class medical departments</p>
          </div>
          <button
            onClick={() => onNavigate('specialities')}
            className="text-[14px] font-semibold text-[#006491] hover:text-[#003368] flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {featuredSpecialities.map((spec) => (
            <div
              key={spec.id}
              onClick={() => {
                onSelectSpeciality(spec);
                onNavigate('book-wizard', { step: 2, speciality: spec });
              }}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-ambient border border-[#e5eeff] flex flex-col items-center text-center cursor-pointer hover:border-[#003368] hover:shadow-md active:scale-95 transition-all"
            >
              <div className="w-13 h-13 bg-[#d6e3ff] text-[#003368] rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {spec.icon === 'favorite' ? 'favorite' : spec.icon === 'neurology' ? 'neurology' : spec.icon === 'orthopedics' ? 'orthopedics' : 'pediatrics'}
                </span>
              </div>
              <span className="font-semibold text-[15px] text-[#0b1c30] mb-0.5">{spec.name}</span>
              <span className="text-[12px] text-[#737782]">{spec.doctorCount} Doctors</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[21px] font-bold text-[#0b1c30]">Top Specialists</h2>
            <p className="text-[13px] text-[#737782]">Book consultation with senior faculty</p>
          </div>
          <button
            onClick={() => onNavigate('find-doctor')}
            className="text-[14px] font-semibold text-[#006491] hover:text-[#003368] flex items-center gap-1 cursor-pointer"
          >
            <span>All Doctors</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-ambient border border-[#e5eeff] flex gap-4 items-center"
            >
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-[#d3e4fe] shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-bold text-[17px] text-[#0b1c30] leading-snug">{doc.name}</h3>
                  <p className="text-[13px] font-medium text-[#006491] mb-1">{doc.title}</p>
                  <div className="flex items-center gap-1 text-[12px] text-[#424750]">
                    <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-bold text-[#0b1c30]">{doc.rating}</span>
                    <span className="text-[#737782]">({doc.reviewsCount} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f8f9ff]">
                  <span className="text-[12px] font-semibold text-[#003368]">
                    ₹{doc.consultationFee} <span className="font-normal text-[#737782]">Fee</span>
                  </span>
                  <button
                    onClick={() => {
                      onSelectDoctor(doc);
                      onNavigate('book-wizard', { step: 3, doctor: doc, speciality: SPECIALITIES_DATA.find(s => s.id === doc.departmentId) });
                    }}
                    className="px-4 py-1.5 bg-[#0b4a8d] hover:bg-[#003368] text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hospital Trust Statistics */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5eeff] shadow-ambient">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[28px] sm:text-[32px] font-extrabold text-[#003368]">50+</span>
            <span className="text-[13px] text-[#424750] font-medium mt-0.5">Super Specialists</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[28px] sm:text-[32px] font-extrabold text-[#006491]">150K+</span>
            <span className="text-[13px] text-[#424750] font-medium mt-0.5">Happy Patients</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[28px] sm:text-[32px] font-extrabold text-[#003368]">24/7</span>
            <span className="text-[13px] text-[#424750] font-medium mt-0.5">Emergency & Trauma</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[28px] sm:text-[32px] font-extrabold text-[#006491]">99.4%</span>
            <span className="text-[13px] text-[#424750] font-medium mt-0.5">Clinical Success</span>
          </div>
        </div>
      </section>
    </div>
  );
};
