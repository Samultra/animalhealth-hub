
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLatestVitalSigns } from "@/services/vitalSignsService";
import { getAnimalById } from "@/services/animalService";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "excellent" | "good" | "average" | "poor" | "critical";
}

interface HealthMetricsCardProps {
  animalId?: number;
  metrics?: HealthMetric[];
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

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ animalId, metrics: propMetrics }) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      if (!animalId) return;
      
      setLoading(true);
      try {
        const latestSigns = await getLatestVitalSigns(animalId);
        const animal = await getAnimalById(animalId);
        
        const newMetrics: HealthMetric[] = [];
        
        if (latestSigns.temperature) {
          newMetrics.push({
            id: "temperature",
            name: "Температура",
            value: latestSigns.temperature.value,
            unit: "°C",
            change: 0,
            status: animal?.healthStatus || "average"
          });
        }
        
        if (latestSigns.heartRate) {
          newMetrics.push({
            id: "heartRate",
            name: "Пульс",
            value: latestSigns.heartRate.value,
            unit: "уд/мин",
            change: 0,
            status: animal?.healthStatus || "average"
          });
        }
        
        if (latestSigns.weight) {
          newMetrics.push({
            id: "weight",
            name: "Вес",
            value: latestSigns.weight.value,
            unit: "кг",
            change: 0,
            status: animal?.healthStatus || "average"
          });
        }
        
        setMetrics(newMetrics);
      } catch (error) {
        console.error("Ошибка при загрузке показателей здоровья:", error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (propMetrics && propMetrics.length > 0) {
      setMetrics(propMetrics);
    } else if (animalId) {
      fetchHealthMetrics();
    } else {
      setMetrics([]);
    }
  }, [animalId, propMetrics]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Показатели здоровья</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3">Загрузка данных...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Показатели здоровья</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics && metrics.length > 0 ? (
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
        ) : (
          <div className="text-center py-6 text-gray-500">
            Нет доступных показателей здоровья
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
