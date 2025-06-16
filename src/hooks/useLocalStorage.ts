import { useState, useEffect } from 'react';

// أنواع البيانات
export interface Brand {
  id: string;
  name: string;
  created_at: string;
}

export interface Model {
  id: string;
  name: string;
  brand_id: string;
  created_at: string;
  brand?: Brand;
}

export interface SparePart {
  id: string;
  name: string;
  part_type: string;
  screen_quality?: string;
  brand_id: string;
  model_id: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  low_stock_alert: number;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  model?: Model;
}

export interface RepairRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  device_brand_id: string;
  device_model_id: string;
  issue_type: string;
  description: string;
  labor_cost: number;
  total_cost: number;
  profit: number;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  completed_at?: string;
  updated_at: string;
  brand?: Brand;
  model?: Model;
  repair_parts?: RepairPart[];
}

export interface RepairPart {
  id: string;
  repair_id: string;
  spare_part_id: string;
  quantity_used: number;
  price_at_time: number;
  created_at: string;
  spare_part?: SparePart;
}

export interface WorkshopSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  thank_you_message: string;
  created_at: string;
  updated_at: string;
}

// دالة مساعدة لتوليد ID فريد
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// دالة مساعدة للحصول على البيانات من localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// دالة مساعدة لحفظ البيانات في localStorage
const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// البيانات الافتراضية
const defaultBrands: Brand[] = [
  { id: '1', name: 'Apple', created_at: new Date().toISOString() },
  { id: '2', name: 'Samsung', created_at: new Date().toISOString() },
  { id: '3', name: 'Huawei', created_at: new Date().toISOString() },
  { id: '4', name: 'Xiaomi', created_at: new Date().toISOString() },
  { id: '5', name: 'Oppo', created_at: new Date().toISOString() },
];

const defaultModels: Model[] = [
  { id: '1', name: 'iPhone 15 Pro', brand_id: '1', created_at: new Date().toISOString() },
  { id: '2', name: 'iPhone 14', brand_id: '1', created_at: new Date().toISOString() },
  { id: '3', name: 'Galaxy S24', brand_id: '2', created_at: new Date().toISOString() },
  { id: '4', name: 'Galaxy A54', brand_id: '2', created_at: new Date().toISOString() },
  { id: '5', name: 'P60 Pro', brand_id: '3', created_at: new Date().toISOString() },
];

const defaultSettings: WorkshopSettings = {
  id: '1',
  name: 'ورشة الهواتف الذكية',
  address: 'شارع الجمهورية، المنصورة، الدقهلية',
  phone: '01234567890',
  thank_you_message: 'شكراً لثقتكم بنا، نتمنى لكم تجربة ممتازة',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Hook لإدارة الماركات
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedBrands = getFromStorage('brands', defaultBrands);
    setBrands(storedBrands);
    setLoading(false);
  }, []);

  const addBrand = async (name: string): Promise<Brand> => {
    const newBrand: Brand = {
      id: generateId(),
      name,
      created_at: new Date().toISOString()
    };

    const updatedBrands = [...brands, newBrand];
    setBrands(updatedBrands);
    saveToStorage('brands', updatedBrands);
    return newBrand;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand | null> => {
    const updatedBrands = brands.map(brand => 
      brand.id === id ? { ...brand, ...updates } : brand
    );
    setBrands(updatedBrands);
    saveToStorage('brands', updatedBrands);
    return updatedBrands.find(b => b.id === id) || null;
  };

  const deleteBrand = async (id: string): Promise<void> => {
    const updatedBrands = brands.filter(brand => brand.id !== id);
    setBrands(updatedBrands);
    saveToStorage('brands', updatedBrands);
  };

  const refetch = () => {
    const storedBrands = getFromStorage('brands', defaultBrands);
    setBrands(storedBrands);
  };

  return { brands, loading, error, addBrand, updateBrand, deleteBrand, refetch };
};

