// Mock AI service for patient history summarization
export const generatePatientSummary = async (patientId: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const summaries = [
    "Patient shows consistent improvement in cardiovascular health. Blood pressure readings have stabilized over the past 6 months. Recommended continuation of current medication with quarterly follow-ups.",
    "Chronic condition management is progressing well. Patient demonstrates good medication adherence. Recent lab results indicate improved metabolic markers. No adverse reactions reported.",
    "Patient history indicates seasonal allergy patterns. Respiratory function tests show normal range. Previous treatment protocols have been effective. Consider preventive measures for upcoming season.",
    "Overall health status is stable. Patient maintains healthy lifestyle choices. Recent screenings show no concerning developments. Annual comprehensive check-up recommended.",
    "Treatment response has been positive. Pain management protocol is effective. Physical therapy sessions showing measurable improvement. Continue current care plan with bi-weekly monitoring."
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};

export const detectAnomalies = async (patientData: any): Promise<{
  hasAnomalies: boolean;
  anomalies: Array<{ type: string; severity: 'low' | 'medium' | 'high'; description: string }>;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const possibleAnomalies = [
    { type: "Blood Pressure", severity: "medium" as const, description: "BP reading significantly higher than baseline" },
    { type: "Lab Results", severity: "low" as const, description: "Slight elevation in cholesterol levels" },
    { type: "Medication", severity: "high" as const, description: "Potential drug interaction detected" },
    { type: "Vital Signs", severity: "low" as const, description: "Minor fluctuation in heart rate pattern" },
    { type: "Visit Frequency", severity: "medium" as const, description: "Unusual increase in emergency visits" }
  ];
  
  // Random chance of anomalies
  const hasAnomalies = Math.random() > 0.6;
  const anomalyCount = hasAnomalies ? Math.floor(Math.random() * 3) + 1 : 0;
  const anomalies = hasAnomalies 
    ? possibleAnomalies.sort(() => Math.random() - 0.5).slice(0, anomalyCount)
    : [];
  
  return { hasAnomalies, anomalies };
};
