
import React from "react";
import { Activity, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "excellent" | "good" | "average" | "poor" | "critical";
}

interface HealthMetricsCardProps {
  metrics: HealthMetric[];
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metrics }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-health-excellent";
      case "good":
        return "text-health-good";
      case "average":
        return "text-health-average";
      case "poor":
        return "text-health-poor";
      case "critical":
        return "text-health-critical";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-health-excellent";
      case "good":
        return "bg-health-good";
      case "average":
        return "bg-health-average";
      case "poor":
        return "bg-health-poor";
      case "critical":
        return "bg-health-critical";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Activity className="h-5 w-5 text-primary" />
          Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {metrics.map((metric) => (
            <div key={metric.id} className="animate-slide-up" style={{ animationDelay: `${metrics.indexOf(metric) * 0.1}s` }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${getStatusBg(metric.status)} bg-opacity-10 ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{metric.value} {metric.unit}</span>
                  <div className={`flex items-center text-xs font-medium ${metric.change >= 0 ? 'text-health-good' : 'text-health-poor'}`}>
                    {metric.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
              <Progress 
                value={Math.min(100, Math.max(0, metric.value))} 
                className="h-1.5"
                indicatorClassName={`${getStatusBg(metric.status)}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
