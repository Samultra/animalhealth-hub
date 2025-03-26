
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { ChevronLeft, Save } from 'lucide-react';
import { addActivity } from '@/services/activityService';
import { getAnimalById } from '@/services/animalService';

const ActivityForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [type, setType] = useState<string>('walk');
  const [duration, setDuration] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('medium');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [animalName, setAnimalName] = useState<string>('');

  useEffect(() => {
    const fetchAnimalInfo = async () => {
      if (!id) return;
      try {
        const animal = await getAnimalById(parseInt(id));
        if (animal) {
          setAnimalName(animal.name);
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
      const activityData = {
        animalId: parseInt(id),
        type,
        duration: `${duration} минут`,
        intensity,
        notes,
        date: new Date().toISOString(),
      };
      
      await addActivity(activityData);
      toast.success('Активность успешно добавлена');
      navigate(`/animals/${id}`);
    } catch (error) {
      console.error('Ошибка при сохранении активности:', error);
      toast.error('Ошибка при сохранении активности');
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
            <h1 className="text-2xl font-bold">Добавление активности</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Регистрация активности для {animalName}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Тип активности
                  </label>
                  <Select
                    value={type}
                    onValueChange={setType}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Выберите тип активности" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk">Прогулка</SelectItem>
                      <SelectItem value="play">Игра</SelectItem>
                      <SelectItem value="training">Тренировка</SelectItem>
                      <SelectItem value="grooming">Уход</SelectItem>
                      <SelectItem value="vet-visit">Посещение ветеринара</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">
                    Продолжительность (минут)
                  </label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    placeholder="30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="intensity" className="text-sm font-medium">
                    Интенсивность
                  </label>
                  <Select
                    value={intensity}
                    onValueChange={setIntensity}
                  >
                    <SelectTrigger id="intensity">
                      <SelectValue placeholder="Выберите интенсивность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкая</SelectItem>
                      <SelectItem value="medium">Средняя</SelectItem>
                      <SelectItem value="high">Высокая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Примечания
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Дополнительная информация об активности"
                    rows={3}
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
                        Сохранить активность
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

export default ActivityForm;
