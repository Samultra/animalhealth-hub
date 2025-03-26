
import React from "react";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: string;
  duration: string;
  date: string;
  intensity: "low" | "medium" | "high";
}

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "bg-blue-50 text-blue-600";
      case "medium":
        return "bg-yellow-50 text-yellow-600";
      case "high":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Dumbbell className="h-5 w-5 text-primary" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-3 border-b border-gray-100 pb-3 animate-fade-in"
              style={{ animationDelay: `${activities.indexOf(activity) * 0.1}s` }}
            >
              <div className={`w-2 h-2 rounded-full ${getIntensityColor(activity.intensity).split(" ")[0]}`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Duration: {activity.duration}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getIntensityColor(activity.intensity)}`}>
                    {activity.intensity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5">
          View Full Activity History
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityLog;
