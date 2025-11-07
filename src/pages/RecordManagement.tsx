import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  FileText,
  Lock,
  Shield,
  User,
  Sparkles,
  AlertTriangle,
  Cloud,
  CloudOff,
  Search,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { encryptData, decryptData } from "@/utils/encryption";
import { generatePatientSummary, detectAnomalies } from "@/services/aiService";
import { saveAndSync, getSyncStatus } from "@/utils/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: "note" | "lab" | "prescription";
  title: string;
  content: string;
  encryptedContent: string;
  date: string;
  uploadedBy: string;
}

interface PatientRecordGroup {
  patientId: string;
  patientName: string;
  records: MedicalRecord[];
  totalRecords: number;
}

interface RecordDetailView {
  record: MedicalRecord;
  patientName: string;
}

const RecordManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatientRecords, setSelectedPatientRecords] =
    useState<PatientRecordGroup | null>(null);
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({});
  const [selectedPatientForSummary, setSelectedPatientForSummary] = useState<
    string | null
  >(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecordDetail, setSelectedRecordDetail] =
    useState<RecordDetailView | null>(null);
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

    // Load records and patients
    const storedRecords = localStorage.getItem("medicalRecords");
    const storedPatients = localStorage.getItem("patients");

    if (storedRecords) setRecords(JSON.parse(storedRecords));
    if (storedPatients) setPatients(JSON.parse(storedPatients));

    // Check if we should auto-open a patient's records from URL params
    const patientId = searchParams.get("patientId");
    const patientName = searchParams.get("patientName");
    if (patientId && storedRecords) {
      const allRecords = JSON.parse(storedRecords);
      const patientRecords = allRecords.filter(
        (r: MedicalRecord) => r.patientId === patientId
      );
      if (patientRecords.length > 0) {
        setSelectedPatientRecords({
          patientId,
          patientName: patientName || patientRecords[0].patientName,
          records: patientRecords,
          totalRecords: patientRecords.length,
        });
      }
    }
  }, [navigate, searchParams]);

  const handleGenerateSummary = async (patientId: string) => {
    setIsGeneratingSummary(true);
    setSelectedPatientForSummary(patientId);
    try {
      const summary = await generatePatientSummary(patientId);
      setAiSummary(summary);
      toast({
        title: "AI Summary Generated",
        description: "Patient history has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI summary",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleDetectAnomalies = async (patientId: string) => {
    try {
      const result = await detectAnomalies({ patientId });
      setAnomalies(result.anomalies);
      if (result.hasAnomalies) {
        toast({
          title: "Anomalies Detected",
          description: `Found ${result.anomalies.length} potential issues`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Anomalies",
          description: "Patient data appears normal",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to detect anomalies",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patientId ||
      !formData.type ||
      !formData.title ||
      !formData.content
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const patient = patients.find((p) => p.id === formData.patientId);
    const userEmail = localStorage.getItem("userEmail") || "Unknown";

    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: patient
        ? `${patient.firstName} ${patient.lastName}`
        : "Unknown",
      type: formData.type as any,
      title: formData.title,
      content: formData.content,
      encryptedContent: encryptData(formData.content),
      date: new Date().toISOString(),
      uploadedBy: userEmail,
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    await saveAndSync("medicalRecords", updatedRecords);

    toast({
      title: "Success",
      description: "Medical record added and encrypted successfully",
    });

    setFormData({});
    setIsDialogOpen(false);
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case "note":
        return "Medical Note";
      case "lab":
        return "Lab Result";
      case "prescription":
        return "Prescription";
      default:
        return type;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "text-primary";
      case "lab":
        return "text-green-600";
      case "prescription":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  // Group records by patient
  const groupedRecords: PatientRecordGroup[] = records.reduce(
    (acc: PatientRecordGroup[], record) => {
      const existingGroup = acc.find(
        (group) => group.patientId === record.patientId
      );

      if (existingGroup) {
        existingGroup.records.push(record);
        existingGroup.totalRecords = existingGroup.records.length;
      } else {
        acc.push({
          patientId: record.patientId,
          patientName: record.patientName,
          records: [record],
          totalRecords: 1,
        });
      }

      return acc;
    },
    []
  );

  const filteredGroupedRecords = groupedRecords.filter(
    (group) =>
      group.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.records.some((record) =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const syncStatus = getSyncStatus();

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
              <h1 className="text-xl font-bold">Medical Records Management</h1>
              <p className="text-xs text-muted-foreground">
                Total Records: {records.length} • All Data Encrypted
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
        {anomalies.length > 0 && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <strong>Anomalies Detected:</strong> {anomalies.length} potential
              issues found.
              {anomalies.map((anomaly, idx) => (
                <div key={idx} className="mt-2 text-sm">
                  <Badge variant="outline" className="mr-2">
                    {anomaly.severity}
                  </Badge>
                  {anomaly.type}: {anomaly.description}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm bg-primary/5 px-4 py-2 rounded-lg border border-primary/20">
            <Lock className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">
              End-to-End Encryption Active
            </span>
          </div>

          <div className="flex gap-2">
            {userRole === "admin" && (
              <Button
                variant="outline"
                onClick={() => {
                  const patientId = records[0]?.patientId;
                  if (patientId) handleDetectAnomalies(patientId);
                }}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Detect Anomalies
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">
                    Add Encrypted Medical Record
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient *</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, patientId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Record Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Medical Note</SelectItem>
                        <SelectItem value="lab">Lab Result</SelectItem>
                        <SelectItem value="prescription">
                          Prescription
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g., Annual Checkup Notes"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      required
                      rows={8}
                      value={formData.content || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Enter medical notes, lab results, or prescription details..."
                    />
                    <p className="text-xs text-muted-foreground">
                      This content will be encrypted before storage
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Add Encrypted Record
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or record title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroupedRecords.map((group) => (
            <Card
              key={group.patientId}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary hover:scale-105"
              onClick={() => setSelectedPatientRecords(group)}
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">
                      {group.patientName} Records
                    </h3>
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      {group.totalRecords}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {group.totalRecords} medical{" "}
                    {group.totalRecords === 1 ? "record" : "records"}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Records
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredGroupedRecords.length === 0 && records.length > 0 && (
          <Card className="text-center py-16 border-2 border-dashed">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">
              No records match your search
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search terms
            </p>
          </Card>
        )}

        {records.length === 0 && (
          <Card className="text-center py-16 border-2 border-dashed">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-muted-foreground">
              No medical records yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first encrypted medical record to get started
            </p>
          </Card>
        )}
      </main>

      {/* Patient Records Modal */}
      <Dialog
        open={!!selectedPatientRecords}
        onOpenChange={() => {
          setSelectedPatientRecords(null);
          // Clear URL params when closing modal
          if (searchParams.get("patientId")) {
            navigate(`${basePath}`, { replace: true });
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-3">
              <User className="h-6 w-6 text-primary" />
              {selectedPatientRecords?.patientName}
              <Badge variant="secondary" className="ml-2">
                {selectedPatientRecords?.totalRecords} Records
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <div className="space-y-4 mt-4">
              {selectedPatientRecords?.records.map((record) => (
                <Card
                  key={record.id}
                  className="p-6 border-l-4 border-l-primary hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() =>
                    setSelectedRecordDetail({
                      record,
                      patientName: selectedPatientRecords.patientName,
                    })
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText
                          className={`h-6 w-6 ${getRecordTypeColor(
                            record.type
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">
                            {record.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {getRecordTypeLabel(record.type)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <p>
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(record.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-medium">By:</span>{" "}
                            {record.uploadedBy}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">
                          CLICK TO VIEW FULL DETAILS
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {decryptData(record.encryptedContent)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {selectedPatientRecords && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleGenerateSummary(selectedPatientRecords.patientId)
                    }
                    disabled={isGeneratingSummary}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Summary
                  </Button>
                  {userRole === "admin" && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        handleDetectAnomalies(selectedPatientRecords.patientId)
                      }
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Detect Anomalies
                    </Button>
                  )}
                </div>
              )}

              {selectedPatientForSummary ===
                selectedPatientRecords?.patientId &&
                aiSummary && (
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-xs font-semibold text-accent">
                        AI GENERATED SUMMARY
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{aiSummary}</p>
                  </div>
                )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Individual Record Detail Modal */}
      <Dialog
        open={!!selectedRecordDetail}
        onOpenChange={() => setSelectedRecordDetail(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-3">
              <FileText
                className={`h-6 w-6 ${
                  selectedRecordDetail
                    ? getRecordTypeColor(selectedRecordDetail.record.type)
                    : ""
                }`}
              />
              {selectedRecordDetail?.record.title}
              <Badge variant="secondary" className="text-xs">
                {selectedRecordDetail &&
                  getRecordTypeLabel(selectedRecordDetail.record.type)}
              </Badge>
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-2">
              Patient:{" "}
              <span className="font-semibold">
                {selectedRecordDetail?.patientName}
              </span>
            </p>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-140px)] pr-4">
            {selectedRecordDetail && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1">
                      Record Type
                    </p>
                    <p className="font-semibold">
                      {getRecordTypeLabel(selectedRecordDetail.record.type)}
                    </p>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedRecordDetail.record.date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1">
                      Uploaded By
                    </p>
                    <p className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {selectedRecordDetail.record.uploadedBy}
                    </p>
                  </Card>
                  <Card className="p-4 bg-secondary/20">
                    <p className="text-xs text-muted-foreground mb-1">
                      Patient ID
                    </p>
                    <p className="font-semibold">
                      {selectedRecordDetail.record.patientId}
                    </p>
                  </Card>
                </div>

                <Card className="p-6 bg-accent/5 border-2 border-accent/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-accent" />
                    <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                      {selectedRecordDetail.record.type === "note" &&
                        "Doctor's Notes"}
                      {selectedRecordDetail.record.type === "prescription" &&
                        "Prescription Details"}
                      {selectedRecordDetail.record.type === "lab" &&
                        "Laboratory Results"}
                    </span>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed text-foreground">
                        {decryptData(
                          selectedRecordDetail.record.encryptedContent
                        )}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>
                    This record is encrypted and stored securely using
                    end-to-end encryption
                  </span>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordManagement;
