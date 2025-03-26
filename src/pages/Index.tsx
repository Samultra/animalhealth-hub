
import React from 'react';
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

const Index: React.FC = () => {
  const { user } = useAuth();

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

  // Моковые данные для активности
  const activityData = [
    {
      id: 1,
      type: 'Прием лекарства',
      description: 'Антибиотик - утренняя доза',
      timestamp: '2023-06-07T09:05:23',
      status: 'completed',
    },
    {
      id: 2,
      type: 'Медицинский осмотр',
      description: 'Плановый осмотр ветеринаром',
      timestamp: '2023-06-06T14:30:00',
      status: 'completed',
    },
    {
      id: 3,
      type: 'Измерение температуры',
      description: '38.3°C',
      timestamp: '2023-06-06T09:15:45',
      status: 'completed',
    },
    {
      id: 4,
      type: 'Вакцинация',
      description: 'Ежегодная прививка',
      timestamp: '2023-06-01T11:20:18',
      status: 'completed',
    },
    {
      id: 5,
      type: 'Активность',
      description: 'Прогулка - 30 минут',
      timestamp: '2023-06-05T16:45:00',
      status: 'completed',
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
              <AnimalProfileCard />
            </div>
            <div className="lg:col-span-2">
              <HealthMetricsCard />
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
                <ActivityLog activities={activityData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
