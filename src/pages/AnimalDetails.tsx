
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { ChevronLeft, Edit, Trash2, Plus, Activity, PawPrint, FileMedical, LineChart } from 'lucide-react';
import { getAnimalById, deleteAnimal, Animal } from '@/services/animalService';
import { getRecentAnimalActivities } from '@/services/activityService';
import { getActiveAnimalMedications } from '@/services/medicationService';
import { getVitalSignsChartData } from '@/services/vitalSignsService';
import AnimalProfileCard from '@/components/dashboard/AnimalProfileCard';
import VitalSignsChart from '@/components/dashboard/VitalSignsChart';
import MedicationTracker from '@/components/dashboard/MedicationTracker';
import ActivityLog from '@/components/dashboard/ActivityLog';

const AnimalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!id) return;

      try {
        const animalId = parseInt(id);
        const animalData = await getAnimalById(animalId);
        
        if (!animalData) {
          toast.error('Животное не найдено');
          navigate('/');
          return;
        }
        
        setAnimal(animalData);
        
        // Загружаем связанные данные
        const [animalActivities, animalMedications, vitalSignsData] = await Promise.all([
          getRecentAnimalActivities(animalId),
          getActiveAnimalMedications(animalId),
          getVitalSignsChartData(animalId)
        ]);
        
        setActivities(animalActivities || []);
        setMedications(animalMedications || []);
        setChartData(vitalSignsData || { temperatureData: [], heartRateData: [], weightData: [] });
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimalData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!animal?.id || !window.confirm('Вы уверены, что хотите удалить это животное?')) return;
    
    try {
      await deleteAnimal(animal.id);
      toast.success('Животное успешно удалено');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      toast.error('Ошибка при удалении животного');
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

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span>Назад</span>
              </Button>
              <h1 className="text-2xl font-bold">{animal?.name}</h1>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/animals/${id}/edit`)} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Редактировать</span>
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Удалить</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              {animal && <AnimalProfileCard animal={animal} />}
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <PawPrint className="h-4 w-4" />
                    <span>Обзор</span>
                  </TabsTrigger>
                  <TabsTrigger value="medications" className="flex items-center gap-1">
                    <FileMedical className="h-4 w-4" />
                    <span>Лекарства</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span>Активности</span>
                  </TabsTrigger>
                  <TabsTrigger value="charts" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    <span>Графики</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Информация о животном</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="divide-y divide-gray-100">
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Вид</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{animal?.species}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Порода</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{animal?.breed}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Возраст</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{animal?.age} лет</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Вес</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{animal?.weight} кг</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Статус здоровья</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {animal?.healthStatus === 'excellent' && 'Отличное'}
                            {animal?.healthStatus === 'good' && 'Хорошее'}
                            {animal?.healthStatus === 'average' && 'Среднее'}
                            {animal?.healthStatus === 'poor' && 'Плохое'}
                            {animal?.healthStatus === 'critical' && 'Критическое'}
                          </dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium leading-6 text-gray-900">Последний осмотр</dt>
                          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {animal?.lastCheckup ? new Date(animal.lastCheckup).toLocaleDateString('ru-RU') : 'Не указано'}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => navigate(`/animals/${id}/vital-signs/add`)} className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Добавить показатель</span>
                    </Button>
                    <Button onClick={() => navigate(`/animals/${id}/medications/add`)} className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Добавить лекарство</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="medications">
                  <Card>
                    <CardContent className="p-0">
                      <MedicationTracker medications={medications} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activities">
                  <Card>
                    <CardContent className="p-0">
                      <ActivityLog activities={activities} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="charts">
                  <Card>
                    <CardContent className="p-0">
                      <VitalSignsChart data={chartData} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default AnimalDetails;
