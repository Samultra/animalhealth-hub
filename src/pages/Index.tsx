
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/layout/PageTransition";
import RoleBasedNavbar from "@/components/layout/RoleBasedNavbar";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnimalProfileCard from "@/components/dashboard/AnimalProfileCard";
import HealthMetricsCard from "@/components/dashboard/HealthMetricsCard";
import VitalSignsChart from "@/components/dashboard/VitalSignsChart";
import MedicationTracker from "@/components/dashboard/MedicationTracker";
import ActivityLog from "@/components/dashboard/ActivityLog";
import { Shield, Users, Activity } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Фиксируем типы для данных в соответствии с требованиями компонентов
interface Animal {
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
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: "excellent" | "good" | "average" | "poor" | "critical";
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  status: "completed" | "upcoming" | "missed";
  time: string;
}

interface Activity {
  id: string;
  type: string;
  duration: string;
  date: string;
  intensity: "high" | "medium" | "low";
}

const Index: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  // Mockup данные с правильными типами для healthStatus
  const animalData: Animal = {
    id: "1",
    name: "Барсик",
    species: "Кошка",
    breed: "Сиамская",
    age: "5 лет",
    weight: "4.5 кг",
    temperature: "38.5°C",
    heartRate: "120 уд/мин",
    healthStatus: "good",
    lastCheckup: "2023-06-15",
    imageUrl: "https://placekitten.com/400/300",
  };

  // Типизированные данные для метрик здоровья
  const healthMetrics: HealthMetric[] = [
    {
      id: "1",
      name: "Вес",
      value: 4.5,
      unit: "кг",
      change: 0.2,
      status: "good",
    },
    {
      id: "2",
      name: "Температура",
      value: 38.5,
      unit: "°C",
      change: -0.3,
      status: "excellent",
    },
    {
      id: "3",
      name: "Пульс",
      value: 120,
      unit: "уд/мин",
      change: 5,
      status: "good",
    },
  ];

  // Типизированные данные для медикаментов
  const medications: Medication[] = [
    {
      id: "1",
      name: "Витамины",
      dosage: "1 таблетка",
      schedule: "Ежедневно",
      status: "completed",
      time: "08:00",
    },
    {
      id: "2",
      name: "Антибиотик",
      dosage: "5 мл",
      schedule: "Дважды в день",
      status: "upcoming",
      time: "18:00",
    },
  ];

  // Типизированные данные для активностей
  const activities: Activity[] = [
    {
      id: "1",
      type: "Прогулка",
      duration: "30 минут",
      date: "Сегодня, 09:30",
      intensity: "medium",
    },
    {
      id: "2",
      type: "Игра",
      duration: "15 минут",
      date: "Сегодня, 14:00",
      intensity: "high",
    },
  ];

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader
            title="Мониторинг здоровья животных"
            subtitle="Обзор состояния здоровья ваших питомцев"
          />

          {/* Карточки администратора и модератора (показаны только если есть права) */}
          {(hasRole("admin") || hasRole("moderator")) && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hasRole("admin") && (
                <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Администрирование
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Управление системой, пользователями и настройками
                    </p>
                    <Button 
                      onClick={() => navigate("/admin")}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Панель администратора
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {hasRole(["admin", "moderator"]) && (
                <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Модерация
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Проверка данных, обработка инцидентов и отчеты
                    </p>
                    <Button 
                      onClick={() => navigate("/moderator")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Панель модератора
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-gradient-to-br from-green-100 to-green-50 border border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Мониторинг
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Отслеживание состояния здоровья животных в реальном времени
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Просмотр данных
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <AnimalProfileCard animal={animalData} />
            </div>

            <div className="lg:col-span-8">
              <HealthMetricsCard metrics={healthMetrics} />
            </div>

            <div className="lg:col-span-8">
              <VitalSignsChart />
            </div>

            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 gap-6">
                <MedicationTracker medications={medications} />
                <ActivityLog activities={activities} />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
