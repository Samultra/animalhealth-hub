
import { openDB } from 'idb';
import { initDB } from './db';

export interface Activity {
  id?: number;
  animalId: number;
  type: string;
  duration: string;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
  date: string;
}

export const addActivity = async (activity: Activity): Promise<number> => {
  const db = await openDB('animalHealth', 1);
  return db.add('activities', activity);
};

export const getAnimalActivities = async (animalId: number) => {
  const db = await openDB('animalHealth', 1);
  
  const activities = await db.getAllFromIndex('activities', 'animalId', animalId);
  
  // Сортируем по дате (сначала новые)
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Форматируем для отображения
  return activities.map(activity => {
    const activityType = 
      activity.type === 'walk' ? 'Прогулка' :
      activity.type === 'play' ? 'Игра' :
      activity.type === 'training' ? 'Тренировка' :
      activity.type === 'grooming' ? 'Уход' :
      activity.type === 'vet-visit' ? 'Посещение ветеринара' :
      activity.type === 'health-check' ? 'Проверка здоровья' :
      activity.type === 'medication-added' ? 'Назначение лекарства' :
      'Другое';
      
    return {
      id: activity.id?.toString() || Math.random().toString(36).substring(2, 11),
      type: activityType,
      duration: activity.duration,
      date: new Date(activity.date).toLocaleDateString('ru-RU'),
      intensity: activity.intensity,
      notes: activity.notes
    };
  });
};

export const getRecentAnimalActivities = async (animalId: number) => {
  const activities = await getAnimalActivities(animalId);
  return activities.slice(0, 5); // Возвращаем только 5 последних активностей
};
