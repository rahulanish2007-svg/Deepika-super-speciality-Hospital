/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { HomeScreen } from './components/HomeScreen';
import { BookAppointmentWizard } from './components/BookAppointmentWizard';
import { EmergencyScreen } from './components/EmergencyScreen';
import { FindDoctorScreen } from './components/FindDoctorScreen';
import { SpecialitiesScreen } from './components/SpecialitiesScreen';
import { HealthPackagesScreen } from './components/HealthPackagesScreen';
import { DiagnosticsScreen } from './components/DiagnosticsScreen';
import { MyAppointmentsScreen } from './components/MyAppointmentsScreen';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';
import { Speciality, Doctor, PatientAppointment } from './types';
import { SPECIALITIES_DATA, DOCTORS_DATA } from './data/hospitalData';

const INITIAL_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'APT-INIT-1',
    bookingCode: 'DPK-91823',
    doctor: DOCTORS_DATA[0],
    speciality: SPECIALITIES_DATA[0],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:15 AM',
    consultationType: 'in-person',
    patient: {
      fullName: 'Rahul Sharma',
      age: 36,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      symptoms: 'Routine cardiovascular wellness screening and blood pressure review',
      isExistingPatient: true,
      mrnNumber: 'DPK-MRN-1849',
    },
    status: 'Confirmed',
    totalFee: 1200,
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Wizard state parameters
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardSpeciality, setWizardSpeciality] = useState<Speciality | null>(null);
  const [wizardDoctor, setWizardDoctor] = useState<Doctor | null>(null);

  // Appointments state with localStorage persistence
  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('deepika_appointments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('deepika_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  // Scroll to top on view changes
  const handleNavigate = (view: string, data?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'book-wizard') {
      if (data?.step) setWizardStep(data.step);
      else setWizardStep(1);

      if (data?.speciality) setWizardSpeciality(data.speciality);
      if (data?.doctor) setWizardDoctor(data.doctor);
    }

    setCurrentView(view);
  };

  const handleAppointmentBooked = (newApt: PatientAppointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' } : apt))
    );
  };

  const handleSelectSpecialityForBooking = (speciality: Speciality) => {
    setWizardSpeciality(speciality);
    const doc = DOCTORS_DATA.find((d) => d.departmentId === speciality.id) || DOCTORS_DATA[0];
    setWizardDoctor(doc);
    setWizardStep(2);
    setCurrentView('book-wizard');
  };

  const handleSelectDoctorForBooking = (doctor: Doctor) => {
    setWizardDoctor(doctor);
    const spec = SPECIALITIES_DATA.find((s) => s.id === doctor.departmentId) || SPECIALITIES_DATA[0];
    setWizardSpeciality(spec);
    setWizardStep(3);
    setCurrentView('book-wizard');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#191c20] font-sans flex flex-col selection:bg-[#d6e3ff] selection:text-[#003368]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenMenu={() => setIsDrawerOpen(true)}
        onNavigateEmergency={() => handleNavigate('emergency')}
        onNavigateHome={() => handleNavigate('home')}
        onOpenAppointments={() => handleNavigate('my-appointments')}
        appointmentCount={appointments.filter((a) => a.status === 'Confirmed').length}
      />

      {/* Slideout Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        appointmentCount={appointments.filter((a) => a.status === 'Confirmed').length}
      />

      {/* AI Health Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectSpecialityForBooking={handleSelectSpecialityForBooking}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {currentView === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onSelectSpeciality={handleSelectSpecialityForBooking}
            onSelectDoctor={handleSelectDoctorForBooking}
          />
        )}

        {currentView === 'book-wizard' && (
          <BookAppointmentWizard
            key={`${wizardStep}-${wizardSpeciality?.id || ''}-${wizardDoctor?.id || ''}`}
            initialStep={wizardStep}
            initialSpeciality={wizardSpeciality}
            initialDoctor={wizardDoctor}
            onNavigateHome={() => handleNavigate('home')}
            onAppointmentBooked={handleAppointmentBooked}
          />
        )}

        {currentView === 'emergency' && (
          <EmergencyScreen
            onNavigateBack={() => handleNavigate('home')}
            onBookAppointment={() => handleNavigate('book-wizard')}
          />
        )}

        {currentView === 'find-doctor' && (
          <FindDoctorScreen
            onSelectDoctorToBook={handleSelectDoctorForBooking}
            onNavigateBack={() => handleNavigate('home')}
          />
        )}

        {currentView === 'specialities' && (
          <SpecialitiesScreen
            onSelectSpeciality={handleSelectSpecialityForBooking}
            onNavigateBack={() => handleNavigate('home')}
          />
        )}

        {currentView === 'health-packages' && (
          <HealthPackagesScreen
            onNavigateBack={() => handleNavigate('home')}
            onBookPackage={(pkg) => {
              console.log('Booked package:', pkg);
            }}
          />
        )}

        {currentView === 'diagnostics' && (
          <DiagnosticsScreen onNavigateBack={() => handleNavigate('home')} />
        )}

        {currentView === 'my-appointments' && (
          <MyAppointmentsScreen
            appointments={appointments}
            onBookNew={() => handleNavigate('book-wizard')}
            onCancelAppointment={handleCancelAppointment}
            onNavigateBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Hospital Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
