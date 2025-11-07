import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, FileText, Lock, Activity, Clock, Building2, Award, CheckCircle2 } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Official Header Bar */}
      <div className="bg-medical-dark text-primary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <span className="font-medium">Professional Healthcare Management Platform</span>
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Healthcare Solutions
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded bg-primary flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HealthVault Pro</h1>
              <p className="text-xs text-muted-foreground">Advanced Healthcare Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/auth?role=nurse">
              <Button variant="outline" size="lg" className="font-medium">
                Healthcare Staff Login
              </Button>
            </Link>
            <Link to="/auth?role=admin">
              <Button size="lg" className="font-medium">
                Administrator Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-medical-light via-card to-secondary/20 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-4 py-2 bg-accent text-accent-foreground">
              <Award className="h-4 w-4 mr-2 inline" />
              ISO 27001 Certified & HIPAA Compliant
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Advanced Healthcare Management System
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Secure, comprehensive, and AI-powered patient care management platform with real-time analytics
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/auth?role=admin">
                <Button size="lg" className="text-lg px-8 py-6 font-semibold shadow-lg">
                  Administrator Portal
                </Button>
              </Link>
              <Link to="/auth?role=nurse">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 font-semibold border-2">
                  Healthcare Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-medical-dark text-primary-foreground py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">End-to-End</div>
              <div className="text-sm opacity-80">Encryption</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">99.9%</div>
              <div className="text-sm opacity-80">System Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-80">Support & Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">AI-Powered</div>
              <div className="text-sm opacity-80">Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">System Capabilities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive healthcare management tools powered by AI and advanced analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Patient Registry</h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive patient database with complete demographic information, medical history, and contact details management
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Biometric identification</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Insurance integration</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Medical Records</h3>
            <p className="text-muted-foreground leading-relaxed">
              Digital health records system with support for clinical notes, laboratory results, diagnostic imaging, and prescriptions
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>DICOM imaging support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>HL7 FHIR compliant</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Data Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Military-grade end-to-end encryption ensuring complete confidentiality and compliance with healthcare data protection regulations
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>AES-256 encryption</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>HIPAA compliant</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Access Control</h3>
            <p className="text-muted-foreground leading-relaxed">
              Role-based authentication system with granular permissions for administrators, physicians, nurses, and support staff
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Multi-factor authentication</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>SSO integration</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Real-Time Monitoring</h3>
            <p className="text-muted-foreground leading-relaxed">
              Live updates and notifications for critical patient information, test results, and emergency alerts across care teams
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Instant notifications</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Mobile alerts</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 font-display">Audit Compliance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Complete audit trail of all system activities, user actions, and data modifications for regulatory compliance
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Detailed activity logs</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Compliance reporting</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-medical-dark text-primary-foreground border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Transform Your Healthcare Management
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join healthcare facilities using our advanced platform for secure, efficient patient care
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-semibold">
              Access System Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Department Information</li>
                <li>Contact Us</li>
                <li>Support Services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>User Guides</li>
                <li>System Documentation</li>
                <li>Training Materials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Compliance</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Data Protection</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Certifications</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ISO 27001 Certified</li>
                <li>HIPAA Compliant</li>
                <li>SOC 2 Type II</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 HealthVault Pro. All rights reserved.</p>
            <p className="font-medium">Professional Healthcare Management Platform • Secure • AI-Powered • Trusted</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
