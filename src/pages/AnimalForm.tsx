
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { createAnimal } from '@/services/animalService';
import { toast } from "sonner";
import { PawPrint } from 'lucide-react';

const AnimalForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'Кошка',
    breed: '',
    age: '',
    weight: '',
    imageUrl: '/placeholder.svg',
    healthStatus: 'good' as "excellent" | "good" | "average" | "poor" | "critical"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Преобразуем возраст и вес в числа
      const age = parseInt(formData.age);
      const weight = parseFloat(formData.weight);
      
      if (isNaN(age) || isNaN(weight)) {
        throw new Error('Возраст и вес должны быть числами');
      }
      
      const newAnimal = {
        ...formData,
        age,
        weight,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        lastCheckup: new Date().toISOString()
      };
      
      await createAnimal(newAnimal);
      toast.success('Животное успешно добавлено');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при добавлении животного:', error);
      toast.error('Ошибка при добавлении животного');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <PawPrint className="h-8 w-8 text-primary" />
                <CardTitle>Добавление нового животного</CardTitle>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Кличка животного</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Например: Барсик"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="species">Вид животного</Label>
                  <Select 
                    name="species" 
                    value={formData.species} 
                    onValueChange={(value) => handleSelectChange('species', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вид животного" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Кошка">Кошка</SelectItem>
                      <SelectItem value="Собака">Собака</SelectItem>
                      <SelectItem value="Птица">Птица</SelectItem>
                      <SelectItem value="Грызун">Грызун</SelectItem>
                      <SelectItem value="Рептилия">Рептилия</SelectItem>
                      <SelectItem value="Другое">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breed">Порода</Label>
                  <Input
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="Например: Сиамская"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Возраст (лет)</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min="0"
                      max="30"
                      step="0.5"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      placeholder="Например: 3"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Вес (кг)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      max="200"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      placeholder="Например: 4.5"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Статус здоровья</Label>
                  <Select 
                    name="healthStatus" 
                    value={formData.healthStatus} 
                    onValueChange={(value) => handleSelectChange('healthStatus', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус здоровья" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Отличное</SelectItem>
                      <SelectItem value="good">Хорошее</SelectItem>
                      <SelectItem value="average">Среднее</SelectItem>
                      <SelectItem value="poor">Плохое</SelectItem>
                      <SelectItem value="critical">Критическое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/')}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Добавить животное'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </PageTransition>
    </>
  );
};

export default AnimalForm;
