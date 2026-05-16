"use client"

import { useState } from "react"
import { mockCounters, mockStaff } from "@/lib/mock-data"
import type { Counter } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Monitor,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Trash2,
} from "lucide-react"

export function CounterManagement() {
  const [counters, setCounters] = useState<Counter[]>(mockCounters)
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideReason, setOverrideReason] = useState("")
  const [overrideStudentId, setOverrideStudentId] = useState("")
  const [addCounterOpen, setAddCounterOpen] = useState(false)
  const [newCounterName, setNewCounterName] = useState("")
  const [newCounterType, setNewCounterType] = useState("Veg")
  const [newCounterStaff, setNewCounterStaff] = useState("none")

  const toggleCounter = (id: string) => {
    setCounters(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  const handleAddCounter = () => {
    if (!newCounterName.trim()) return
    
    const newCounter: Counter = {
      id: `c${counters.length + 1}`,
      name: newCounterName.trim(),
      type: newCounterType,
      isActive: true,
      tokensServed: 0,
      assignedStaff: newCounterStaff === "none" ? null : newCounterStaff,
    }
    
    setCounters([...counters, newCounter])
    setNewCounterName("")
    setNewCounterType("Veg")
    setNewCounterStaff("none")
    setAddCounterOpen(false)
  }

  const handleDeleteCounter = (id: string) => {
    setCounters(prev => prev.filter(c => c.id !== id))
  }

  const handleOverride = () => {
    // Placeholder: would log to audit trail
    setOverrideOpen(false)
    setOverrideReason("")
    setOverrideStudentId("")
  }

  const availableStaff = mockStaff.filter(s => !s.assignedCounter || s.employeeNumber === newCounterStaff)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Counter Management</h1>
          <p className="text-muted-foreground">Add, manage counters and handle emergency overrides</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2" onClick={() => setAddCounterOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Counter
          </Button>
          <Button variant="destructive" className="gap-2" onClick={() => setOverrideOpen(true)}>
            <ShieldAlert className="h-4 w-4" />
            Emergency Override
          </Button>
        </div>
      </div>

      {/* Counters Info */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-primary">{counters.length}</p>
            <p className="text-sm text-muted-foreground">Total Counters</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-success">{counters.filter(c => c.isActive).length}</p>
            <p className="text-sm text-muted-foreground">Active Counters</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-primary">{counters.reduce((sum, c) => sum + c.tokensServed, 0)}</p>
            <p className="text-sm text-muted-foreground">Total Tokens Served</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-warning">{counters.filter(c => !c.isActive).length}</p>
            <p className="text-sm text-muted-foreground">Offline Counters</p>
          </CardContent>
        </Card>
      </div>

      {/* Counters Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {counters.map(counter => (
          <Card key={counter.id} className={`border-border/60 overflow-hidden ${counter.isActive ? "" : "opacity-60"}`}>
            <div className={`h-1.5 ${counter.isActive ? "bg-success" : "bg-muted"}`} />
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${counter.isActive ? "bg-success/10" : "bg-muted"}`}>
                    <Monitor className={`h-6 w-6 ${counter.isActive ? "text-success" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{counter.name}</h3>
                    <p className="text-sm text-muted-foreground">{counter.type}</p>
                  </div>
                </div>
                <Switch
                  checked={counter.isActive}
                  onCheckedChange={() => toggleCounter(counter.id)}
                  aria-label={`Toggle ${counter.name}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-card-foreground">{counter.tokensServed}</p>
                  <p className="text-xs text-muted-foreground">Tokens Served</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm font-bold text-card-foreground">
                    {counter.assignedStaff || "Unassigned"}
                  </p>
                  <p className="text-xs text-muted-foreground">Staff</p>
                </div>
              </div>

              <Badge variant={counter.isActive ? "default" : "secondary"} className={`w-full justify-center ${counter.isActive ? "bg-success text-success-foreground" : ""}`}>
                <div className={`h-2 w-2 rounded-full mr-2 ${counter.isActive ? "bg-success-foreground animate-pulse" : "bg-muted-foreground"}`} />
                {counter.isActive ? "Online - Serving" : "Offline"}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => handleDeleteCounter(counter.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete Counter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Counter Dialog */}
      <Dialog open={addCounterOpen} onOpenChange={setAddCounterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5 text-primary" />
              Add New Counter
            </DialogTitle>
            <DialogDescription>
              Create a new serving counter and optionally assign serving staff
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counterName" className="text-foreground">Counter Name</Label>
              <Input
                id="counterName"
                placeholder="e.g., Counter 4, Veg Counter 2"
                value={newCounterName}
                onChange={e => setNewCounterName(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counterType" className="text-foreground">Counter Type</Label>
              <Select value={newCounterType} onValueChange={setNewCounterType}>
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">Vegetarian</SelectItem>
                  <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                  <SelectItem value="Special">Special/Beverages</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffAssign" className="text-foreground">Assign Staff (Optional)</Label>
              <Select value={newCounterStaff} onValueChange={setNewCounterStaff}>
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue placeholder="No staff assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No staff assigned</SelectItem>
                  {availableStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.employeeNumber}>
                      {staff.name} ({staff.employeeNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  The counter will be activated immediately and ready to serve. You can toggle it offline anytime.
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddCounterOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddCounter}
              disabled={!newCounterName.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Counter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Override Dialog */}
      <Dialog open={overrideOpen} onOpenChange={setOverrideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Emergency Manual Override
            </DialogTitle>
            <DialogDescription>
              Use this only when the QR scanner fails. This action will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-foreground">Student Register Number</Label>
              <Input
                id="studentId"
                placeholder="e.g. 21BCE1234"
                value={overrideStudentId}
                onChange={e => setOverrideStudentId(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">
                Override Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="e.g. QR scanner malfunction, student has valid token on phone..."
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <Card className="bg-warning/10 border-warning/20">
              <CardContent className="p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  This override will be permanently logged with your admin ID, timestamp, and the reason provided. Misuse may result in disciplinary action.
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOverrideOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleOverride}
              disabled={!overrideReason.trim() || !overrideStudentId.trim()}
              className="gap-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Approve Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
