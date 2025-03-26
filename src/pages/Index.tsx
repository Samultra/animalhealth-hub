
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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

const Index: React.FC = () => {
  const { user } = useAuth();
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [userAnimals, setUserAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          // Загрузка животных пользователя
          const animals = await getUserAnimals(user.id);
          setUserAnimals(animals);
          
          if (animals.length > 0) {
            setSelectedAnimalId(animals[0].id);
            
            // Загрузка активностей для первого животного
            if (animals[0].id) {
              const animalActivities = await getAnimalActivities(animals[0].id);
              setActivities(animalActivities);
            }
          }
        } catch (error) {
          console.error("Ошибка при загрузке данных:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [user]);

  // Обработчик выбора животного
  const handleSelectAnimal = async (animalId: number) => {
    setSelectedAnimalId(animalId);
    
    try {
      const animalActivities = await getAnimalActivities(animalId);
      setActivities(animalActivities);
    } catch (error) {
      console.error("Ошибка при загрузке активностей:", error);
    }
  };

  // Моковые данные для графика жизненных показателей
  const vitalSignsData = {
    temperatureData: [
      { date: '01.06', value: 38.2 },
      { date: '02.06', value: 38.5 },
      { date: '03.06', value: 38.1 },
      { date: '04.06', value: 38.7 },
      { date: '05.06', value: 38.3 },
      { date: '06.06', value: 38.4 },
      { date: '07.06', value: 38.2 },
    ],
    heartRateData: [
      { date: '01.06', value: 72 },
      { date: '02.06', value: 76 },
      { date: '03.06', value: 74 },
      { date: '04.06', value: 80 },
      { date: '05.06', value: 75 },
      { date: '06.06', value: 73 },
      { date: '07.06', value: 74 },
    ],
    weightData: [
      { date: '01.06', value: 24.5 },
      { date: '02.06', value: 24.5 },
      { date: '03.06', value: 24.6 },
      { date: '04.06', value: 24.8 },
      { date: '05.06', value: 24.7 },
      { date: '06.06', value: 24.7 },
      { date: '07.06', value: 24.9 },
    ]
  };

  // Моковые данные для лекарств
  const medicationData = [
    {
      id: 1,
      name: 'Антибиотик',
      schedule: 'Ежедневно в 9:00 и 21:00',
      dosage: '10мг',
      status: 'active',
      lastTaken: '2023-06-07T09:00:00',
      nextDue: '2023-06-07T21:00:00',
    },
    {
      id: 2,
      name: 'Витамины',
      schedule: 'Ежедневно в 12:00',
      dosage: '5мл',
      status: 'active',
      lastTaken: '2023-06-06T12:00:00',
      nextDue: '2023-06-07T12:00:00',
    },
    {
      id: 3,
      name: 'Противопаразитарное',
      schedule: 'Ежемесячно',
      dosage: '1 таблетка',
      status: 'upcoming',
      lastTaken: '2023-05-15T10:00:00',
      nextDue: '2023-06-15T10:00:00',
    },
  ];

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader 
            title={`Здравствуйте, ${user?.username || 'Пользователь'}!`}
            subtitle="Система мониторинга здоровья животных"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <AnimalProfileCard 
                selectedAnimalId={selectedAnimalId || undefined}
                onSelectAnimal={handleSelectAnimal}
              />
            </div>
            <div className="lg:col-span-2">
              <HealthMetricsCard animalId={selectedAnimalId || undefined} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-0">
                <VitalSignsChart data={vitalSignsData} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <MedicationTracker medications={medicationData} />
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card>
              <CardContent className="p-0">
                <ActivityLog activities={activities} />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
