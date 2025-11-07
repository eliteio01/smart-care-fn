import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Search,
  User,
  Shield,
  Cloud,
  CloudOff,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveAndSync, getSyncStatus } from "@/utils/storage";
import { generateMockPatients } from "@/utils/mockData";

interface Patient {
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
  riskLevel?: "low" | "medium" | "high";
}

const PatientManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const userRole = localStorage.getItem("userRole");

  let basePath = "/record-management";

  if (userRole === "admin") basePath = "/admin/records";
  else if (userRole === "nurse") basePath = "/nurse/records";

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Load patients from localStorage or generate mock data
    const stored = localStorage.getItem("patients");
    if (stored) {
      setPatients(JSON.parse(stored));
    } else {
      // Initialize with mock data
      const mockPatients = generateMockPatients();
      setPatients(mockPatients);
      localStorage.setItem("patients", JSON.stringify(mockPatients));
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: Date.now().toString(),
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender || "",
      phone: formData.phone || "",
      email: formData.email || "",
      address: formData.address || "",
      bloodType: formData.bloodType || "",
      allergies: formData.allergies || "",
    };

    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    await saveAndSync("patients", updatedPatients);

    toast({
      title: "Success",
      description: "Patient registered successfully",
    });

    setFormData({});
    setIsDialogOpen(false);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase())
  );

  const syncStatus = getSyncStatus();

  const getRiskBadgeColor = (risk?: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Patient Registry Management</h1>
              <p className="text-xs text-muted-foreground">
                Registered Patients: {patients.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus.status === "synced" ? (
              <Badge variant="outline" className="gap-1">
                <Cloud className="h-3 w-3" />
                Synced
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <CloudOff className="h-3 w-3" />
                {syncStatus.status}
              </Badge>
            )}
            <Badge variant="outline" className="hidden md:inline-flex">
              <User className="h-3 w-3 mr-1" />
              {userRole === "admin" ? "Administrator" : "Healthcare Staff"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Register Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  Register New Patient
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Input
                      id="gender"
                      required
                      value={formData.gender || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input
                      id="bloodType"
                      value={formData.bloodType || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, bloodType: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, allergies: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register Patient
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="p-6 hover:shadow-lg transition-all border cursor-pointer hover:scale-105"
              onClick={() =>
                navigate(
                  `${basePath}?patientId=${
                    patient.id
                  }&patientName=${encodeURIComponent(
                    `${patient.firstName}${patient.lastName}`
                  )}`
                )
              }
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    {patient.riskLevel && (
                      <Badge
                        className={`text-xs ${getRiskBadgeColor(
                          patient.riskLevel
                        )}`}
                      >
                        {patient.riskLevel}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">DOB:</span>{" "}
                      {patient.dateOfBirth}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Blood:</span>{" "}
                      {patient.bloodType || "N/A"}
                    </p>
                    {patient.phone && (
                      <p className="text-sm text-muted-foreground truncate">
                        {patient.phone}
                      </p>
                    )}
                    {patient.lastVisit && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                        <Activity className="h-3 w-3" />
                        Last visit:{" "}
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card className="text-center py-16 border-2 border-dashed">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">
              No patients found
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by registering a new patient
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PatientManagement;
