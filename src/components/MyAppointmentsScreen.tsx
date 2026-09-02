import React, { useState } from 'react';
import { PatientAppointment } from '../types';

interface MyAppointmentsScreenProps {
  appointments: PatientAppointment[];
  onBookNew: () => void;
  onCancelAppointment: (id: string) => void;
  onNavigateBack: () => void;
}

export const MyAppointmentsScreen: React.FC<MyAppointmentsScreenProps> = ({
  appointments,
  onBookNew,
  onCancelAppointment,
  onNavigateBack,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);

  const handleDownloadSlip = (apt: PatientAppointment) => {
    const slipText = `
========================================
   DEEPIKA SUPER SPECIALITY HOSPITAL
       APPOINTMENT SLIP
========================================
Booking Ref: ${apt.bookingCode}
Status: ${apt.status}

DOCTOR:
Name: ${apt.doctor.name}
Department: ${apt.doctor.departmentName}
Designation: ${apt.doctor.title}
Room: ${apt.doctor.roomNumber}

DATE & TIME:
Date: ${apt.date}
Slot: ${apt.timeSlot}
Mode: ${apt.consultationType === 'in-person' ? 'In-Person Hospital Visit' : 'Video Consult'}

PATIENT:
Name: ${apt.patient.fullName} (${apt.patient.age} Yrs / ${apt.patient.gender})
Phone: ${apt.patient.phone}
Email: ${apt.patient.email}
Symptoms: ${apt.patient.symptoms}

Total Fee: ₹${apt.totalFee}
========================================
Hospital Address: Plot 42, Super Speciality Ave, Medical Enclave
    `;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Deepika_Slip_${apt.bookingCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
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
              My Appointments
            </h1>
            <p className="text-[13px] text-[#737782]">
              Track and manage your upcoming doctor consultations
            </p>
          </div>
        </div>

        <button
          onClick={onBookNew}
          className="px-4 py-2 bg-[#003368] hover:bg-[#0b4a8d] text-white text-[13px] font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Book New</span>
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-ambient border border-[#e5eeff] flex flex-col gap-4"
            >
              {/* Top Row: Ref and Status */}
              <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#737782]">Ref:</span>
                  <span className="text-[14px] font-bold text-[#003368]">{apt.bookingCode}</span>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-[12px] font-bold ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Doctor Details */}
              <div className="flex gap-4 items-center">
                <img
                  src={apt.doctor.photoUrl}
                  alt={apt.doctor.name}
                  className="w-16 h-20 object-cover rounded-xl bg-[#d3e4fe] shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[17px] text-[#0b1c30]">{apt.doctor.name}</h3>
                  <p className="text-[13px] text-[#006491] font-medium">{apt.doctor.title}</p>
                  <p className="text-[12px] text-[#737782]">{apt.doctor.departmentName} • {apt.doctor.roomNumber}</p>
                </div>
              </div>

              {/* Schedule Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#f8f9ff] rounded-2xl text-[13px] border border-[#e5eeff]">
                <div>
                  <span className="text-[11px] text-[#737782] block font-medium">Date</span>
                  <span className="font-bold text-[#0b1c30]">{apt.date}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#737782] block font-medium">Slot Time</span>
                  <span className="font-bold text-[#003368]">{apt.timeSlot}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-[#737782] block font-medium">Mode</span>
                  <span className="font-semibold text-[#0b1c30]">
                    {apt.consultationType === 'in-person' ? 'Hospital OPD' : 'Video Teleconsult'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f8f9ff]">
                <button
                  onClick={() => handleDownloadSlip(apt)}
                  className="text-[13px] font-semibold text-[#006491] hover:text-[#003368] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Slip</span>
                </button>

                {apt.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this appointment?')) {
                        onCancelAppointment(apt.id);
                      }
                    }}
                    className="text-[12px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center border border-[#e5eeff] shadow-ambient">
          <div className="w-16 h-16 bg-[#e5eeff] text-[#003368] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[32px]">calendar_month</span>
          </div>
          <h3 className="font-bold text-[19px] text-[#0b1c30]">No Appointments Booked Yet</h3>
          <p className="text-[14px] text-[#737782] mt-1 max-w-sm mx-auto mb-5">
            You don't have any upcoming doctor consultations. Book a slot in 5 easy steps.
          </p>
          <button
            onClick={onBookNew}
            className="px-6 py-3 bg-[#003368] hover:bg-[#0b4a8d] text-white font-semibold text-[14px] rounded-xl cursor-pointer shadow-sm"
          >
            Book an Appointment
          </button>
        </div>
      )}
    </div>
  );
};
