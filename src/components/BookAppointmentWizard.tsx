import React, { useState, useMemo } from 'react';
import { SPECIALITIES_DATA, DOCTORS_DATA } from '../data/hospitalData';
import { Speciality, Doctor, PatientAppointment } from '../types';

interface BookAppointmentWizardProps {
  initialSpeciality?: Speciality | null;
  initialDoctor?: Doctor | null;
  initialStep?: number;
  onNavigateHome: () => void;
  onAppointmentBooked: (appointment: PatientAppointment) => void;
}

export const BookAppointmentWizard: React.FC<BookAppointmentWizardProps> = ({
  initialSpeciality = null,
  initialDoctor = null,
  initialStep = 1,
  onNavigateHome,
  onAppointmentBooked,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selections
  const [selectedSpeciality, setSelectedSpeciality] = useState<Speciality | null>(
    initialSpeciality || SPECIALITIES_DATA[0]
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    initialDoctor || DOCTORS_DATA[0]
  );
  
  // Date & Time
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullIso = d.toISOString().split('T')[0];
      list.push({ dayName, monthDay, fullIso, dateObj: d });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(dates[0].fullIso);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30 AM');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');

  // Patient Info
  const [fullName, setFullName] = useState<string>('');
  const [age, setAge] = useState<string>('32');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const [mrnNumber, setMrnNumber] = useState<string>('');
  
  const [bookedAppointment, setBookedAppointment] = useState<PatientAppointment | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filter specialities
  const filteredSpecialities = useMemo(() => {
    if (!searchQuery.trim()) return SPECIALITIES_DATA;
    const q = searchQuery.toLowerCase();
    return SPECIALITIES_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.popularSymptoms.some((sym) => sym.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filter doctors for selected speciality
  const departmentDoctors = useMemo(() => {
    if (!selectedSpeciality) return DOCTORS_DATA;
    return DOCTORS_DATA.filter((d) => d.departmentId === selectedSpeciality.id);
  }, [selectedSpeciality]);

  const stepLabels: { [key: number]: string } = {
    1: 'Select Speciality',
    2: 'Select Doctor',
    3: 'Select Date & Time',
    4: 'Patient Details',
    5: 'Confirmed',
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onNavigateHome();
    } else if (currentStep > 1 && currentStep < 5) {
      setCurrentStep(currentStep - 1);
    } else {
      onNavigateHome();
    }
  };

  const handleSelectSpeciality = (spec: Speciality) => {
    setSelectedSpeciality(spec);
    // Auto-select first doctor of that department
    const doc = DOCTORS_DATA.find((d) => d.departmentId === spec.id) || DOCTORS_DATA[0];
    setSelectedDoctor(doc);
    setCurrentStep(2);
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setCurrentStep(3);
  };

  const handleValidateAndBook = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) errors.fullName = 'Please enter patient full name';
    if (!phone.trim() || phone.length < 10) errors.phone = 'Please enter a valid 10-digit phone number';
    if (!age || parseInt(age, 10) <= 0) errors.age = 'Please enter a valid age';
    if (!email.trim() || !email.includes('@')) errors.email = 'Please enter a valid email address';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const newAppointment: PatientAppointment = {
      id: `APT-${Date.now()}`,
      bookingCode: `DPK-${Math.floor(10000 + Math.random() * 90000)}`,
      doctor: selectedDoctor || DOCTORS_DATA[0],
      speciality: selectedSpeciality || SPECIALITIES_DATA[0],
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType,
      patient: {
        fullName,
        age: parseInt(age, 10),
        gender,
        phone,
        email,
        symptoms: symptoms || 'General Medical Consultation',
        isExistingPatient: isExisting,
        mrnNumber: isExisting ? mrnNumber : undefined,
      },
      status: 'Confirmed',
      totalFee: selectedDoctor ? selectedDoctor.consultationFee : 1200,
      createdAt: new Date().toISOString(),
    };

    setBookedAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setCurrentStep(5);
  };

  const handleDownloadSlip = () => {
    if (!bookedAppointment) return;
    const slipText = `
========================================
   DEEPIKA SUPER SPECIALITY HOSPITAL
       APPOINTMENT CONFIRMATION
========================================
Booking Ref: ${bookedAppointment.bookingCode}
Date Booked: ${new Date(bookedAppointment.createdAt).toLocaleDateString()}
Status: ${bookedAppointment.status}

DOCTOR DETAILS:
Doctor: ${bookedAppointment.doctor.name}
Department: ${bookedAppointment.doctor.departmentName}
Designation: ${bookedAppointment.doctor.title}
Room/Suite: ${bookedAppointment.doctor.roomNumber}

SCHEDULE:
Date: ${bookedAppointment.date}
Time Slot: ${bookedAppointment.timeSlot}
Consultation Mode: ${bookedAppointment.consultationType === 'in-person' ? 'In-Person Hospital Visit' : 'HD Video Call'}

PATIENT DETAILS:
Name: ${bookedAppointment.patient.fullName}
Age/Gender: ${bookedAppointment.patient.age} Yrs / ${bookedAppointment.patient.gender}
Mobile: ${bookedAppointment.patient.phone}
Email: ${bookedAppointment.patient.email}
Chief Complaint: ${bookedAppointment.patient.symptoms}

Consultation Fee: ₹${bookedAppointment.totalFee}
========================================
Please arrive 15 minutes before your scheduled slot.
Hospital Address: Plot 42, Super Speciality Ave, Medical Enclave
Emergency: +91 99999 99999
========================================
    `;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deepika_Appointment_${bookedAppointment.bookingCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddToGoogleCalendar = () => {
    if (!bookedAppointment) return;
    const title = encodeURIComponent(`Doctor Appointment: ${bookedAppointment.doctor.name} - Deepika Hospital`);
    const details = encodeURIComponent(
      `Appointment Ref: ${bookedAppointment.bookingCode}\nDoctor: ${bookedAppointment.doctor.name} (${bookedAppointment.doctor.departmentName})\nLocation: ${bookedAppointment.doctor.roomNumber}, Deepika Super Speciality Hospital.`
    );
    const location = encodeURIComponent('Deepika Super Speciality Hospital, Plot 42, Medical Enclave');
    
    // Construct calendar date format
    const cleanDate = bookedAppointment.date.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T090000Z/${cleanDate}T100000Z`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Top Wizard Bar */}
      <div className="sticky top-16 z-40 bg-[#f8f9ff]/95 backdrop-blur-md pt-2 pb-4 mb-4 border-b border-[#e5eeff]">
        {/* Header Title with Back button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-[#424750] hover:text-[#003368] hover:bg-[#e5eeff] rounded-full transition-colors cursor-pointer active:scale-95"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-[24px] font-bold text-[#003368] leading-none">
            Book Appointment
          </h1>
        </div>

        {/* 5-Step Progress Bar Indicator (Matching the design) */}
        <div className="px-2">
          <div className="flex justify-between items-center relative">
            {/* Connecting baseline */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#c2c6d2] -z-10 -translate-y-1/2" />
            
            {/* Active connecting progress fill line */}
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-[#003368] -z-10 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, (currentStep - 1) * 25)}%` }}
            />

            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = step < currentStep;
              const isActive = step === currentStep;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#003368] text-white ring-4 ring-[#d6e3ff]'
                        : isCompleted
                        ? 'bg-[#0b4a8d] text-white'
                        : 'bg-[#f8f9ff] text-[#424750] border border-[#c2c6d2]'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      step
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-2.5 text-[12px] font-semibold text-[#424750]">
            {stepLabels[currentStep]}
          </div>
        </div>
      </div>

      {/* STEP 1: Select Speciality */}
      {currentStep === 1 && (
        <section className="animate-fadeIn flex flex-col gap-4">
          <h2 className="text-[22px] font-bold text-[#0b1c30]">
            What do you need help with?
          </h2>

          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737782] text-[22px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialities or symptoms..."
              className="w-full bg-white border border-[#c2c6d2] focus:border-[#006491] focus:ring-2 focus:ring-[#74c7ff]/30 rounded-xl py-3 pl-11 pr-4 text-[#0b1c30] placeholder-[#737782] text-[15px] outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737782] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Specialities Grid matching screenshot */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mt-1">
            {filteredSpecialities.map((spec) => (
              <div
                key={spec.id}
                onClick={() => handleSelectSpeciality(spec)}
                className={`bg-white p-4 sm:p-5 rounded-2xl shadow-ambient border flex flex-col items-center text-center cursor-pointer active:scale-95 transition-all duration-200 hover:shadow-md ${
                  selectedSpeciality?.id === spec.id
                    ? 'border-[#003368] ring-2 ring-[#d6e3ff]'
                    : 'border-[#d3e4fe] hover:border-[#006491]'
                }`}
              >
                <div className="w-13 h-13 bg-[#d6e3ff] rounded-full flex items-center justify-center text-[#003368] mb-2.5">
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {spec.icon}
                  </span>
                </div>
                <span className="font-semibold text-[15px] text-[#0b1c30]">
                  {spec.name}
                </span>
                <span className="text-[12px] text-[#737782] mt-0.5">
                  {spec.doctorCount} Doctors Available
                </span>
              </div>
            ))}
          </div>

          {filteredSpecialities.length === 0 && (
            <div className="bg-white p-8 rounded-2xl text-center border border-[#e5eeff]">
              <p className="text-[#424750] text-[15px] font-medium">No specialities found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-[13px] font-semibold text-[#003368] hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      )}

      {/* STEP 2: Doctor Selection (Matching screenshot) */}
      {currentStep === 2 && selectedSpeciality && (
        <section className="animate-fadeIn flex flex-col gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-[#0b1c30] leading-tight">
              {selectedSpeciality.name} Specialists
            </h2>
            <p className="text-[14px] text-[#424750] mt-0.5">
              Select a specialist for your consultation.
            </p>
          </div>

          {/* Doctor Cards */}
          <div className="flex flex-col gap-3.5">
            {departmentDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white p-4 rounded-2xl shadow-ambient border flex gap-4 transition-all ${
                  selectedDoctor?.id === doc.id
                    ? 'border-[#003368] ring-2 ring-[#d6e3ff]'
                    : 'border-[#e5eeff] hover:border-[#006491]/50'
                }`}
              >
                <img
                  src={doc.photoUrl}
                  alt={doc.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-[#d3e4fe] shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[17px] leading-snug text-[#0b1c30] font-bold">
                      {doc.name}
                    </h3>
                    <p className="text-[12px] font-semibold text-[#003368] mb-1">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-1 text-[12px] text-[#424750]">
                      <span
                        className="material-symbols-outlined text-[16px] text-[#006491]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-semibold text-[#0b1c30]">{doc.rating}</span>
                      <span className="text-[#737782]">({doc.reviewsCount} reviews)</span>
                    </div>
                    <p className="text-[11px] text-[#737782] mt-1 line-clamp-1">
                      {doc.experienceYears} yrs exp • {doc.degrees.slice(0, 2).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f8f9ff]">
                    <span className="text-[13px] font-bold text-[#003368]">
                      ₹{doc.consultationFee}
                    </span>
                    <button
                      onClick={() => handleSelectDoctor(doc)}
                      className="bg-[#0b4a8d] hover:bg-[#003368] text-white font-semibold text-[13px] px-5 py-2 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-xs"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="mt-2 w-full py-3.5 border border-[#737782] rounded-xl text-[#0b1c30] font-semibold text-[14px] hover:bg-white transition-colors cursor-pointer"
          >
            Back to Specialities
          </button>
        </section>
      )}

      {/* STEP 3: Select Date & Time */}
      {currentStep === 3 && selectedDoctor && (
        <section className="animate-fadeIn flex flex-col gap-5">
          {/* Selected Doctor Summary Card */}
          <div className="bg-white p-4 rounded-2xl shadow-ambient border border-[#e5eeff] flex items-center gap-3.5">
            <img
              src={selectedDoctor.photoUrl}
              alt={selectedDoctor.name}
              className="w-14 h-14 object-cover rounded-xl bg-[#d3e4fe]"
            />
            <div className="flex-1">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">{selectedDoctor.name}</h3>
              <p className="text-[12px] text-[#006491] font-medium">{selectedDoctor.title}</p>
              <p className="text-[11px] text-[#737782]">{selectedDoctor.roomNumber}</p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-[12px] font-semibold text-[#006491] hover:underline"
            >
              Change
            </button>
          </div>

          {/* Consultation Type Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#0b1c30]">Consultation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationType('in-person')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  consultationType === 'in-person'
                    ? 'bg-[#e5eeff] border-[#003368] text-[#003368]'
                    : 'bg-white border-[#c2c6d2] text-[#424750] hover:border-[#737782]'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">local_hospital</span>
                <div>
                  <p className="text-[13px] font-bold leading-tight">In-Person Visit</p>
                  <p className="text-[11px] text-[#737782]">Hospital OPD Suite</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationType('video')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  consultationType === 'video'
                    ? 'bg-[#e5eeff] border-[#003368] text-[#003368]'
                    : 'bg-white border-[#c2c6d2] text-[#424750] hover:border-[#737782]'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">videocam</span>
                <div>
                  <p className="text-[13px] font-bold leading-tight">Video Consult</p>
                  <p className="text-[11px] text-[#737782]">Secure Telehealth Call</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#0b1c30]">Select Date</label>
            <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar">
              {dates.map((d) => {
                const isSelected = selectedDate === d.fullIso;
                return (
                  <button
                    key={d.fullIso}
                    type="button"
                    onClick={() => setSelectedDate(d.fullIso)}
                    className={`shrink-0 px-4 py-3 rounded-xl border flex flex-col items-center min-w-[76px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#003368] border-[#003368] text-white shadow-sm scale-102'
                        : 'bg-white border-[#c2c6d2] text-[#0b1c30] hover:border-[#003368]'
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                      {d.dayName}
                    </span>
                    <span className="text-[14px] font-bold mt-0.5">
                      {d.monthDay}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Picker */}
          <div className="flex flex-col gap-4">
            <label className="text-[14px] font-bold text-[#0b1c30]">Available Time Slots</label>

            {/* Morning */}
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#006491] mb-2">
                <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                <span>Morning Slots</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM', '11:30 AM', '11:45 AM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                      selectedTimeSlot === time
                        ? 'bg-[#0b4a8d] text-white shadow-sm'
                        : 'bg-white border border-[#c2c6d2] text-[#0b1c30] hover:border-[#003368]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Afternoon */}
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#006491] mb-2">
                <span className="material-symbols-outlined text-[16px]">sunny</span>
                <span>Afternoon Slots</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['02:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:30 PM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                      selectedTimeSlot === time
                        ? 'bg-[#0b4a8d] text-white shadow-sm'
                        : 'bg-white border border-[#c2c6d2] text-[#0b1c30] hover:border-[#003368]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Evening */}
            <div>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#006491] mb-2">
                <span className="material-symbols-outlined text-[16px]">nightlight</span>
                <span>Evening Slots</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['05:00 PM', '05:45 PM', '06:30 PM', '07:15 PM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                      selectedTimeSlot === time
                        ? 'bg-[#0b4a8d] text-white shadow-sm'
                        : 'bg-white border border-[#c2c6d2] text-[#0b1c30] hover:border-[#003368]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3.5 border border-[#737782] rounded-xl text-[#0b1c30] font-semibold text-[14px] hover:bg-white transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="flex-1 py-3.5 bg-gradient-to-r from-[#003368] to-[#006491] text-white rounded-xl font-semibold text-[14px] shadow-ambient hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              Proceed to Patient Info
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: Patient Details Form */}
      {currentStep === 4 && (
        <section className="animate-fadeIn">
          <form onSubmit={handleValidateAndBook} className="flex flex-col gap-4">
            <div>
              <h2 className="text-[22px] font-bold text-[#0b1c30]">
                Patient Information
              </h2>
              <p className="text-[13px] text-[#424750]">
                Enter details of the person attending the consultation.
              </p>
            </div>

            {/* Appointment Preview Capsule */}
            <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dce9ff] flex items-center justify-between text-[13px]">
              <div>
                <span className="font-bold text-[#003368]">{selectedDoctor?.name}</span>
                <span className="text-[#424750] block text-[12px]">{selectedDoctor?.departmentName} • {selectedDate} at {selectedTimeSlot}</span>
              </div>
              <span className="font-bold text-[#003368] bg-white px-2.5 py-1 rounded-lg border border-[#c2c6d2]">
                ₹{selectedDoctor?.consultationFee}
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-white border rounded-xl py-3 px-3.5 text-[15px] outline-none transition-all ${
                  formErrors.fullName ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#c2c6d2] focus:border-[#006491]'
                }`}
              />
              {formErrors.fullName && (
                <p className="text-[#ba1a1a] text-[12px] mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  min="1"
                  max="120"
                  className={`w-full bg-white border rounded-xl py-3 px-3.5 text-[15px] outline-none transition-all ${
                    formErrors.age ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#c2c6d2] focus:border-[#006491]'
                  }`}
                />
                {formErrors.age && (
                  <p className="text-[#ba1a1a] text-[12px] mt-1">{formErrors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full bg-white border border-[#c2c6d2] focus:border-[#006491] rounded-xl py-3 px-3.5 text-[15px] outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Mobile & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className={`w-full bg-white border rounded-xl py-3 px-3.5 text-[15px] outline-none transition-all ${
                    formErrors.phone ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#c2c6d2] focus:border-[#006491]'
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-[#ba1a1a] text-[12px] mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className={`w-full bg-white border rounded-xl py-3 px-3.5 text-[15px] outline-none transition-all ${
                    formErrors.email ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#c2c6d2] focus:border-[#006491]'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[#ba1a1a] text-[12px] mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            {/* Symptoms / Chief Complaints */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                Reason for Visit / Symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                placeholder="Briefly describe what you are experiencing..."
                className="w-full bg-white border border-[#c2c6d2] focus:border-[#006491] rounded-xl p-3 text-[14px] outline-none"
              />
            </div>

            {/* Existing Patient Toggle */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e5eeff] flex items-center justify-between">
              <div>
                <span className="text-[13px] font-semibold text-[#0b1c30] block">Existing Hospital Patient?</span>
                <span className="text-[11px] text-[#737782]">Have a Deepika Medical Record Number (MRN)</span>
              </div>
              <input
                type="checkbox"
                checked={isExisting}
                onChange={(e) => setIsExisting(e.target.checked)}
                className="w-5 h-5 accent-[#003368] rounded cursor-pointer"
              />
            </div>

            {isExisting && (
              <div>
                <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                  MRN Number
                </label>
                <input
                  type="text"
                  value={mrnNumber}
                  onChange={(e) => setMrnNumber(e.target.value)}
                  placeholder="e.g. DPK-MRN-29402"
                  className="w-full bg-white border border-[#c2c6d2] focus:border-[#006491] rounded-xl py-2.5 px-3.5 text-[14px] outline-none"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-3.5 border border-[#737782] rounded-xl text-[#0b1c30] font-semibold text-[14px] hover:bg-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-[#003368] to-[#006491] text-white rounded-xl font-semibold text-[14px] shadow-ambient hover:shadow-md transition-all cursor-pointer active:scale-98"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 5: Confirmation Pass */}
      {currentStep === 5 && bookedAppointment && (
        <section className="animate-fadeIn flex flex-col gap-5 text-center">
          {/* Success Banner */}
          <div className="w-16 h-16 bg-[#d6e3ff] text-[#003368] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>

          <div>
            <h2 className="text-[24px] font-bold text-[#003368]">
              Appointment Confirmed!
            </h2>
            <p className="text-[14px] text-[#424750] mt-1">
              Your consultation booking ID is <span className="font-bold text-[#003368]">{bookedAppointment.bookingCode}</span>.
              A confirmation SMS and email have been sent.
            </p>
          </div>

          {/* Digital Appointment Pass */}
          <div className="bg-white rounded-3xl p-6 shadow-ambient-md border border-[#e5eeff] text-left relative overflow-hidden">
            {/* Top decorative header */}
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003368]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
                <span className="font-bold text-[#003368] text-[16px]">Deepika Super Speciality</span>
              </div>
              <span className="px-3 py-1 bg-[#e5eeff] text-[#003368] font-bold text-[12px] rounded-full">
                {bookedAppointment.consultationType === 'in-person' ? 'Hospital OPD' : 'Teleconsult'}
              </span>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={bookedAppointment.doctor.photoUrl}
                alt={bookedAppointment.doctor.name}
                className="w-16 h-18 object-cover rounded-xl bg-[#d3e4fe]"
              />
              <div>
                <h3 className="font-bold text-[17px] text-[#0b1c30]">{bookedAppointment.doctor.name}</h3>
                <p className="text-[13px] text-[#006491] font-semibold">{bookedAppointment.doctor.title}</p>
                <p className="text-[12px] text-[#737782]">{bookedAppointment.doctor.roomNumber}</p>
              </div>
            </div>

            {/* Schedule Info Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#f8f9ff] rounded-2xl mb-4 border border-[#e5eeff]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#737782] font-semibold block">Date</span>
                <span className="text-[14px] font-bold text-[#0b1c30]">{bookedAppointment.date}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#737782] font-semibold block">Time</span>
                <span className="text-[14px] font-bold text-[#003368]">{bookedAppointment.timeSlot}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#737782] font-semibold block">Patient</span>
                <span className="text-[14px] font-semibold text-[#0b1c30]">{bookedAppointment.patient.fullName}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#737782] font-semibold block">Booking ID</span>
                <span className="text-[14px] font-bold text-[#006491]">{bookedAppointment.bookingCode}</span>
              </div>
            </div>

            {/* Hospital Check-in Notes */}
            <div className="text-[12px] text-[#737782] space-y-1">
              <p>• Please report to reception counter 15 minutes before slot time.</p>
              <p>• Carry any past clinical records, prescriptions, or imaging CDs.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadSlip}
                className="py-3 px-4 bg-white border border-[#c2c6d2] hover:border-[#003368] text-[#003368] rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download Slip</span>
              </button>

              <button
                onClick={handleAddToGoogleCalendar}
                className="py-3 px-4 bg-white border border-[#c2c6d2] hover:border-[#003368] text-[#003368] rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">event</span>
                <span>Add to Calendar</span>
              </button>
            </div>

            <button
              onClick={onNavigateHome}
              className="w-full py-3.5 bg-[#003368] text-white rounded-xl font-semibold text-[14px] hover:bg-[#0b4a8d] transition-colors cursor-pointer shadow-sm"
            >
              Back to Home
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
