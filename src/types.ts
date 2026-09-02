export interface Speciality {
  id: string;
  name: string;
  icon: string;
  description: string;
  doctorCount: number;
  popularSymptoms: string[];
  departmentCode: string;
  floor: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  degrees: string[];
  consultationFee: number;
  bio: string;
  languages: string[];
  availableToday: boolean;
  nextSlot: string;
  roomNumber: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

export interface PatientAppointment {
  id: string;
  bookingCode: string;
  doctor: Doctor;
  speciality: Speciality;
  date: string;
  timeSlot: string;
  consultationType: 'in-person' | 'video';
  patient: {
    fullName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email: string;
    symptoms: string;
    isExistingPatient: boolean;
    mrnNumber?: string;
  };
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  totalFee: number;
  createdAt: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  tag: string;
  price: number;
  originalPrice: number;
  description: string;
  testCount: number;
  inclusions: string[];
  testsIncluded?: string[];
  duration?: string;
  preparation?: string;
  recommendedFor: string;
  fastingRequired: boolean;
  popular: boolean;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  price: number;
  reportTurnaround: string;
  reportTime?: string;
  homeCollectionAvailable?: boolean;
  fastingRequired: boolean;
  sampleType: string;
  description: string;
  popular: boolean;
}

export interface AiTriageResult {
  summary: string;
  recommendedDepartment: string;
  specialistTitle: string;
  urgency: 'Emergency' | 'Urgent' | 'Routine';
  urgencyReason?: string;
  suggestedActions: string[];
  keyQuestionsForDoctor?: string[];
  disclaimer?: string;
}
