"use client"

import { mockMeals, mockCounters, mockTokens, mockAuditLogs } from "@/lib/mock-data"
import { UpcomingMenusAdmin } from "./upcoming-menus-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Monitor,
  AlertTriangle,
  Coffee,
  Sun,
  Moon,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const mealIcons: Record<string, React.ReactNode> = {
  Breakfast: <Coffee className="h-5 w-5" />,
  Lunch: <Sun className="h-5 w-5" />,
  Dinner: <Moon className="h-5 w-5" />,
}

export function AdminDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const totalBooked = mockMeals.reduce((sum, m) => sum + m.bookedCount, 0)
  const totalCapacity = mockMeals.reduce((sum, m) => sum + m.maxQuota, 0)
  const totalServed = mockTokens.filter(t => t.status === "USED").length
  const totalExpired = mockTokens.filter(t => t.status === "EXPIRED").length
  const activeCounters = mockCounters.filter(c => c.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {"Today's"} overview &middot; {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* Upcoming Menus */}
      <UpcomingMenusAdmin onNavigate={onNavigate} />

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{totalBooked}</p>
                <p className="text-xs text-muted-foreground">Total Booked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{totalServed}</p>
                <p className="text-xs text-muted-foreground">Served</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{totalExpired}</p>
                <p className="text-xs text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{activeCounters}/3</p>
                <p className="text-xs text-muted-foreground">Active Counters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Status + Counters */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meals */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base text-card-foreground">Meal Status</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onNavigate("meals")}>
              Manage <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMeals.map(meal => {
              const percent = Math.round((meal.bookedCount / meal.maxQuota) * 100)
              return (
                <div key={meal.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {mealIcons[meal.type]}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-card-foreground">{meal.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {meal.bookedCount}/{meal.maxQuota}
                        </span>
                        <Badge variant={meal.isOpen ? "default" : "secondary"} className={`text-xs ${meal.isOpen ? "bg-success text-success-foreground" : ""}`}>
                          {meal.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Counters */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base text-card-foreground">Serving Counters</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onNavigate("counters")}>
              Manage <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCounters.map(counter => (
              <div key={counter.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${counter.isActive ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{counter.name}</p>
                    <p className="text-xs text-muted-foreground">{counter.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{counter.tokensServed}</p>
                  <p className="text-xs text-muted-foreground">served</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-card-foreground">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onNavigate("logs")}>
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  log.action.includes("Override") || log.action.includes("Duplicate")
                    ? "bg-warning/10 text-warning"
                    : log.action.includes("Scanned") || log.action.includes("Generated")
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}>
                  {log.action.includes("Override") ? <AlertTriangle className="h-4 w-4" /> :
                   log.action.includes("Duplicate") ? <XCircle className="h-4 w-4" /> :
                   log.action.includes("Scanned") ? <CheckCircle2 className="h-4 w-4" /> :
                   <TrendingUp className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {log.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
