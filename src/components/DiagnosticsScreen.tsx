import React, { useState } from 'react';
import { DIAGNOSTIC_TESTS_DATA } from '../data/hospitalData';
import { DiagnosticTest } from '../types';

interface DiagnosticsScreenProps {
  onNavigateBack: () => void;
}

export const DiagnosticsScreen: React.FC<DiagnosticsScreenProps> = ({ onNavigateBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookedSuccessTest, setBookedSuccessTest] = useState<DiagnosticTest | null>(null);

  const categories = [
    { id: 'all', label: 'All Tests' },
    { id: 'Pathology / Hematology', label: 'Blood & Pathology' },
    { id: 'Radiology & Imaging', label: 'MRI / CT / X-Ray' },
    { id: 'Cardiology Diagnostics', label: 'Cardio Diagnostics' },
  ];

  const filteredTests = DIAGNOSTIC_TESTS_DATA.filter((test) => {
    const matchesCategory = activeCategory === 'all' || test.category.includes(activeCategory) || activeCategory.includes(test.category);
    const matchesSearch =
      !searchQuery.trim() ||
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            NABL-Accredited Lab & Imaging
          </h1>
          <p className="text-[13px] text-[#737782]">
            Same-day digital reports with 100% precision calibration
          </p>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="flex flex-col gap-3.5 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737782] text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name (e.g., MRI Brain, CBC, Troponin-I, Lipid)..."
            className="w-full bg-white border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 pl-11 pr-4 text-[14px] outline-none shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold shrink-0 cursor-pointer transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#003368] text-white'
                  : 'bg-white border border-[#c2c6d2] text-[#424750] hover:bg-[#eff4ff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl p-5 shadow-ambient border border-[#e5eeff] flex flex-col justify-between hover:border-[#006491]/50 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-[#006491] uppercase tracking-wider">
                    {test.category}
                  </span>
                  <h3 className="font-bold text-[17px] text-[#0b1c30] mt-0.5">
                    {test.name}
                  </h3>
                </div>
                <span className="font-extrabold text-[17px] text-[#003368]">
                  ₹{test.price}
                </span>
              </div>

              <p className="text-[13px] text-[#424750] mt-2 mb-3">
                {test.description}
              </p>

              <div className="flex flex-wrap gap-2 text-[12px] text-[#737782] mb-3">
                <span className="flex items-center gap-1 bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5eeff]">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Report in {test.reportTurnaround || 'Same Day'}</span>
                </span>
                <span className="flex items-center gap-1 bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5eeff]">
                  <span className="material-symbols-outlined text-[15px]">info</span>
                  <span>{test.fastingRequired ? 'Fasting Required' : 'No Fasting Needed'}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f8f9ff] flex items-center justify-between">
              <span className="text-[12px] font-semibold text-emerald-700 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home Sample Pickup Available</span>
              </span>

              <button
                onClick={() => setBookedSuccessTest(test)}
                className="px-4 py-1.5 bg-[#003368] hover:bg-[#0b4a8d] text-white text-[13px] font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Book Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Test Confirmation Dialog */}
      {bookedSuccessTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e5eeff] text-center">
            <div className="w-14 h-14 bg-[#d6e3ff] text-[#003368] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px]">biotech</span>
            </div>
            <h3 className="font-bold text-[20px] text-[#0b1c30]">
              Test Appointment Scheduled
            </h3>
            <p className="text-[14px] text-[#424750] mt-1 mb-4">
              Your booking for <strong>{bookedSuccessTest.name}</strong> (₹{bookedSuccessTest.price}) is logged. Our laboratory desk will dispatch the barcode instructions via SMS.
            </p>
            <button
              onClick={() => setBookedSuccessTest(null)}
              className="w-full py-3 bg-[#003368] text-white font-semibold text-[14px] rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
