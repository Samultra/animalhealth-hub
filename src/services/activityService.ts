
import { getDB } from './db';

export interface Activity {
  id: number;
  animalId: number;
  type: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Получение всех активностей для животного
export const getAnimalActivities = async (animalId: number) => {
  const db = await getDB();
  const actIndex = db.transaction('activities').store.index('by-animal');
  return actIndex.getAll(animalId);
};

// Получение последних активностей для животного
export const getRecentAnimalActivities = async (animalId: number, limit: number = 10) => {
  const db = await getDB();
  const actIndex = db.transaction('activities').store.index('by-animal');
  const activities = await actIndex.getAll(animalId);
  
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

// Добавление новой активности
export const addActivity = async (activity: Omit<Activity, 'id'> & { id?: number }) => {
  const db = await getDB();
  const tx = db.transaction('activities', 'readwrite');
  const activityWithTimestamp = {
    ...activity,
    timestamp: activity.timestamp || new Date().toISOString()
  };
  const id = await tx.store.add(activityWithTimestamp);
  await tx.done;
  return id;
};

// Обновление статуса активности
export const updateActivityStatus = async (id: number, status: Activity['status']) => {
  const db = await getDB();
  const tx = db.transaction('activities', 'readwrite');
  const activity = await tx.store.get(id);
  
  if (!activity) {
    throw new Error('Активность не найдена');
  }
  
  const updatedActivity = { ...activity, status };
  await tx.store.put(updatedActivity);
  await tx.done;
  return updatedActivity;
};

// Удаление активности
export const deleteActivity = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('activities', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};
