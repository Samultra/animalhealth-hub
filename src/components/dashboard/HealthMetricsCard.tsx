
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

const getStatusConfig = (status: HealthMetric["status"]) => {
  switch (status) {
    case "excellent":
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        progressColor: "bg-green-500",
        label: "Отлично",
        value: 100,
      };
    case "good":
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        progressColor: "bg-blue-500",
        label: "Хорошо",
        value: 80,
      };
    case "average":
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        progressColor: "bg-yellow-500",
        label: "Средне",
        value: 60,
      };
    case "poor":
      return {
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        progressColor: "bg-orange-500",
        label: "Плохо",
        value: 40,
      };
    case "critical":
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        progressColor: "bg-red-500",
        label: "Критично",
        value: 20,
      };
    default:
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        progressColor: "bg-gray-500",
        label: "Нет данных",
        value: 0,
      };
  }
};

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Показатели здоровья</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {metrics.map((metric) => {
            const statusConfig = getStatusConfig(metric.status);
            return (
              <div key={metric.id} className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{metric.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusConfig.bgColor,
                        statusConfig.borderColor,
                        statusConfig.color
                      )}
                    >
                      {statusConfig.label}
                    </span>
                    {metric.change !== 0 && (
                      <div
                        className={cn(
                          "ml-2 flex items-center text-xs",
                          metric.change > 0
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {metric.change > 0 ? (
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(metric.change)}
                      </div>
                    )}
                  </div>
                </div>
                <Progress 
                  value={statusConfig.value} 
                  className={cn("h-2", statusConfig.progressColor === "bg-green-500" ? "bg-green-100" : 
                                        statusConfig.progressColor === "bg-blue-500" ? "bg-blue-100" : 
                                        statusConfig.progressColor === "bg-yellow-500" ? "bg-yellow-100" :
                                        statusConfig.progressColor === "bg-orange-500" ? "bg-orange-100" :
                                        statusConfig.progressColor === "bg-red-500" ? "bg-red-100" : "bg-gray-100")}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
