import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Activity, LogOut, Shield, Clock } from "lucide-react";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "nurse@health.gov";

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "nurse") {
      navigate("/auth?role=nurse");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = [
    { label: "My Patients", value: "45", icon: Users, color: "text-blue-600" },
    { label: "Records Added", value: "127", icon: FileText, color: "text-green-600" },
    { label: "Today's Visits", value: "12", icon: Activity, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-primary flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gov-navy">Healthcare Staff Portal</h1>
                <p className="text-xs text-muted-foreground">National Healthcare Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{userEmail}</p>
                <Badge variant="outline" className="text-xs">Healthcare Staff</Badge>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-primary">Welcome back!</p>
            <p className="text-sm text-muted-foreground">You have 3 patients scheduled for today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gov-navy">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg bg-${stat.color.split('-')[1]}-100 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold mb-4 text-gov-navy">Healthcare Functions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/nurse/patients">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gov-navy font-display">View Patients</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Access patient profiles, biographical data, medical history, and contact information
                  </p>
                  <div className="mt-4 text-sm font-medium text-primary">
                    View Patients →
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/nurse/records">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gov-navy font-display">Medical Records</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Add clinical notes, upload lab results, and manage prescription records securely
                  </p>
                  <div className="mt-4 text-sm font-medium text-primary">
                    Manage Records →
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Data Protection & Privacy</p>
              <p>All patient data is protected under HIPAA regulations. Ensure proper handling of sensitive medical information. All activities are monitored for compliance.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseDashboard;
