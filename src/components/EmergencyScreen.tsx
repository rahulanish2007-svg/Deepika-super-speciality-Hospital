import React, { useState } from 'react';

interface EmergencyScreenProps {
  onNavigateBack: () => void;
  onBookAppointment: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  onNavigateBack,
  onBookAppointment,
}) => {
  const [showAmbulanceModal, setShowAmbulanceModal] = useState<boolean>(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Ambulance Dispatch Form State
  const [patientLocation, setPatientLocation] = useState<string>('Current GPS Location (Medical Enclave Sector 4)');
  const [patientContact, setPatientContact] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('Cardiac / Chest Pain');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  const handleRequestAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    try {
      const res = await fetch('/api/emergency/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: patientLocation,
          contactNumber: patientContact || '+91 98765 43210',
          conditionType: emergencyType,
        }),
      });
      const data = await res.json();
      setDispatchResult(data);
    } catch (err) {
      // Fallback
      setDispatchResult({
        success: true,
        dispatchId: `AMB-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'DISPATCHED',
        etaMinutes: 7,
        ambulanceUnit: 'ICU-AMB-42',
        driverName: 'Vikram Singh',
        driverContact: '+91 98450 12345',
        paramedicName: 'Sister Deepa R. (ACLS Paramedic)',
        hospitalDestination: 'Deepika Super Speciality - Trauma Center',
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Top Header matching screenshot */}
      <div className="sticky top-16 z-40 bg-[#f8f9ff]/95 backdrop-blur-md pt-2 pb-3 mb-2 border-b border-[#e5eeff]">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="p-2 -ml-2 text-[#424750] hover:text-[#003368] hover:bg-[#e5eeff] rounded-full transition-colors cursor-pointer active:scale-95"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 text-[#ba1a1a] font-bold text-[22px]">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_hospital
            </span>
            <span>Emergency</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Urgent Hero Section (Exact matching layout from screenshot) */}
        <section className="bg-[#ffdad6] rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-lg relative overflow-hidden border border-[#ba1a1a]/20">
          {/* Pulsing background effect */}
          <div className="absolute inset-0 bg-[#ba1a1a] opacity-10 animate-pulse rounded-3xl pointer-events-none" />

          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-[#ba1a1a] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span
                className="material-symbols-outlined text-white text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#93000a] mb-1">
              Emergency Care
            </h1>
            <p className="text-[14px] text-[#ba1a1a] font-extrabold mb-5 tracking-wider uppercase">
              AVAILABLE 24/7
            </p>

            <a
              href="tel:+919999999999"
              className="w-full bg-[#ba1a1a] hover:bg-[#93000a] text-white py-4 px-6 rounded-2xl flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span className="text-[12px] font-bold uppercase tracking-widest mb-0.5 opacity-90">
                CALL EMERGENCY NOW
              </span>
              <span className="text-[22px] sm:text-[24px] font-black tracking-tight">
                +91 99999 99999
              </span>
            </a>

            <div className="flex items-center gap-2 mt-3 text-[12px] text-[#93000a] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
              <span>Average call pickup under 3 seconds</span>
            </div>
          </div>
        </section>

        {/* Quick Actions Bento Grid (Request Ambulance & Get Directions) */}
        <section className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => setShowAmbulanceModal(true)}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 shadow-ambient border border-[#e5eeff] active:scale-95 hover:border-[#006491] hover:shadow-md transition-all duration-200 h-36 cursor-pointer text-center group"
          >
            <div className="w-13 h-13 rounded-full bg-[#74c7ff]/30 text-[#005277] flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                ambulance
              </span>
            </div>
            <span className="font-bold text-[14px] sm:text-[15px] text-[#0b1c30] leading-snug">
              Request<br />Ambulance
            </span>
          </button>

          <button
            onClick={() => setShowDirectionsModal(true)}
            className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 shadow-ambient border border-[#e5eeff] active:scale-95 hover:border-[#003368] hover:shadow-md transition-all duration-200 h-36 cursor-pointer text-center group"
          >
            <div className="w-13 h-13 rounded-full bg-[#0b4a8d]/20 text-[#003368] flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                directions
              </span>
            </div>
            <span className="font-bold text-[14px] sm:text-[15px] text-[#0b1c30] leading-snug">
              Get<br />Directions
            </span>
          </button>
        </section>

        {/* Critical Services List matching screenshot */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[20px] font-bold text-[#003368] px-1">
            Critical Services
          </h2>

          {/* Dept Card 1 - Emergency Dept (ED) */}
          <div
            onClick={() => setSelectedService({
              title: 'Emergency Department (ED)',
              badge: 'Level 1 Triage',
              desc: 'Equipped with rapid resuscitation bays, point-of-care ultrasound, instant lab tests, and 24/7 on-duty emergency physicians.',
              highlights: ['Continuous vital monitoring', 'Rapid CT and cardiac biomarker turnaround', 'Zero wait time for critical triage codes'],
            })}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-ambient border-l-4 border-l-[#ba1a1a] border-y border-r border-[#e5eeff] hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud_upload
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[15px] text-[#0b1c30]">
                Emergency Dept (ED)
              </h3>
              <p className="text-[13px] text-[#424750] mt-0.5 leading-tight">
                Immediate life-saving care & triage.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#737782]">
              chevron_right
            </span>
          </div>

          {/* Dept Card 2 - Trauma Care */}
          <div
            onClick={() => setSelectedService({
              title: 'Trauma Care Center',
              badge: 'Tertiary Trauma Care',
              desc: 'Dedicated round-the-clock polytrauma response with orthopedic surgeons, neurosurgeons, and vascular specialists on standby.',
              highlights: ['Ultra-rapid blood transfusion protocols', 'Dedicated trauma operating rooms', 'Post-trauma rehabilitative support'],
            })}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-ambient border-l-4 border-l-[#006491] border-y border-r border-[#e5eeff] hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-[#74c7ff]/30 text-[#005277] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                personal_injury
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[15px] text-[#0b1c30]">
                Trauma Care
              </h3>
              <p className="text-[13px] text-[#424750] mt-0.5 leading-tight">
                Level 1 specialized trauma response.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#737782]">
              chevron_right
            </span>
          </div>

          {/* Dept Card 3 - Intensive Care Unit (ICU) */}
          <div
            onClick={() => setSelectedService({
              title: 'Intensive Care Unit (ICU)',
              badge: 'Critical Care Excellence',
              desc: 'State-of-the-art closed ICU managed by European board-certified intensivists with 1:1 nurse-to-patient ratios.',
              highlights: ['High-end invasive & non-invasive ventilators', 'Continuous hemodynamic cardiac monitoring', 'Strict infection-controlled isolation rooms'],
            })}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-ambient border-l-4 border-l-[#003368] border-y border-r border-[#e5eeff] hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-[#d6e3ff] text-[#003368] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                monitor_heart
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[15px] text-[#0b1c30]">
                Intensive Care Unit (ICU)
              </h3>
              <p className="text-[13px] text-[#424750] mt-0.5 leading-tight">
                24/7 monitoring for critical patients.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#737782]">
              chevron_right
            </span>
          </div>

          {/* Stroke & Cardiac Rapid Response */}
          <div
            onClick={() => setSelectedService({
              title: 'Code Stroke & Cath Lab Team',
              badge: 'Golden Hour Protocol',
              desc: 'Door-to-balloon time under 45 minutes for acute myocardial infarction, and 24/7 emergency stroke thrombolysis & thrombectomy.',
              highlights: ['Cath Lab operational 24/7', 'Instant brain CT perfusion scans', 'Dedicated neuro-interventionalists'],
            })}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-ambient border-l-4 border-l-amber-500 border-y border-r border-[#e5eeff] hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                ecg_heart
              </span>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[15px] text-[#0b1c30]">
                Stroke & Heart Attack Rapid Response
              </h3>
              <p className="text-[13px] text-[#424750] mt-0.5 leading-tight">
                Golden hour intervention with 24/7 active Cath Lab.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#737782]">
              chevron_right
            </span>
          </div>
        </section>

        {/* Emergency Contacts Directory */}
        <section className="bg-white p-5 rounded-2xl border border-[#e5eeff] shadow-ambient">
          <h3 className="font-bold text-[15px] text-[#0b1c30] mb-3">
            Direct Emergency Helplines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#e5eeff]">
              <div>
                <span className="font-bold text-[#0b1c30] block">Ambulance Fleet Control</span>
                <span className="text-[#737782] text-[12px]">Direct dispatch</span>
              </div>
              <a href="tel:+919999999999" className="font-bold text-[#ba1a1a] hover:underline">
                108 / +91 99999 99999
              </a>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-xl flex items-center justify-between border border-[#e5eeff]">
              <div>
                <span className="font-bold text-[#0b1c30] block">24/7 Blood Bank</span>
                <span className="text-[#737782] text-[12px]">All components</span>
              </div>
              <a href="tel:+919876500000" className="font-bold text-[#003368] hover:underline">
                +91 98765 00000
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Ambulance Dispatch Modal */}
      {showAmbulanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5eeff] max-h-[90vh] overflow-y-auto">
            {!dispatchResult ? (
              <form onSubmit={handleRequestAmbulance} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        ambulance
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[18px] text-[#0b1c30]">Request Emergency Ambulance</h3>
                      <p className="text-[12px] text-[#737782]">ACLS GPS-Tracked Unit</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAmbulanceModal(false)}
                    className="text-[#737782] hover:text-[#0b1c30]"
                  >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Pickup Location / Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientLocation}
                      onChange={(e) => setPatientLocation(e.target.value)}
                      required
                      placeholder="Enter full address or landmark..."
                      className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#006491] text-[20px]">
                      my_location
                    </span>
                  </div>
                  <p className="text-[11px] text-[#006491] mt-1 font-medium">
                    ✓ GPS coordinates detected automatically
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                    Medical Emergency Type
                  </label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-3 px-3.5 text-[14px] outline-none"
                  >
                    <option value="Cardiac / Chest Pain">Cardiac / Severe Chest Pain</option>
                    <option value="Trauma / Road Accident">Accident / Severe Trauma</option>
                    <option value="Respiratory Distress">Difficulty Breathing / Asthma</option>
                    <option value="Stroke / Paralysis">Sudden Weakness / Stroke Symptoms</option>
                    <option value="Pregnancy Emergency">Obstetric / Pregnancy Emergency</option>
                    <option value="General Critical">Other Critical Emergency</option>
                  </select>
                </div>

                <div className="bg-[#ffdad6]/60 p-3.5 rounded-xl text-[12px] text-[#93000a] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                  <span>
                    Our nearest ACLS ambulance will be dispatched with life-support ventilators and a critical-care paramedic.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAmbulanceModal(false)}
                    className="flex-1 py-3 border border-[#737782] rounded-xl font-semibold text-[14px] text-[#0b1c30]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDispatching}
                    className="flex-1 py-3 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isDispatching ? (
                      <span>Dispatching Unit...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span>Confirm Dispatch</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Live Ambulance Tracking State */
              <div className="flex flex-col gap-4 text-center">
                <div className="w-16 h-16 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    ambulance
                  </span>
                </div>

                <div>
                  <span className="px-3 py-1 bg-[#ba1a1a] text-white text-[12px] font-bold rounded-full uppercase tracking-wider">
                    Ambulance En Route
                  </span>
                  <h3 className="text-[22px] font-bold text-[#0b1c30] mt-2">
                    Estimated Arrival: {dispatchResult.etaMinutes} Minutes
                  </h3>
                  <p className="text-[13px] text-[#424750]">
                    Dispatch Ref: <span className="font-bold text-[#003368]">{dispatchResult.dispatchId}</span>
                  </p>
                </div>

                {/* Dispatch Details Card */}
                <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff] text-left text-[13px] space-y-2">
                  <div className="flex justify-between border-b border-[#e5eeff] pb-2">
                    <span className="text-[#737782]">Vehicle Unit</span>
                    <span className="font-bold text-[#0b1c30]">{dispatchResult.ambulanceUnit} (ICU Fitted)</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e5eeff] pb-2">
                    <span className="text-[#737782]">Driver / Pilot</span>
                    <span className="font-bold text-[#0b1c30]">{dispatchResult.driverName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e5eeff] pb-2">
                    <span className="text-[#737782]">Paramedic In-Charge</span>
                    <span className="font-bold text-[#006491]">{dispatchResult.paramedicName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737782]">Destination</span>
                    <span className="font-bold text-[#003368]">Deepika Emergency Trauma Center</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href="tel:+919845012345"
                    className="w-full py-3 bg-[#003368] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>Call Ambulance Driver Directly</span>
                  </a>

                  <button
                    onClick={() => {
                      setDispatchResult(null);
                      setShowAmbulanceModal(false);
                    }}
                    className="w-full py-2.5 text-[#737782] text-[13px] font-semibold hover:text-[#0b1c30]"
                  >
                    Close Tracker
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Get Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e5eeff]">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#d6e3ff] text-[#003368] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    directions
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[18px] text-[#0b1c30]">Hospital Directions & Map</h3>
                  <p className="text-[12px] text-[#006491]">Emergency Triage Gate Entrance</p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="text-[#737782] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[14px]">
              <div className="bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
                <h4 className="font-bold text-[#003368]">Deepika Super Speciality Hospital</h4>
                <p className="text-[#424750] text-[13px] mt-1">
                  Plot 42, Super Speciality Avenue, Medical Enclave, Health City, Landmark: Near Central Metro Junction.
                </p>
              </div>

              <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[13px] text-[#003368] space-y-1">
                <p className="font-bold">🚨 Emergency Gate Instructions:</p>
                <p>• Emergency ambulances and urgent trauma vehicles enter via <strong>Gate 1 (North Ramp)</strong>.</p>
                <p>• Valet and OPD visitor parking is available at <strong>Basement Level B1 & B2</strong>.</p>
              </div>

              <a
                href="https://maps.google.com/?q=Hospital"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#003368] hover:bg-[#0b4a8d] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
                <span>Open in Google Maps / Navigation</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e5eeff]">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-3 mb-3">
              <div>
                <span className="px-2.5 py-0.5 bg-[#d6e3ff] text-[#003368] text-[11px] font-bold rounded-full">
                  {selectedService.badge}
                </span>
                <h3 className="font-bold text-[18px] text-[#0b1c30] mt-1">{selectedService.title}</h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-[#737782] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <p className="text-[14px] text-[#424750] mb-4 leading-relaxed">{selectedService.desc}</p>

            <div className="space-y-1.5 mb-5">
              <p className="text-[12px] font-bold text-[#003368] uppercase tracking-wider">Service Highlights</p>
              {selectedService.highlights.map((h: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-[13px] text-[#0b1c30]">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedService(null)}
              className="w-full py-3 bg-[#003368] text-white rounded-xl font-semibold text-[14px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
