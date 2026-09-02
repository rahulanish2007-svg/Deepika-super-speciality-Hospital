import React from 'react';
import { SPECIALITIES_DATA } from '../data/hospitalData';
import { Speciality } from '../types';

interface SpecialitiesScreenProps {
  onSelectSpeciality: (speciality: Speciality) => void;
  onNavigateBack: () => void;
}

export const SpecialitiesScreen: React.FC<SpecialitiesScreenProps> = ({
  onSelectSpeciality,
  onNavigateBack,
}) => {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onNavigateBack}
          className="p-2 -ml-2 text-[#424750] hover:text-[#003368] hover:bg-[#e5eeff] rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#003368] leading-tight">
            Centers of Excellence & Specialities
          </h1>
          <p className="text-[13px] text-[#737782]">
            Comprehensive tertiary and quaternary care departments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPECIALITIES_DATA.map((spec) => (
          <div
            key={spec.id}
            className="bg-white rounded-2xl p-5 shadow-ambient border border-[#e5eeff] flex flex-col justify-between hover:shadow-md hover:border-[#003368] transition-all duration-200"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-13 h-13 rounded-2xl bg-[#d6e3ff] text-[#003368] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {spec.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[18px] text-[#0b1c30]">{spec.name}</h3>
                  <span className="text-[12px] font-semibold text-[#006491]">
                    {spec.doctorCount} Doctors Available
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#424750] leading-relaxed mb-3">
                {spec.description}
              </p>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#737782] font-semibold block mb-1.5">
                  Common Symptoms & Conditions Treated
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {spec.popularSymptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#f8f9ff] border border-[#e5eeff] text-[#003368] rounded-md text-[11px] font-medium"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectSpeciality(spec)}
              className="mt-4 w-full py-2.5 bg-[#eff4ff] hover:bg-[#003368] text-[#003368] hover:text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Specialists & Book</span>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
