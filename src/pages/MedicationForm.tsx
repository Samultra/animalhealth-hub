
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
import { addMedication } from '@/services/medicationService';
import { getAnimalById } from '@/services/animalService';

const MedicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('daily');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
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
      const medicationData = {
        animalId: parseInt(id),
        name,
        dosage,
        frequency,
        startDate,
        endDate: endDate || null,
        notes,
        status: 'active',
      };
      
      await addMedication(medicationData);
      toast.success('Лекарство успешно добавлено');
      navigate(`/animals/${id}`);
    } catch (error) {
      console.error('Ошибка при сохранении лекарства:', error);
      toast.error('Ошибка при сохранении лекарства');
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
            <h1 className="text-2xl font-bold">Добавление лекарства</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Назначение лекарства для {animalName}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Название лекарства
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Антибиотик, витамины и т.д."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="dosage" className="text-sm font-medium">
                    Дозировка
                  </label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                    placeholder="1 таблетка, 5 мл и т.д."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="frequency" className="text-sm font-medium">
                    Частота приема
                  </label>
                  <Select
                    value={frequency}
                    onValueChange={setFrequency}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Выберите частоту приема" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="twice-daily">Дважды в день</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="as-needed">По необходимости</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Дата начала
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      Дата окончания (необязательно)
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Примечания
                  </label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Дополнительные инструкции или примечания"
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
                        Сохранить лекарство
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

export default MedicationForm;
