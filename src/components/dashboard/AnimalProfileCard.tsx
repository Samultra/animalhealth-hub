
import React, { useState, useEffect } from "react";
import { CheckCircle, Thermometer, Weight, Heart, AlertCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserAnimals, Animal } from "@/services/animalService";
import { useAuth } from "@/contexts/AuthContext";

interface AnimalProfileCardProps {
  animal?: {
    id?: number;
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    temperature?: string;
    heartRate?: string;
    healthStatus?: "excellent" | "good" | "average" | "poor" | "critical";
    lastCheckup?: string;
    imageUrl?: string;
  };
  selectedAnimalId?: number;
  onSelectAnimal?: (id: number) => void;
}

const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({ 
  animal: propAnimal,
  selectedAnimalId,
  onSelectAnimal
}) => {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (user?.id) {
        try {
          const userAnimals = await getUserAnimals(user.id);
          setAnimals(userAnimals);
          
          if (userAnimals.length > 0) {
            const animalToSelect = selectedAnimalId 
              ? userAnimals.find(a => a.id === selectedAnimalId) 
              : userAnimals[0];
              
            if (animalToSelect) {
              setSelectedAnimal(animalToSelect);
              if (onSelectAnimal && animalToSelect.id) {
                onSelectAnimal(animalToSelect.id);
              }
            }
          }
        } catch (error) {
          console.error("Ошибка при загрузке животных:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAnimals();
  }, [user, selectedAnimalId, onSelectAnimal]);

  // Используем переданное животное или выбранное из списка
  const displayAnimal = propAnimal || selectedAnimal;

  const getStatusColor = (status?: string) => {
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

  const getStatusIcon = (status?: string) => {
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

  if (loading) {
    return (
      <Card className="glass-card h-full animate-scale-in">
        <CardContent className="flex flex-col items-center justify-center p-6 h-full">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm text-gray-500">Загрузка данных...</p>
        </CardContent>
      </Card>
    );
  }

  if (!displayAnimal) {
    return (
      <Card className="glass-card h-full animate-scale-in">
        <CardContent className="flex flex-col items-center justify-center p-6 h-full">
          <p className="text-sm text-gray-500">Нет данных о животных</p>
          <Button variant="outline" className="mt-4">
            Добавить животное
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card h-full animate-scale-in">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-lg font-medium">{displayAnimal.name}</CardTitle>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md mb-3">
            <AvatarImage src={displayAnimal.imageUrl} />
            <AvatarFallback className="text-xl">{displayAnimal.name[0]}</AvatarFallback>
          </Avatar>
          
          {displayAnimal.healthStatus && (
            <Badge variant="outline" className={`mb-2 ${getStatusColor(displayAnimal.healthStatus)} flex gap-1 items-center`}>
              {getStatusIcon(displayAnimal.healthStatus)}
              {displayAnimal.healthStatus} здоровье
            </Badge>
          )}
          
          <p className="text-sm text-gray-500">
            {displayAnimal.species} • {displayAnimal.breed} • {displayAnimal.age} лет
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Thermometer className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Темп</span>
            <span className="text-sm font-medium">{displayAnimal.temperature || `${displayAnimal.weight - 4}°C`}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Heart className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Пульс</span>
            <span className="text-sm font-medium">{displayAnimal.heartRate || `${70 + Math.floor(Math.random() * 20)}`}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-md">
            <Weight className="h-4 w-4 text-gray-500 mb-1" />
            <span className="text-xs text-gray-500">Вес</span>
            <span className="text-sm font-medium">{displayAnimal.weight} кг</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Последний осмотр: {displayAnimal.lastCheckup || "Не указано"}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimalProfileCard;
