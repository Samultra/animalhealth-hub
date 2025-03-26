
import { openDB } from 'idb';
import { initDB } from './db';

export interface VitalSigns {
  id?: number;
  animalId: number;
  temperature: number;
  heartRate: number;
  weight: number;
  date: string;
}

export const addVitalSigns = async (vitalSigns: VitalSigns): Promise<number> => {
  const db = await openDB('animalHealth', 1);
  
  const id = await db.add('vitalSigns', vitalSigns);
  
  // Обновляем информацию о животном
  const tx = db.transaction('animals', 'readwrite');
  const animalStore = tx.objectStore('animals');
  const animal = await animalStore.get(vitalSigns.animalId);
  
  if (animal) {
    animal.temperature = vitalSigns.temperature;
    animal.heartRate = vitalSigns.heartRate;
    animal.weight = vitalSigns.weight;
    animal.lastCheckup = new Date().toISOString().split('T')[0];
    await animalStore.put(animal);
  }
  
  // Добавляем запись в активности
  const activityTx = db.transaction('activities', 'readwrite');
  const activityStore = activityTx.objectStore('activities');
  
  await activityStore.add({
    animalId: vitalSigns.animalId,
    type: 'health-check',
    date: new Date().toISOString(),
    duration: 'Н/Д',
    intensity: 'medium',
    notes: `Измерение показателей: температура ${vitalSigns.temperature}°C, пульс ${vitalSigns.heartRate}, вес ${vitalSigns.weight} кг`
  });
  
  return id;
};

export const getVitalSignsChartData = async (animalId: number) => {
  const db = await openDB('animalHealth', 1);
  
  const vitalSigns = await db.getAllFromIndex('vitalSigns', 'animalId', animalId);
  
  // Сортируем по дате
  vitalSigns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Форматируем данные для графиков
  const temperatureData = vitalSigns.map(vs => ({
    date: new Date(vs.date).toLocaleDateString('ru-RU'),
    value: vs.temperature
  }));
  
  const heartRateData = vitalSigns.map(vs => ({
    date: new Date(vs.date).toLocaleDateString('ru-RU'),
    value: vs.heartRate
  }));
  
  const weightData = vitalSigns.map(vs => ({
    date: new Date(vs.date).toLocaleDateString('ru-RU'),
    value: vs.weight
  }));
  
  return {
    temperatureData,
    heartRateData,
    weightData
  };
};
