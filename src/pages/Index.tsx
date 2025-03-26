
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageTransition from '@/components/layout/PageTransition';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AnimalProfileCard from '@/components/dashboard/AnimalProfileCard';
import HealthMetricsCard from '@/components/dashboard/HealthMetricsCard';
import VitalSignsChart from '@/components/dashboard/VitalSignsChart';
import MedicationTracker from '@/components/dashboard/MedicationTracker';
import ActivityLog from '@/components/dashboard/ActivityLog';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { useAuth } from '../contexts/AuthContext';
import { getUserAnimals, Animal } from '@/services/animalService';
import { getAnimalActivities } from '@/services/activityService';
import { getVitalSignsChartData } from '@/services/vitalSignsService';
import { getActiveAnimalMedications } from '@/services/medicationService';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [userAnimals, setUserAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          // Загрузка животных пользователя
          const animals = await getUserAnimals(user.id);
          setUserAnimals(animals);
          
          if (animals.length > 0 && animals[0].id) {
            setSelectedAnimalId(animals[0].id);
            
            // Загрузка активностей и других данных для первого животного
            await loadAnimalData(animals[0].id);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // Загрузка данных для выбранного животного
  const loadAnimalData = async (animalId: number) => {
    try {
      // Загрузка активностей
      const animalActivities = await getAnimalActivities(animalId);
      setActivities(animalActivities || []);
      
      // Загрузка данных для графика
      const vitalSignsData = await getVitalSignsChartData(animalId);
      setChartData(vitalSignsData || { temperatureData: [], heartRateData: [], weightData: [] });
      
      // Загрузка лекарств
      const animalMedications = await getActiveAnimalMedications(animalId);
      setMedications(animalMedications || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных животного:", error);
      setLoading(false);
    }
  };

  // Обработчик выбора животного
  const handleSelectAnimal = async (animalId: number) => {
    setSelectedAnimalId(animalId);
    setLoading(true);
    await loadAnimalData(animalId);
  };

  // Обработчик перехода к деталям животного
  const handleViewAnimalDetails = () => {
    if (selectedAnimalId) {
      navigate(`/animals/${selectedAnimalId}`);
    }
  };

  if (loading) {
    return (
      <>
        <RoleBasedNavbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
      </>
    );
  }

  const emptyState = (
    <div className="text-center py-20">
      <h3 className="text-xl font-medium mb-2">У вас пока нет добавленных животных</h3>
      <p className="text-gray-500 mb-6">Добавьте своего первого питомца, чтобы начать отслеживать его здоровье</p>
      <Button onClick={() => navigate('/animals/add')} className="flex items-center gap-2">
        <PlusCircle className="h-5 w-5" />
        <span>Добавить животное</span>
      </Button>
    </div>
  );

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader 
            title={`Здравствуйте, ${user?.username || 'Пользователь'}!`}
            subtitle="Система мониторинга здоровья животных"
          />
          
          {userAnimals.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Ваши животные</h2>
                <Button onClick={() => navigate('/animals/add')} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Добавить животное</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1">
                  <div className="relative">
                    <AnimalProfileCard 
                      animals={userAnimals}
                      selectedAnimalId={selectedAnimalId || undefined}
                      onSelectAnimal={handleSelectAnimal}
                    />
                    {selectedAnimalId && (
                      <div className="mt-4">
                        <Button variant="outline" onClick={handleViewAnimalDetails} className="w-full">
                          Подробная информация
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <HealthMetricsCard animalId={selectedAnimalId || undefined} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-0">
                    <VitalSignsChart data={chartData || { temperatureData: [], heartRateData: [], weightData: [] }} />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-0">
                    <MedicationTracker medications={medications || []} />
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <Card>
                  <CardContent className="p-0">
                    <ActivityLog activities={activities || []} />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            emptyState
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
