import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Authentication Error",
        description: "Please enter both email address and password",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Mock authentication - store in localStorage
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAuthenticated", "true");

    toast({
      title: "Authentication Successful",
      description: `Access granted to ${role} portal`,
    });

    // Redirect based on role
    navigate(role === "admin" ? "/admin" : "/nurse");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gov-light-blue via-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        {/* Official Badge */}
        <div className="text-center mb-6">
          <Badge className="bg-gov-navy text-white px-4 py-2 text-sm">
            <Building2 className="h-4 w-4 mr-2 inline" />
            Official Government Portal
          </Badge>
        </div>

        <Card className="p-8 shadow-xl border-2">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold text-center mb-2 text-gov-navy">
            {role === "admin" ? "Administrator" : "Healthcare Staff"} Access
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            SmartCare Management System
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Official Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="username@health.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Secure Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              size="lg"
            >
              <Lock className="h-4 w-4 mr-2" />
              Secure Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                <Shield className="h-3 w-3 inline mr-1" />
                This system is for authorized personnel only. All activities are
                monitored and logged for security purposes.
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Demo Access: Use any valid email and password
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Protected by 256-bit AES encryption • HIPAA Compliant</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
