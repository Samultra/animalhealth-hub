
import React from "react";
import { CheckCircle, Thermometer, Weight, Heart, AlertCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AnimalProfileCardProps {
  animal: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    temperature: string;
    heartRate: string;
    healthStatus: "excellent" | "good" | "average" | "poor" | "critical";
    lastCheckup: string;
    imageUrl?: string;
  };
}

const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({ animal }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "border-health-excellent text-health-excellent";
      case "good":
        return "border-health-good text-health-good";
      case "average":
        return "border-health-average text-health-average";
      case "poor":
        return "border-health-poor text-health-poor";
      case "critical":
        return "border-health-critical text-health-critical";
      default:
        return "border-gray-300 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return <CheckCircle className="h-4 w-4" />;
      case "average":
        return <AlertCircle className="h-4 w-4" />;
      case "poor":
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="glass-card h-full animate-scale-in">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-lg font-medium">{animal.name}</CardTitle>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md mb-3">
            <AvatarImage src={animal.imageUrl} />
            <AvatarFallback className="text-xl">{animal.name[0]}</AvatarFallback>
          </Avatar>
          
          <Badge variant="outline" className={`mb-2 ${getStatusColor(animal.healthStatus)} flex gap-1 items-center`}>
            {getStatusIcon(animal.healthStatus)}
            {animal.healthStatus} health
          </Badge>
          
          <p className="text-sm text-gray-500">
            {animal.species} • {animal.breed} • {animal.age}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Thermometer className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Temp</span>
            <span className="text-sm font-medium">{animal.temperature}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Heart className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Heart</span>
            <span className="text-sm font-medium">{animal.heartRate}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Weight className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Weight</span>
            <span className="text-sm font-medium">{animal.weight}</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Last checkup: {animal.lastCheckup}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimalProfileCard;
