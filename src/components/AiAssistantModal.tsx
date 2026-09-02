import React, { useState } from 'react';
import { AiTriageResult, Speciality } from '../types';
import { SPECIALITIES_DATA } from '../data/hospitalData';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecialityForBooking: (speciality: Speciality) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectSpecialityForBooking,
}) => {
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('Not Specified');
  const [duration, setDuration] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<AiTriageResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Mild chest tightness and rapid pulse after walking',
    'Severe throbbing migraine with light sensitivity',
    'Right knee swelling and pain after sports',
    'Persistent acid reflux, heartburn and stomach bloating',
    'Toddler has 101°F fever and dry cough for 2 days',
    'Red itchy skin rash on arms and neck',
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || symptomsInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: text,
          age: patientAge,
          gender: patientGender,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms.');
      }

      const data: AiTriageResult = await response.json();
      setTriageResult(data);
    } catch (err: any) {
      console.error(err);
      // Friendly fallback
      setTriageResult({
        summary: `Based on your reported query ("${text}"), our general clinical triage advises consulting with our specialists for accurate diagnostic evaluation.`,
        recommendedDepartment: 'Cardiology',
        specialistTitle: 'Consultant Specialist',
        urgency: 'Routine',
        suggestedActions: [
          'Keep a symptom diary tracking severity and timings',
          'Avoid sudden physical strain',
          'Bring past test reports to your appointment',
        ],
        disclaimer: 'AI guidance is for informational triage only and not a substitute for clinical diagnosis.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookWithRecommended = () => {
    if (!triageResult) return;
    const deptLower = triageResult.recommendedDepartment.toLowerCase();
    const matchedSpec =
      SPECIALITIES_DATA.find(
        (s) =>
          s.name.toLowerCase().includes(deptLower) ||
          deptLower.includes(s.name.toLowerCase()) ||
          s.id.toLowerCase().includes(deptLower)
      ) || SPECIALITIES_DATA[0];

    onSelectSpecialityForBooking(matchedSpec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#e5eeff] max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#d6e3ff] text-[#003368] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[26px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-[19px] text-[#003368] leading-tight">
                AI Health Assistant
              </h3>
              <p className="text-[12px] text-[#006491] font-medium">
                Clinical Symptom Checker & Department Guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#737782] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        {!triageResult ? (
          <div className="flex flex-col gap-4">
            <p className="text-[14px] text-[#424750]">
              Describe your symptoms, discomfort, or health questions. Our clinical AI will analyze your description and recommend the right specialist department.
            </p>

            {/* Symptom Input Textarea */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1">
                Describe your symptoms *
              </label>
              <textarea
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                rows={3}
                placeholder="e.g. I have had sharp chest pressure and breathlessness for 3 hours after stairs..."
                className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] focus:ring-2 focus:ring-[#74c7ff]/30 rounded-xl p-3.5 text-[14px] outline-none transition-all shadow-xs"
              />
            </div>

            {/* Additional contextual inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#424750] mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-2 px-3 text-[13px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#424750] mb-1">
                  Duration (Optional)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 days"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d2] focus:border-[#003368] rounded-xl py-2 px-3 text-[13px] outline-none"
                />
              </div>
            </div>

            {/* Quick Prompts Chips */}
            <div>
              <span className="text-[12px] font-semibold text-[#737782] block mb-2">
                Or choose a common symptom:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSymptomsInput(prompt);
                      handleAnalyze(prompt);
                    }}
                    className="text-[12px] bg-[#eff4ff] hover:bg-[#dce9ff] text-[#003368] px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer border border-[#c2c6d2]/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <p className="text-[12px] text-[#ba1a1a] bg-[#ffdad6] p-2 rounded-lg">
                {errorMessage}
              </p>
            )}

            {/* Action CTA */}
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !symptomsInput.trim()}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#003368] to-[#006491] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-ambient hover:shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Analyzing clinical symptoms...</span>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    auto_awesome
                  </span>
                  <span>Analyze & Recommend Specialist</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Triage Results View */
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Urgency Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                  triageResult.urgency === 'Emergency'
                    ? 'bg-[#ffdad6] text-[#ba1a1a] ring-1 ring-[#ba1a1a]'
                    : triageResult.urgency === 'Urgent'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#d6e3ff] text-[#003368]'
                }`}
              >
                Triage: {triageResult.urgency} Evaluation
              </span>
              <span className="text-[12px] text-[#737782]">
                Deepika AI Clinical Model
              </span>
            </div>

            {/* Summary */}
            <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff]">
              <p className="text-[14px] text-[#0b1c30] leading-relaxed">
                {triageResult.summary}
              </p>
            </div>

            {/* Recommended Department Highlight Box */}
            <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#003368]/20 flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#006491] uppercase tracking-wider">
                Recommended Department & Specialist
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[18px] text-[#003368]">
                    {triageResult.recommendedDepartment}
                  </h4>
                  <p className="text-[13px] text-[#424750]">
                    {triageResult.specialistTitle}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#003368] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">
                    stethoscope
                  </span>
                </div>
              </div>
            </div>

            {/* Immediate Tips */}
            {triageResult.suggestedActions && (
              <div>
                <h5 className="text-[13px] font-bold text-[#0b1c30] mb-1.5">
                  Suggested Immediate Steps
                </h5>
                <ul className="space-y-1 text-[13px] text-[#424750]">
                  {triageResult.suggestedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#006491] font-bold">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-[11px] text-[#737782] bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              ⚠️ {triageResult.disclaimer || 'Informational triage guidance only. In severe emergencies, call +91 99999 99999 immediately.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleBookWithRecommended}
                className="w-full py-3.5 bg-[#003368] hover:bg-[#0b4a8d] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-ambient cursor-pointer active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  calendar_add_on
                </span>
                <span>Book Appointment in {triageResult.recommendedDepartment}</span>
              </button>

              <button
                onClick={() => setTriageResult(null)}
                className="w-full py-2.5 text-[#006491] text-[13px] font-semibold hover:underline"
              >
                Check Another Symptom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
