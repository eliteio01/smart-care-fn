export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'note' | 'lab_result' | 'prescription' | 'imaging';
  title: string;
  content: string;
  encryptedContent: string;
  date: string;
  uploadedBy: string;
  fileUrl?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string;
  lastVisit?: string;
  nextAppointment?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export const generateMockPatients = (): Patient[] => {
  return [
    {
      id: "P001",
      firstName: "John",
      lastName: "Smith",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      phone: "+1-555-0101",
      email: "john.smith@email.com",
      address: "123 Main St, New York, NY 10001",
      bloodType: "O+",
      allergies: "Penicillin",
      lastVisit: "2025-01-15",
      nextAppointment: "2025-02-20",
      riskLevel: "low"
    },
    {
      id: "P002",
      firstName: "Sarah",
      lastName: "Johnson",
      dateOfBirth: "1978-07-22",
      gender: "Female",
      phone: "+1-555-0102",
      email: "sarah.j@email.com",
      address: "456 Oak Ave, Los Angeles, CA 90001",
      bloodType: "A+",
      allergies: "None",
      lastVisit: "2025-01-18",
      nextAppointment: "2025-02-15",
      riskLevel: "medium"
    },
    {
      id: "P003",
      firstName: "Michael",
      lastName: "Davis",
      dateOfBirth: "1992-11-08",
      gender: "Male",
      phone: "+1-555-0103",
      email: "m.davis@email.com",
      address: "789 Pine Rd, Chicago, IL 60601",
      bloodType: "B+",
      allergies: "Latex, Aspirin",
      lastVisit: "2025-01-20",
      nextAppointment: "2025-03-01",
      riskLevel: "low"
    },
    {
      id: "P004",
      firstName: "Emily",
      lastName: "Brown",
      dateOfBirth: "1965-05-30",
      gender: "Female",
      phone: "+1-555-0104",
      email: "emily.brown@email.com",
      address: "321 Elm St, Houston, TX 77001",
      bloodType: "AB+",
      allergies: "Shellfish",
      lastVisit: "2025-01-12",
      nextAppointment: "2025-02-10",
      riskLevel: "high"
    },
    {
      id: "P005",
      firstName: "David",
      lastName: "Wilson",
      dateOfBirth: "1988-09-17",
      gender: "Male",
      phone: "+1-555-0105",
      email: "d.wilson@email.com",
      address: "654 Maple Dr, Phoenix, AZ 85001",
      bloodType: "O-",
      allergies: "Peanuts",
      lastVisit: "2025-01-22",
      nextAppointment: "2025-02-25",
      riskLevel: "medium"
    }
  ];
};

export const generateMockRecords = (): MedicalRecord[] => {
  return [
    {
      id: "R001",
      patientId: "P001",
      type: "note",
      title: "Annual Physical Examination",
      content: "Patient presents for routine annual physical. Vitals stable. No acute concerns noted.",
      encryptedContent: "",
      date: "2025-01-15",
      uploadedBy: "Dr. Anderson"
    },
    {
      id: "R002",
      patientId: "P001",
      type: "lab_result",
      title: "Blood Work - Complete Panel",
      content: "Complete blood count and metabolic panel. All values within normal range.",
      encryptedContent: "",
      date: "2025-01-10",
      uploadedBy: "Lab Tech"
    },
    {
      id: "R003",
      patientId: "P002",
      type: "prescription",
      title: "Blood Pressure Medication",
      content: "Lisinopril 10mg, once daily. 30-day supply with 2 refills.",
      encryptedContent: "",
      date: "2025-01-18",
      uploadedBy: "Dr. Martinez"
    },
    {
      id: "R004",
      patientId: "P003",
      type: "imaging",
      title: "Chest X-Ray",
      content: "Routine chest x-ray. No abnormalities detected. Lungs clear.",
      encryptedContent: "",
      date: "2025-01-20",
      uploadedBy: "Radiology Dept"
    },
    {
      id: "R005",
      patientId: "P004",
      type: "note",
      title: "Follow-up Visit - Diabetes Management",
      content: "Blood sugar levels improving with current medication. Patient demonstrates good understanding of diet modifications.",
      encryptedContent: "",
      date: "2025-01-12",
      uploadedBy: "Dr. Chen"
    }
  ];
};

export const getPatientStats = () => {
  const patients = JSON.parse(localStorage.getItem("patients") || "[]");
  const records = JSON.parse(localStorage.getItem("medicalRecords") || "[]");

  return {
    totalPatients: patients.length,
    totalRecords: records.length,
    highRiskPatients: patients.filter((p: Patient) => p.riskLevel === 'high').length,
    recentVisits: patients.filter((p: Patient) => {
      if (!p.lastVisit) return false;
      const lastVisit = new Date(p.lastVisit);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastVisit > weekAgo;
    }).length,
    upcomingAppointments: patients.filter((p: Patient) => {
      if (!p.nextAppointment) return false;
      const appointment = new Date(p.nextAppointment);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return appointment <= nextWeek && appointment >= new Date();
    }).length
  };
};
