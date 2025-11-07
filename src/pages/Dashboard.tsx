import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import {
  Users,
  FileText,
  AlertTriangle,
  Calendar,
  Activity,
  TrendingUp,
} from "lucide-react";
import { getPatientStats } from "@/utils/mockData";
import { getSyncStatus } from "@/utils/storage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRecords: 0,
    highRiskPatients: 0,
    recentVisits: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setStats(getPatientStats());
  }, [navigate]);

  const syncStatus = getSyncStatus();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Healthcare Management Overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Last sync: </span>
                <span className="font-medium">
                  {syncStatus.lastSync
                    ? new Date(syncStatus.lastSync).toLocaleTimeString()
                    : "Never"}
                </span>
              </div>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            colorClass="text-primary"
          />
          <StatCard
            title="Medical Records"
            value={stats.totalRecords}
            icon={FileText}
            trend={{ value: 8, isPositive: true }}
            colorClass="text-accent"
          />
          <StatCard
            title="High Risk Patients"
            value={stats.highRiskPatients}
            icon={AlertTriangle}
            colorClass="text-destructive"
          />
          <StatCard
            title="Recent Visits (7d)"
            value={stats.recentVisits}
            icon={Activity}
            trend={{ value: 5, isPositive: true }}
            colorClass="text-success"
          />
          <StatCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon={Calendar}
            colorClass="text-warning"
          />
          <StatCard
            title="System Health"
            value="98%"
            icon={TrendingUp}
            trend={{ value: 2, isPositive: true }}
            colorClass="text-info"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Button
            size="lg"
            className="h-auto py-6"
            onClick={() => navigate("/patient-management")}
          >
            <Users className="mr-2 h-5 w-5" />
            Patient Management
          </Button>
          <Button
            size="lg"
            className="h-auto py-6"
            variant="outline"
            onClick={() => navigate("/record-management")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Records Management
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
