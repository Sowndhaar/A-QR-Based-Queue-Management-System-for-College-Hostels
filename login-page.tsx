"use client"

import { useState } from "react"
import { useAuth, type UserType } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  GraduationCap,
  UtensilsCrossed,
  ShieldCheck,
  QrCode,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react"

const roles: { role: UserType; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    role: "student",
    label: "Student",
    description: "Book meal tokens & view QR codes",
    icon: <GraduationCap className="h-8 w-8" />,
    color: "bg-primary text-primary-foreground",
  },
  {
    role: "staff",
    label: "Serving Staff",
    description: "Scan & verify QR meal tokens",
    icon: <UtensilsCrossed className="h-8 w-8" />,
    color: "bg-accent text-accent-foreground",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Manage meals, quotas & analytics",
    icon: <ShieldCheck className="h-8 w-8" />,
    color: "bg-warning text-warning-foreground",
  },
]

export function LoginPage() {
  const { login, loading, error, clearError } = useAuth()
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !email || !password) {
      return
    }

    try {
      await login(email, password, selectedRole)
    } catch (err) {
      console.error('[v0] Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary/10 p-4">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            SmartMeal QR
          </h1>
          <p className="text-muted-foreground text-balance">
            Hostel Food Queue & Meal Management System
          </p>
          <Badge variant="secondary" className="font-mono text-xs">
            Secure QR-Based Token System
          </Badge>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-3">
          {roles.map(({ role, label, description, icon, color }) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                selectedRole === role
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className={`rounded-xl p-2.5 ${color}`}>
                {icon}
              </div>
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
              <span className="text-xs text-muted-foreground text-center leading-relaxed hidden sm:block">
                {description}
              </span>
              {selectedRole === role && (
                <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary border-2 border-card" />
              )}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {selectedRole && (
          <Card className="border-border/60 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-card-foreground">
                Sign in as {roles.find(r => r.role === selectedRole)?.label}
              </CardTitle>
              <CardDescription>
                {selectedRole === "student"
                  ? "Use your hostel-registered credentials"
                  : "Enter your staff credentials"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={selectedRole === "student" ? "student@example.com" : "staff@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="bg-background"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Demo credentials: student1@example.com / password123
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
