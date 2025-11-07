import { generateMockPatients, generateMockRecords } from "./mockData";
import { encryptData } from "./encryption";

export const initializeAppData = () => {
  // Initialize patients if not exists
  if (!localStorage.getItem("patients")) {
    const patients = generateMockPatients();
    localStorage.setItem("patients", JSON.stringify(patients));
  }

  // Initialize medical records if not exists
  if (!localStorage.getItem("medicalRecords")) {
    const records = generateMockRecords();
    const encryptedRecords = records.map(record => ({
      ...record,
      encryptedContent: encryptData(record.content)
    }));
    localStorage.setItem("medicalRecords", JSON.stringify(encryptedRecords));
  }
};
