
import React from "react";
import { Pill, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  status: "completed" | "upcoming" | "missed";
  time: string;
}

interface MedicationTrackerProps {
  medications: Medication[];
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ medications }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-health-excellent" />;
      case "upcoming":
        return <Clock className="h-4 w-4 text-health-average" />;
      case "missed":
        return <AlertTriangle className="h-4 w-4 text-health-poor" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-health-excellent";
      case "upcoming":
        return "bg-yellow-50 text-health-average";
      case "missed":
        return "bg-red-50 text-health-poor";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <Card className="glass-card h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Pill className="h-5 w-5 text-primary" />
          Medication Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((medication) => (
            <div 
              key={medication.id} 
              className={`flex items-center justify-between p-3 rounded-md border ${getStatusClass(medication.status)} border-opacity-30 animate-fade-in`}
              style={{ animationDelay: `${medications.indexOf(medication) * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(medication.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{medication.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {medication.dosage}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{medication.schedule}</p>
                </div>
              </div>
              <div className="text-sm">{medication.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