// Hook لإدارة الموديلات
export const useModels = (brandId?: string) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { brands } = useBrands();

  useEffect(() => {
    const storedModels = getFromStorage('models', defaultModels);
    const modelsWithBrands = storedModels.map(model => ({
      ...model,
      brand: brands.find(b => b.id === model.brand_id)
    }));
    
    const filteredModels = brandId 
      ? modelsWithBrands.filter(model => model.brand_id === brandId)
      : modelsWithBrands;
    
    setModels(filteredModels);
    setLoading(false);
  }, [brandId, brands]);

  const addModel = async (name: string, brandId: string): Promise<Model> => {
    const newModel: Model = {
      id: generateId(),
      name,
      brand_id: brandId,
      created_at: new Date().toISOString()
    };

    const allModels = getFromStorage('models', defaultModels);
    const updatedModels = [...allModels, newModel];
    saveToStorage('models', updatedModels);
    
    const modelWithBrand = {
      ...newModel,
      brand: brands.find(b => b.id === brandId)
    };
    
    setModels(prev => [...prev, modelWithBrand]);
    return modelWithBrand;
  };

  const updateModel = async (id: string, updates: Partial<Model>): Promise<Model | null> => {
    const allModels = getFromStorage('models', defaultModels);
    const updatedAllModels = allModels.map(model => 
      model.id === id ? { ...model, ...updates } : model
    );
    saveToStorage('models', updatedAllModels);
    
    const updatedModels = models.map(model => 
      model.id === id ? { ...model, ...updates } : model
    );
    setModels(updatedModels);
    return updatedModels.find(m => m.id === id) || null;
  };

  const deleteModel = async (id: string): Promise<void> => {
    const allModels = getFromStorage('models', defaultModels);
    const updatedAllModels = allModels.filter(model => model.id !== id);
    saveToStorage('models', updatedAllModels);
    
    const updatedModels = models.filter(model => model.id !== id);
    setModels(updatedModels);
  };

  const refetch = () => {
    const storedModels = getFromStorage('models', defaultModels);
    const modelsWithBrands = storedModels.map(model => ({
      ...model,
      brand: brands.find(b => b.id === model.brand_id)
    }));
    
    const filteredModels = brandId 
      ? modelsWithBrands.filter(model => model.brand_id === brandId)
      : modelsWithBrands;
    
    setModels(filteredModels);
  };

  return { models, loading, error, addModel, updateModel, deleteModel, refetch };
};

// Hook لإدارة قطع الغيار
export const useSpareParts = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { brands } = useBrands();
  const { models } = useModels();

  useEffect(() => {
    const storedParts = getFromStorage('spareParts', []);
    const partsWithRelations = storedParts.map((part: SparePart) => ({
      ...part,
      brand: brands.find(b => b.id === part.brand_id),
      model: models.find(m => m.id === part.model_id)
    }));
    setSpareParts(partsWithRelations);
    setLoading(false);
  }, [brands, models]);

  const addSparePart = async (sparePart: Omit<SparePart, 'id' | 'created_at' | 'updated_at'>): Promise<SparePart> => {
    const newSparePart: SparePart = {
      ...sparePart,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedParts = [...spareParts, newSparePart];
    setSpareParts(updatedParts);
    saveToStorage('spareParts', updatedParts);
    return newSparePart;
  };

  const updateSparePart = async (id: string, updates: Partial<SparePart>): Promise<SparePart | null> => {
    const updatedParts = spareParts.map(part => 
      part.id === id ? { ...part, ...updates, updated_at: new Date().toISOString() } : part
    );
    setSpareParts(updatedParts);
    saveToStorage('spareParts', updatedParts);
    return updatedParts.find(p => p.id === id) || null;
  };

  const deleteSparePart = async (id: string): Promise<void> => {
    const updatedParts = spareParts.filter(part => part.id !== id);
    setSpareParts(updatedParts);
    saveToStorage('spareParts', updatedParts);
  };

  const refetch = () => {
    const storedParts = getFromStorage('spareParts', []);
    const partsWithRelations = storedParts.map((part: SparePart) => ({
      ...part,
      brand: brands.find(b => b.id === part.brand_id),
      model: models.find(m => m.id === part.model_id)
    }));
    setSpareParts(partsWithRelations);
  };

  return { spareParts, loading, error, addSparePart, updateSparePart, deleteSparePart, refetch };
};

