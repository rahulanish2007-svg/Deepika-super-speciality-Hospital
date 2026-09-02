import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Symptom Analysis & Department Guidance API
app.post('/api/ai/symptom-checker', async (req, res) => {
  try {
    const { symptoms, age, gender, duration } = req.body;

    if (!symptoms || typeof symptoms !== 'string') {
      res.status(400).json({ error: 'Symptoms description is required.' });
      return;
    }

    if (ai) {
      const prompt = `You are an expert AI Clinical Triage Assistant for Deepika Super Speciality Hospital.
Patient Details:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms Description: "${symptoms}"
- Duration: ${duration || 'Not specified'}

Hospital Departments available for booking:
1. Cardiology (Heart, chest pain, palpitations, hypertension, shortness of breath on exertion)
2. Neurology (Headaches, migraines, dizziness, numbness, seizures, nerve pain, stroke symptoms)
3. Orthopedics (Bone fractures, joint pain, back/neck pain, sports injuries, arthritis)
4. Pediatrics (Child healthcare, infant fever, vaccinations, growth & development)
5. Gastroenterology (Stomach pain, acid reflux, digestion issues, liver, ulcers)
6. Pulmonology (Cough, asthma, bronchitis, breathing difficulty, lung conditions)
7. Dermatology (Skin rashes, eczema, hair loss, allergies, infections)
8. Oncology (Cancer screening, tumor consult, oncology second opinions)
9. Nephrology & Urology (Kidney stones, urinary tract symptoms, renal care)
10. Emergency Medicine (Severe chest pressure, sudden paralysis, severe trauma, uncontrollable bleeding, loss of consciousness)

Analyze the symptoms and provide structured guidance. Categorize urgency as 'Emergency', 'Urgent', or 'Routine'. Recommend the single most appropriate primary department and doctor speciality. Include reassuring clinical context and immediate guidance.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'A 1-2 sentence empathetic assessment of the reported symptoms.',
              },
              recommendedDepartment: {
                type: Type.STRING,
                description: 'The exact hospital department name (e.g., Cardiology, Neurology, Orthopedics, Pediatrics, Gastroenterology, Pulmonology, Dermatology, Oncology, Nephrology, Emergency Medicine).',
              },
              specialistTitle: {
                type: Type.STRING,
                description: 'Recommended specialist type (e.g., Sr. Consultant Cardiologist, Neurologist, Orthopedic Surgeon).',
              },
              urgency: {
                type: Type.STRING,
                description: 'Emergency, Urgent, or Routine',
              },
              urgencyReason: {
                type: Type.STRING,
                description: 'Why this urgency level was selected.',
              },
              suggestedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 practical immediate homecare or preparatory steps before doctor consultation.',
              },
              keyQuestionsForDoctor: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 questions the patient can ask their specialist.',
              },
              disclaimer: {
                type: Type.STRING,
                description: 'Standard medical disclaimer note.',
              },
            },
            required: ['summary', 'recommendedDepartment', 'specialistTitle', 'urgency', 'suggestedActions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
      return;
    }

    // Smart Fallback Rule-based triage if no Gemini key
    const lower = symptoms.toLowerCase();
    let dept = 'Cardiology';
    let title = 'Sr. Consultant Cardiologist';
    let urgency = 'Routine';
    let reason = 'Specialist clinical consultation recommended for accurate diagnosis.';

    if (lower.includes('chest') || lower.includes('heart') || lower.includes('palpitation') || lower.includes('bp') || lower.includes('pressure in chest')) {
      dept = 'Cardiology';
      title = 'Sr. Consultant Cardiologist';
      urgency = lower.includes('severe') || lower.includes('radiating') || lower.includes('crushing') ? 'Emergency' : 'Urgent';
      reason = 'Cardiovascular symptoms warrant timely evaluation to rule out acute ischemia or arrhythmia.';
    } else if (lower.includes('headache') || lower.includes('migraine') || lower.includes('dizz') || lower.includes('numb') || lower.includes('seizure') || lower.includes('memory')) {
      dept = 'Neurology';
      title = 'Sr. Consultant Neurologist';
      urgency = lower.includes('sudden') || lower.includes('paralysis') || lower.includes('worst headache') ? 'Emergency' : 'Routine';
      reason = 'Neurological symptoms benefit from thorough specialized neural examination.';
    } else if (lower.includes('knee') || lower.includes('bone') || lower.includes('fracture') || lower.includes('joint') || lower.includes('back pain') || lower.includes('spine') || lower.includes('shoulder')) {
      dept = 'Orthopedics';
      title = 'Consultant Orthopedic Surgeon';
      urgency = lower.includes('cannot walk') || lower.includes('fall') ? 'Urgent' : 'Routine';
      reason = 'Musculoskeletal examination and imaging will determine optimal joint or spinal therapy.';
    } else if (lower.includes('child') || lower.includes('baby') || lower.includes('infant') || lower.includes('pediatric') || (age && parseInt(age, 10) < 14)) {
      dept = 'Pediatrics';
      title = 'Senior Consultant Pediatrician';
      urgency = lower.includes('high fever') ? 'Urgent' : 'Routine';
      reason = 'Pediatric specialists provide gentle, age-tailored diagnostics and care.';
    } else if (lower.includes('stomach') || lower.includes('gut') || lower.includes('acid') || lower.includes('vomit') || lower.includes('diarrhea') || lower.includes('liver')) {
      dept = 'Gastroenterology';
      title = 'Consultant Gastroenterologist';
      urgency = lower.includes('blood') ? 'Urgent' : 'Routine';
      reason = 'Gastrointestinal evaluation will pinpoint abdominal distress origins.';
    } else if (lower.includes('cough') || lower.includes('breath') || lower.includes('asthma') || lower.includes('wheez') || lower.includes('lung')) {
      dept = 'Pulmonology';
      title = 'Pulmonary Medicine Specialist';
      urgency = lower.includes('shortness of breath') ? 'Urgent' : 'Routine';
      reason = 'Respiratory function assessment helps optimize airways and oxygenation.';
    } else if (lower.includes('skin') || lower.includes('rash') || lower.includes('itch') || lower.includes('acne') || lower.includes('allergy')) {
      dept = 'Dermatology';
      title = 'Consultant Dermatologist';
      urgency = 'Routine';
      reason = 'Dermatological assessment allows targeted topical and systemic skin care.';
    }

    res.json({
      summary: `Based on your reported symptoms (${symptoms.slice(0, 80)}...), we recommend an evaluation with our ${dept} department.`,
      recommendedDepartment: dept,
      specialistTitle: title,
      urgency,
      urgencyReason: reason,
      suggestedActions: [
        'Keep a record of when symptoms occur and what triggers them',
        'Avoid strenuous physical exertion until your consultation',
        'Bring any prior test reports or prescription medications to your appointment',
        'If symptoms suddenly worsen or become severe, call our 24/7 Emergency Line immediately (+91 99999 99999)',
      ],
      keyQuestionsForDoctor: [
        'Are there specific diagnostic tests (such as ECG, ECHO, MRI, or Blood tests) required for my condition?',
        'What immediate lifestyle or dietary adjustments should I make while undergoing evaluation?',
      ],
      disclaimer: 'AI Health Assistant provides informational triage guidance and is not a formal medical diagnosis. In case of severe emergency, call our emergency department immediately.',
    });
  } catch (error: any) {
    console.error('Symptom checker error:', error);
    res.status(500).json({
      summary: 'We encountered a processing error. However, based on general hospital protocol, our customer care is ready to assist you.',
      recommendedDepartment: 'Cardiology',
      specialistTitle: 'Consultant Specialist',
      urgency: 'Routine',
      urgencyReason: 'Direct clinical consultation recommended.',
      suggestedActions: ['Select your preferred department and book a convenient slot.'],
      disclaimer: 'For critical health emergencies, please call +91 99999 99999 immediately.',
    });
  }
});

// Emergency Ambulance Dispatch Simulation API
app.post('/api/emergency/dispatch', (req, res) => {
  const { patientName, location, contactNumber, conditionType } = req.body;
  const dispatchId = `AMB-${Math.floor(100000 + Math.random() * 900000)}`;
  const etaMinutes = Math.floor(6 + Math.random() * 6); // 6 - 11 mins
  const unitNumber = `ICU-AMB-${Math.floor(10 + Math.random() * 90)}`;
  const driverName = ['Rajesh Sharma', 'Vikram Singh', 'Manoj Kumar', 'Arun Varma'][Math.floor(Math.random() * 4)];
  const paramedicName = ['Sister Deepa R.', 'Nurse Anjali M.', 'Paramedic Sunil K.'][Math.floor(Math.random() * 3)];

  res.json({
    success: true,
    dispatchId,
    status: 'DISPATCHED',
    etaMinutes,
    ambulanceUnit: unitNumber,
    driverName,
    driverContact: '+91 98450 12345',
    paramedicName,
    equipment: ['Advanced Cardiac Life Support (ACLS)', 'Ventilator', 'Defibrillator', 'Oxygen Saturation Monitor'],
    hospitalDestination: 'Deepika Super Speciality - Trauma & Emergency Center',
    destinationAddress: 'Plot 42, Super Speciality Ave, Medical Enclave',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
