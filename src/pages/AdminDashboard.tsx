import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Activity, LogOut, Shield, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "admin@health.gov";

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    if (!isAuthenticated || userRole !== "admin") {
      navigate("/auth?role=admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = [
    { label: "Total Patients", value: "12,847", icon: Users, color: "text-blue-600", change: "+12%" },
    { label: "Medical Records", value: "45,231", icon: FileText, color: "text-green-600", change: "+8%" },
    { label: "Active Today", value: "289", icon: Activity, color: "text-orange-600", change: "+5%" },
    { label: "System Health", value: "99.9%", icon: TrendingUp, color: "text-purple-600", change: "Optimal" },
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
                <h1 className="text-xl font-bold text-gov-navy">Administrator Dashboard</h1>
                <p className="text-xs text-muted-foreground">National Healthcare Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{userEmail}</p>
                <Badge variant="outline" className="text-xs">Administrator</Badge>
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
        {/* System Alert */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">System Status: Operational</p>
            <p className="text-sm text-blue-700">All services running normally. Last backup completed 2 hours ago.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-lg bg-${stat.color.split('-')[1]}-100 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gov-navy">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold mb-4 text-gov-navy">Administrative Functions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/admin/patients">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gov-navy font-display">Patient Management</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Register new patients, update biographical data, manage patient profiles, and access comprehensive patient information
                  </p>
                  <div className="mt-4 text-sm font-medium text-primary">
                    Manage Patients →
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/records">
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <FileText className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-gov-navy font-display">Medical Records</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload and manage encrypted medical notes, laboratory results, diagnostic images, and prescriptions securely
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
              <p className="font-medium text-foreground mb-1">Security & Compliance</p>
              <p>All data is encrypted using AES-256 encryption. System is HIPAA compliant and SOC 2 Type II certified. All activities are logged for audit purposes.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
