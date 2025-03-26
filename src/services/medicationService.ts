
import { getDB } from './db';
import { addActivity } from './activityService';

export interface Medication {
  id?: number;
  animalId: number;
  name: string;
  schedule: string;
  dosage: string;
  status: 'active' | 'completed' | 'cancelled' | 'upcoming';
  lastTaken: string;
  nextDue: string;
}

// Получение всех лекарств для животного
export const getAnimalMedications = async (animalId: number) => {
  const db = await getDB();
  const medIndex = db.transaction('medications').store.index('by-animal');
  return medIndex.getAll(animalId);
};

// Получение активных лекарств для животного
export const getActiveAnimalMedications = async (animalId: number) => {
  const db = await getDB();
  const tx = db.transaction('medications');
  const medIndex = tx.store.index('by-animal');
  const allMeds = await medIndex.getAll(animalId);
  return allMeds.filter(med => med.status === 'active' || med.status === 'upcoming');
};

// Добавление нового лекарства
export const addMedication = async (medication: Medication) => {
  const db = await getDB();
  const tx = db.transaction('medications', 'readwrite');
  const id = await tx.store.add(medication);
  await tx.done;
  return id;
};

// Обновление информации о лекарстве
export const updateMedication = async (id: number, data: Partial<Medication>) => {
  const db = await getDB();
  const tx = db.transaction('medications', 'readwrite');
  const medication = await tx.store.get(id);
  
  if (!medication) {
    throw new Error('Лекарство не найдено');
  }
  
  const updatedMedication = { ...medication, ...data };
  await tx.store.put(updatedMedication);
  await tx.done;
  return updatedMedication;
};

// Удаление лекарства
export const deleteMedication = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('medications', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};

// Отметка приема лекарства
export const markMedicationTaken = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('medications', 'readwrite');
  const medication = await tx.store.get(id);
  
  if (!medication) {
    throw new Error('Лекарство не найдено');
  }
  
  // Вычисляем следующую дату приема (простая логика для демо)
  const now = new Date();
  const nextDay = new Date();
  nextDay.setDate(now.getDate() + 1);
  
  const updatedMedication = { 
    ...medication, 
    lastTaken: now.toISOString(),
    nextDue: nextDay.toISOString()
  };
  
  await tx.store.put(updatedMedication);
  await tx.done;
  
  // Добавляем активность
  await addActivity({
    animalId: medication.animalId,
    type: 'Прием лекарства',
    description: `${medication.name} - ${medication.dosage}`,
    timestamp: now.toISOString(),
    status: 'completed'
  });
  
  return updatedMedication;
};
