"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { QRScanner } from "@/components/qr/qr-scanner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle2,
  UtensilsCrossed,
  Clock,
} from "lucide-react"

export function VerificationScreen() {
  const { user } = useAuth()
  const [scanCount, setScanCount] = useState(0)
  const [selectedCounterId, setSelectedCounterId] = useState(
    user?.counterId || "750e8400-e29b-41d4-a716-446655440001"
  )

  const counterOptions = [
    { id: "750e8400-e29b-41d4-a716-446655440001", label: "Counter 1 (Breakfast)" },
    { id: "750e8400-e29b-41d4-a716-446655440002", label: "Counter 2 (Lunch)" },
    { id: "750e8400-e29b-41d4-a716-446655440003", label: "Counter 3 (Dinner)" },
  ]

  const handleScanSuccess = () => {
    setScanCount(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Verification</h1>
          <p className="text-muted-foreground">Scan or paste token QR to verify against database</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2 font-mono text-foreground">
          <UtensilsCrossed className="h-4 w-4 mr-2" />
          Counter Verification
        </Badge>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4">
        <Card className="flex-1 border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{scanCount}</p>
              <p className="text-xs text-muted-foreground">Served Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 border-border/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground font-mono">{selectedCounterId.slice(0, 8)}...</p>
              <p className="text-xs text-muted-foreground">Counter ID</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4 space-y-2">
          <Label className="text-sm text-foreground">Serving Counter</Label>
          <Select value={selectedCounterId} onValueChange={setSelectedCounterId}>
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Select Counter" />
            </SelectTrigger>
            <SelectContent>
              {counterOptions.map((counter) => (
                <SelectItem key={counter.id} value={counter.id}>
                  {counter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <QRScanner
        counterId={selectedCounterId}
        staffId={user?.staffId}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  )
}
