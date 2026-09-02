import React, { useState } from 'react';
import { HEALTH_PACKAGES_DATA } from '../data/hospitalData';
import { HealthPackage } from '../types';

interface HealthPackagesScreenProps {
  onNavigateBack: () => void;
  onBookPackage: (pkg: HealthPackage) => void;
}

export const HealthPackagesScreen: React.FC<HealthPackagesScreenProps> = ({
  onNavigateBack,
  onBookPackage,
}) => {
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<HealthPackage | null>(null);
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    preferredDate: new Date().toISOString().split('T')[0],
  });

  const handleConfirmPackageBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.phone) return;
    setIsBookedSuccess(true);
    if (selectedPackageForModal) {
      onBookPackage(selectedPackageForModal);
    }
  };

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
            Comprehensive Health Checkup Packages
          </h1>
          <p className="text-[13px] text-[#737782]">
            Preventive diagnostic screening tailored for all age groups
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {HEALTH_PACKAGES_DATA.map((pkg) => {
          const testList = pkg.inclusions || pkg.testsIncluded || [];
          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 shadow-ambient border flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                pkg.popular ? 'border-[#003368] ring-2 ring-[#d6e3ff]' : 'border-[#e5eeff]'
              }`}
            >
              {pkg.popular && (
                <span className="absolute top-4 right-4 bg-[#003368] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <span className="text-[12px] font-bold text-[#006491] uppercase tracking-wider">
                  {pkg.testCount} Parameters • {pkg.recommendedFor}
                </span>
                <h3 className="text-[20px] font-bold text-[#0b1c30] mt-1 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-[13px] text-[#424750] leading-relaxed mb-4">
                  {pkg.description}
                </p>

                {/* Price Tag */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[24px] font-extrabold text-[#003368]">
                    ₹{pkg.price}
                  </span>
                  <span className="text-[14px] text-[#737782] line-through">
                    ₹{pkg.originalPrice}
                  </span>
                  <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}%
                  </span>
                </div>

                {/* Included Tests List */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[12px] font-bold text-[#0b1c30] block">
                    Includes {testList.length} Critical Investigations:
                  </span>
                  {testList.slice(0, 4).map((test, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[12px] text-[#424750]">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                      <span>{test}</span>
                    </div>
                  ))}
                  {testList.length > 4 && (
                    <p className="text-[11px] text-[#006491] font-semibold pl-6">
                      + {testList.length - 4} more specialized tests & physician review
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#f8f9ff]">
                <button
                  onClick={() => {
                    setSelectedPackageForModal(pkg);
                    setIsBookedSuccess(false);
                  }}
                  className="flex-1 py-3 bg-[#003368] hover:bg-[#0b4a8d] text-white font-semibold text-[13px] rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Book Package
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Booking Dialog */}
      {selectedPackageForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5eeff] max-h-[90vh] overflow-y-auto">
            {!isBookedSuccess ? (
              <form onSubmit={handleConfirmPackageBooking} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#006491] uppercase tracking-wider">
                      Preventive Checkup Booking
                    </span>
                    <h3 className="font-bold text-[18px] text-[#0b1c30]">
                      {selectedPackageForModal.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPackageForModal(null)}
                    className="text-[#737782] hover:text-[#0b1c30]"
                  >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                  </button>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] flex justify-between items-center text-[14px]">
                  <div>
                    <span className="text-[12px] text-[#737782] block">Total Package Fee</span>
                    <span className="font-bold text-[#003368] text-[18px]">₹{selectedPackageForModal.price}</span>
                  </div>
                  <span className="text-[12px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                    Includes Doctor Review
                  </span>
                </div>

                <div className="text-[12px] text-[#424750] bg-amber-50 border border-amber-200 p-3 rounded-xl">
                  <strong>Preparation:</strong> 10-12 hours overnight fasting is advised before morning blood sample and abdominal ultrasound.
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    placeholder="e.g. Ananya Sen"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Preferred Date of Checkup
                  </label>
                  <input
                    type="date"
                    value={bookingFormData.preferredDate}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })}
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackageForModal(null)}
                    className="flex-1 py-3 border border-[#737782] rounded-xl font-semibold text-[14px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#003368] text-white rounded-xl font-semibold text-[14px] shadow-sm hover:bg-[#0b4a8d]"
                  >
                    Confirm Checkup Slot
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center flex flex-col gap-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                </div>
                <h3 className="text-[20px] font-bold text-[#0b1c30]">
                  Checkup Slot Reserved!
                </h3>
                <p className="text-[14px] text-[#424750]">
                  We have registered your slot for <strong>{selectedPackageForModal.name}</strong> on {bookingFormData.preferredDate}.
                  Our Wellness Coordinator will call {bookingFormData.phone} shortly.
                </p>
                <button
                  onClick={() => {
                    setSelectedPackageForModal(null);
                    setIsBookedSuccess(false);
                  }}
                  className="w-full py-3 bg-[#003368] text-white rounded-xl font-semibold text-[14px] mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
