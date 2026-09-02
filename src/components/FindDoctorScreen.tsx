import React, { useState, useMemo } from 'react';
import { DOCTORS_DATA, SPECIALITIES_DATA } from '../data/hospitalData';
import { Doctor } from '../types';

interface FindDoctorScreenProps {
  onSelectDoctorToBook: (doctor: Doctor) => void;
  onNavigateBack: () => void;
}

export const FindDoctorScreen: React.FC<FindDoctorScreenProps> = ({
  onSelectDoctorToBook,
  onNavigateBack,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);
  const [selectedDoctorForBio, setSelectedDoctorForBio] = useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      const matchesSearch =
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'all' || doc.departmentId === selectedDept;
      const matchesToday = !onlyAvailableToday || doc.availableToday;

      return matchesSearch && matchesDept && matchesToday;
    });
  }, [searchQuery, selectedDept, onlyAvailableToday]);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="p-2 -ml-2 text-[#424750] hover:text-[#003368] hover:bg-[#e5eeff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#003368] leading-tight">
              Find a Doctor
            </h1>
            <p className="text-[13px] text-[#737782]">
              Consult our renowned super-specialist consultants
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3.5 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737782] text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, condition..."
            className="w-full bg-white border border-[#c2c6d2] focus:border-[#003368] focus:ring-2 focus:ring-[#74c7ff]/30 rounded-xl py-3 pl-11 pr-4 text-[#0b1c30] text-[15px] outline-none shadow-xs"
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedDept === 'all'
                ? 'bg-[#003368] text-white'
                : 'bg-white border border-[#c2c6d2] text-[#424750] hover:bg-[#eff4ff]'
            }`}
          >
            All Specialties
          </button>

          {SPECIALITIES_DATA.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedDept(spec.id)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedDept === spec.id
                  ? 'bg-[#003368] text-white'
                  : 'bg-white border border-[#c2c6d2] text-[#424750] hover:bg-[#eff4ff]'
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>

        {/* Today Availability Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="today-toggle"
            checked={onlyAvailableToday}
            onChange={(e) => setOnlyAvailableToday(e.target.checked)}
            className="w-4 h-4 accent-[#003368] rounded cursor-pointer"
          />
          <label htmlFor="today-toggle" className="text-[13px] font-medium text-[#0b1c30] cursor-pointer">
            Show only doctors available today
          </label>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-ambient border border-[#e5eeff] flex flex-col justify-between hover:shadow-md hover:border-[#006491]/40 transition-all duration-200"
          >
            <div className="flex gap-4">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-[#d3e4fe] shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[17px] font-bold text-[#0b1c30] leading-snug">
                      {doc.name}
                    </h3>
                    <p className="text-[13px] font-semibold text-[#006491]">
                      {doc.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[12px] text-[#424750]">
                  <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-[#0b1c30]">{doc.rating}</span>
                  <span className="text-[#737782]">({doc.reviewsCount} reviews)</span>
                </div>

                <p className="text-[12px] text-[#737782] mt-1">
                  {doc.experienceYears} Years Exp • {doc.degrees.slice(0, 2).join(', ')}
                </p>

                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#e5eeff] text-[#003368]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {doc.nextSlot}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#424750] line-clamp-2 mt-3 pt-2 border-t border-[#f8f9ff]">
              {doc.bio}
            </p>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e5eeff]">
              <div>
                <span className="text-[11px] text-[#737782] block">Consultation</span>
                <span className="text-[15px] font-bold text-[#003368]">₹{doc.consultationFee}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDoctorForBio(doc)}
                  className="px-3 py-1.5 text-[12px] font-semibold text-[#006491] hover:bg-[#eff4ff] rounded-lg border border-[#c2c6d2] transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onSelectDoctorToBook(doc)}
                  className="px-4 py-1.5 text-[13px] font-semibold bg-[#003368] hover:bg-[#0b4a8d] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="bg-white p-12 rounded-2xl text-center border border-[#e5eeff]">
          <span className="material-symbols-outlined text-[48px] text-[#737782] mb-2">
            search_off
          </span>
          <h3 className="font-bold text-[18px] text-[#0b1c30]">No doctors found</h3>
          <p className="text-[14px] text-[#737782] mt-1">
            Try adjusting your search terms or clearing selected specialty filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('all');
              setOnlyAvailableToday(false);
            }}
            className="mt-4 px-4 py-2 bg-[#003368] text-white text-[13px] font-semibold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Doctor Bio Modal */}
      {selectedDoctorForBio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5eeff] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3 mb-4">
              <span className="text-[12px] font-bold text-[#006491] uppercase tracking-wider">
                Doctor Profile
              </span>
              <button
                onClick={() => setSelectedDoctorForBio(null)}
                className="text-[#737782] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="flex gap-4 items-center mb-4">
              <img
                src={selectedDoctorForBio.photoUrl}
                alt={selectedDoctorForBio.name}
                className="w-20 h-24 object-cover rounded-2xl bg-[#d3e4fe]"
              />
              <div>
                <h3 className="font-bold text-[19px] text-[#0b1c30]">
                  {selectedDoctorForBio.name}
                </h3>
                <p className="text-[13px] font-semibold text-[#003368]">
                  {selectedDoctorForBio.title}
                </p>
                <p className="text-[12px] text-[#737782]">
                  {selectedDoctorForBio.departmentName} Department
                </p>
                <div className="flex items-center gap-1 mt-1 text-[13px]">
                  <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold">{selectedDoctorForBio.rating}</span>
                  <span className="text-[#737782]">({selectedDoctorForBio.reviewsCount} patient reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <h4 className="font-bold text-[#0b1c30] mb-1">About Doctor</h4>
                <p className="text-[#424750] leading-relaxed">{selectedDoctorForBio.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0b1c30] mb-1">Qualifications & Degrees</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoctorForBio.degrees.map((deg, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#f8f9ff] border border-[#e5eeff] rounded-md text-[#003368] font-medium">
                      {deg}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0b1c30] mb-1">Languages Spoken</h4>
                <p className="text-[#424750]">{selectedDoctorForBio.languages.join(', ')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#0b1c30] mb-1">Clinic Suite</h4>
                <p className="text-[#424750]">{selectedDoctorForBio.roomNumber}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#e5eeff] flex gap-3">
              <button
                onClick={() => setSelectedDoctorForBio(null)}
                className="flex-1 py-3 border border-[#737782] rounded-xl font-semibold text-[14px]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const doc = selectedDoctorForBio;
                  setSelectedDoctorForBio(null);
                  onSelectDoctorToBook(doc);
                }}
                className="flex-1 py-3 bg-[#003368] hover:bg-[#0b4a8d] text-white rounded-xl font-semibold text-[14px]"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
