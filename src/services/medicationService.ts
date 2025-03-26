
import { openDB } from 'idb';
import { initDB } from './db';

export interface Medication {
  id?: number;
  animalId: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const addMedication = async (medication: Medication): Promise<number> => {
  const db = await openDB('animalHealth', 1);
  
  const id = await db.add('medications', medication);
  
  // Добавляем запись в активности
  const activityTx = db.transaction('activities', 'readwrite');
  const activityStore = activityTx.objectStore('activities');
  
  await activityStore.add({
    animalId: medication.animalId,
    type: 'medication-added',
    date: new Date().toISOString(),
    duration: 'Н/Д',
    intensity: 'medium',
    notes: `Назначено лекарство: ${medication.name}, дозировка: ${medication.dosage}`
  });
  
  return id;
};

export const getActiveAnimalMedications = async (animalId: number) => {
  const db = await openDB('animalHealth', 1);
  
  const medications = await db.getAllFromIndex('medications', 'animalId', animalId);
  
  // Генерируем id для frontend если его нет
  const medicationsWithIds = medications.map(med => {
    const now = new Date();
    const startDate = new Date(med.startDate);
    const endDate = med.endDate ? new Date(med.endDate) : null;
    
    // Определяем статус (completed, upcoming, missed)
    let status = "upcoming";
    if (endDate && endDate < now) {
      status = "completed";
    } else if (startDate > now) {
      status = "upcoming";
    } else {
      status = Math.random() > 0.7 ? "missed" : "completed"; // Для демонстрации
    }
    
    // Форматируем время для отображения
    const timeHours = 8 + Math.floor(Math.random() * 12);
    const timeMinutes = Math.floor(Math.random() * 60);
    const formattedTime = `${timeHours}:${timeMinutes < 10 ? '0' + timeMinutes : timeMinutes}`;
    
    return {
      id: med.id?.toString() || Math.random().toString(36).substring(2, 11),
      name: med.name,
      dosage: med.dosage,
      schedule: med.frequency === 'daily' ? 'Ежедневно' : 
                med.frequency === 'twice-daily' ? 'Дважды в день' : 
                med.frequency === 'weekly' ? 'Еженедельно' : 'По необходимости',
      status: status,
      time: formattedTime
    };
  });
  
  return medicationsWithIds;
};
