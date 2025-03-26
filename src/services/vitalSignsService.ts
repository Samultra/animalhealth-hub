
import { getDB } from './db';

export interface VitalSign {
  id: number;
  animalId: number;
  type: 'temperature' | 'heartRate' | 'weight';
  value: number;
  date: string;
  notes?: string;
}

// Получение всех показателей для животного
export const getAnimalVitalSigns = async (animalId: number) => {
  const db = await getDB();
  const vsIndex = db.transaction('vitalSigns').store.index('by-animal');
  return vsIndex.getAll(animalId);
};

// Получение показателей определенного типа для животного
export const getAnimalVitalSignsByType = async (animalId: number, type: VitalSign['type']) => {
  const db = await getDB();
  const tx = db.transaction('vitalSigns');
  const vsIndex = tx.store.index('by-animal');
  const allSigns = await vsIndex.getAll(animalId);
  return allSigns.filter(sign => sign.type === type);
};

// Добавление нового показателя
export const addVitalSign = async (vitalSign: Omit<VitalSign, 'id'> & { id?: number }) => {
  const db = await getDB();
  const tx = db.transaction('vitalSigns', 'readwrite');
  const vitalSignWithDate = {
    ...vitalSign,
    date: vitalSign.date || new Date().toISOString()
  };
  const id = await tx.store.add(vitalSignWithDate);
  await tx.done;
  return id;
};

// Удаление показателя
export const deleteVitalSign = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('vitalSigns', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};

// Получение последних показателей для животного по типу
export const getLatestVitalSigns = async (animalId: number) => {
  const db = await getDB();
  const vsIndex = db.transaction('vitalSigns').store.index('by-animal');
  const allSigns = await vsIndex.getAll(animalId);
  
  // Группируем по типу и находим последние значения
  const groupedByType = allSigns.reduce((acc, sign) => {
    if (!acc[sign.type] || new Date(sign.date) > new Date(acc[sign.type].date)) {
      acc[sign.type] = sign;
    }
    return acc;
  }, {} as Record<VitalSign['type'], VitalSign>);
  
  return {
    temperature: groupedByType.temperature,
    heartRate: groupedByType.heartRate,
    weight: groupedByType.weight
  };
};

// Получение данных для графика
export const getVitalSignsChartData = async (animalId: number, days: number = 7) => {
  const db = await getDB();
  const vsIndex = db.transaction('vitalSigns').store.index('by-animal');
  const allSigns = await vsIndex.getAll(animalId);
  
  // Фильтруем записи за указанное количество дней
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const filteredSigns = allSigns.filter(sign => new Date(sign.date) >= startDate);
  
  // Группируем по типу и форматируем для графика
  const temperatureData = filteredSigns
    .filter(sign => sign.type === 'temperature')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(sign => ({
      date: new Date(sign.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: sign.value
    }));
  
  const heartRateData = filteredSigns
    .filter(sign => sign.type === 'heartRate')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(sign => ({
      date: new Date(sign.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: sign.value
    }));
  
  const weightData = filteredSigns
    .filter(sign => sign.type === 'weight')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(sign => ({
      date: new Date(sign.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: sign.value
    }));
  
  return {
    temperatureData,
    heartRateData,
    weightData
  };
};
