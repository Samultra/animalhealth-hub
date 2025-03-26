
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { ChevronLeft, Save } from 'lucide-react';
import { addVitalSigns } from '@/services/vitalSignsService';
import { getAnimalById } from '@/services/animalService';

const VitalSignsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [animalName, setAnimalName] = useState<string>('');

  React.useEffect(() => {
    const fetchAnimalInfo = async () => {
      if (!id) return;
      try {
        const animal = await getAnimalById(parseInt(id));
        if (animal) {
          setAnimalName(animal.name);
          if (animal.weight) {
            setWeight(animal.weight.toString());
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке информации о животном:', error);
      }
    };

    fetchAnimalInfo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      toast.error('Идентификатор животного не найден');
      return;
    }
    
    setLoading(true);
    
    try {
      const vitalSignsData = {
        animalId: parseInt(id),
        temperature: parseFloat(temperature),
        heartRate: parseInt(heartRate),
        weight: parseFloat(weight),
        date: new Date().toISOString(),
      };
      
      await addVitalSigns(vitalSignsData);
      toast.success('Показатели здоровья успешно добавлены');
      navigate(`/animals/${id}`);
    } catch (error) {
      console.error('Ошибка при сохранении показателей:', error);
      toast.error('Ошибка при сохранении показателей');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/animals/${id}`)} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Назад</span>
            </Button>
            <h1 className="text-2xl font-bold">Добавление показателей здоровья</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Показатели для {animalName}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="temperature" className="text-sm font-medium">
                    Температура (°C)
                  </label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="38.5"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="heartRate" className="text-sm font-medium">
                    Пульс (уд/мин)
                  </label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="80"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="weight" className="text-sm font-medium">
                    Вес (кг)
                  </label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="5.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> 
                        Сохранить показатели
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </>
  );
};

export default VitalSignsForm;