// Hook لإدارة طلبات الإصلاح
export const useRepairRequests = () => {
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { brands } = useBrands();
  const { models } = useModels();

  useEffect(() => {
    const storedRepairs = getFromStorage('repairs', []);
    const repairsWithRelations = storedRepairs.map((repair: RepairRequest) => ({
      ...repair,
      brand: brands.find(b => b.id === repair.device_brand_id),
      model: models.find(m => m.id === repair.device_model_id)
    }));
    setRepairs(repairsWithRelations);
    setLoading(false);
  }, [brands, models]);

  const addRepair = async (
    repair: Omit<RepairRequest, 'id' | 'created_at' | 'updated_at'>, 
    usedParts?: { spare_part_id: string; quantity_used: number; price_at_time: number }[]
  ): Promise<RepairRequest> => {
    const newRepair: RepairRequest = {
      ...repair,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // إضافة القطع المستخدمة
    if (usedParts && usedParts.length > 0) {
      const repairParts: RepairPart[] = usedParts.map(part => ({
        id: generateId(),
        repair_id: newRepair.id,
        spare_part_id: part.spare_part_id,
        quantity_used: part.quantity_used,
        price_at_time: part.price_at_time,
        created_at: new Date().toISOString()
      }));
      
      // حفظ القطع المستخدمة
      const existingRepairParts = getFromStorage('repairParts', []);
      saveToStorage('repairParts', [...existingRepairParts, ...repairParts]);
      
      newRepair.repair_parts = repairParts;
    }

    const updatedRepairs = [newRepair, ...repairs];
    setRepairs(updatedRepairs);
    saveToStorage('repairs', updatedRepairs);
    return newRepair;
  };

  const updateRepairStatus = async (id: string, status: RepairRequest['status']): Promise<RepairRequest | null> => {
    const updates: Partial<RepairRequest> = { 
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const updatedRepairs = repairs.map(repair => 
      repair.id === id ? { ...repair, ...updates } : repair
    );
    setRepairs(updatedRepairs);
    saveToStorage('repairs', updatedRepairs);
    return updatedRepairs.find(r => r.id === id) || null;
  };

  const updateRepair = async (id: string, updates: Partial<RepairRequest>): Promise<RepairRequest | null> => {
    const updatedRepairs = repairs.map(repair => 
      repair.id === id ? { ...repair, ...updates, updated_at: new Date().toISOString() } : repair
    );
    setRepairs(updatedRepairs);
    saveToStorage('repairs', updatedRepairs);
    return updatedRepairs.find(r => r.id === id) || null;
  };

  const deleteRepair = async (id: string): Promise<void> => {
    const updatedRepairs = repairs.filter(repair => repair.id !== id);
    setRepairs(updatedRepairs);
    saveToStorage('repairs', updatedRepairs);
  };

  const refetch = () => {
    const storedRepairs = getFromStorage('repairs', []);
    const repairsWithRelations = storedRepairs.map((repair: RepairRequest) => ({
      ...repair,
      brand: brands.find(b => b.id === repair.device_brand_id),
      model: models.find(m => m.id === repair.device_model_id)
    }));
    setRepairs(repairsWithRelations);
  };

  return { repairs, loading, error, addRepair, updateRepairStatus, updateRepair, deleteRepair, refetch };
};

// Hook لإدارة إعدادات الورشة
export const useWorkshopSettings = () => {
  const [settings, setSettings] = useState<WorkshopSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSettings = getFromStorage('workshopSettings', defaultSettings);
    setSettings(storedSettings);
    setLoading(false);
  }, []);

  const updateSettings = async (updates: Partial<WorkshopSettings>): Promise<WorkshopSettings> => {
    const updatedSettings = {
      ...settings,
      ...updates,
      updated_at: new Date().toISOString()
    };
    setSettings(updatedSettings);
    saveToStorage('workshopSettings', updatedSettings);
    return updatedSettings;
  };

  const refetch = () => {
    const storedSettings = getFromStorage('workshopSettings', defaultSettings);
    setSettings(storedSettings);
  };

  return { settings, loading, error, updateSettings, refetch };
};