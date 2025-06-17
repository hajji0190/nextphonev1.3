import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';

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

// دالة مساعدة لتحويل Timestamp إلى string
const timestampToString = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp || new Date().toISOString();
};

// Hook لإدارة الماركات
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'brands'), orderBy('created_at', 'desc')),
      (snapshot) => {
        const brandsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: timestampToString(doc.data().created_at)
        })) as Brand[];
        setBrands(brandsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addBrand = async (name: string): Promise<Brand> => {
    const newBrand = {
      name,
      created_at: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'brands'), newBrand);
    const brand: Brand = {
      id: docRef.id,
      name,
      created_at: new Date().toISOString()
    };
    return brand;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>): Promise<Brand | null> => {
    await updateDoc(doc(db, 'brands', id), updates);
    const updatedBrand = brands.find(b => b.id === id);
    return updatedBrand ? { ...updatedBrand, ...updates } : null;
  };

  const deleteBrand = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'brands', id));
  };

  const refetch = () => {
    // البيانات تتحدث تلقائياً مع onSnapshot
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
    let q = query(collection(db, 'models'), orderBy('created_at', 'desc'));
    
    if (brandId) {
      q = query(collection(db, 'models'), where('brand_id', '==', brandId), orderBy('created_at', 'desc'));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const modelsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: timestampToString(data.created_at),
            brand: brands.find(b => b.id === data.brand_id)
          };
        }) as Model[];
        setModels(modelsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [brandId, brands]);

  const addModel = async (name: string, brandId: string): Promise<Model> => {
    const newModel = {
      name,
      brand_id: brandId,
      created_at: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'models'), newModel);
    const model: Model = {
      id: docRef.id,
      name,
      brand_id: brandId,
      created_at: new Date().toISOString(),
      brand: brands.find(b => b.id === brandId)
    };
    return model;
  };

  const updateModel = async (id: string, updates: Partial<Model>): Promise<Model | null> => {
    await updateDoc(doc(db, 'models', id), updates);
    const updatedModel = models.find(m => m.id === id);
    return updatedModel ? { ...updatedModel, ...updates } : null;
  };

  const deleteModel = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'models', id));
  };

  const refetch = () => {
    // البيانات تتحدث تلقائياً مع onSnapshot
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
    const unsubscribe = onSnapshot(
      query(collection(db, 'spare_parts'), orderBy('created_at', 'desc')),
      (snapshot) => {
        const partsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: timestampToString(data.created_at),
            updated_at: timestampToString(data.updated_at),
            brand: brands.find(b => b.id === data.brand_id),
            model: models.find(m => m.id === data.model_id)
          };
        }) as SparePart[];
        setSpareParts(partsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [brands, models]);

  const addSparePart = async (sparePart: Omit<SparePart, 'id' | 'created_at' | 'updated_at'>): Promise<SparePart> => {
    const newSparePart = {
      ...sparePart,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'spare_parts'), newSparePart);
    const part: SparePart = {
      ...sparePart,
      id: docRef.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brand: brands.find(b => b.id === sparePart.brand_id),
      model: models.find(m => m.id === sparePart.model_id)
    };
    return part;
  };

  const updateSparePart = async (id: string, updates: Partial<SparePart>): Promise<SparePart | null> => {
    const updateData = {
      ...updates,
      updated_at: Timestamp.now()
    };
    await updateDoc(doc(db, 'spare_parts', id), updateData);
    const updatedPart = spareParts.find(p => p.id === id);
    return updatedPart ? { ...updatedPart, ...updates, updated_at: new Date().toISOString() } : null;
  };

  const deleteSparePart = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'spare_parts', id));
  };

  const refetch = () => {
    // البيانات تتحدث تلقائياً مع onSnapshot
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
    const unsubscribe = onSnapshot(
      query(collection(db, 'repair_requests'), orderBy('created_at', 'desc')),
      async (snapshot) => {
        const repairsData = await Promise.all(
          snapshot.docs.map(async (repairDoc) => {
            const repairData = repairDoc.data();
            
            // جلب القطع المستخدمة
            const repairPartsSnapshot = await getDocs(
              query(collection(db, 'repair_parts'), where('repair_id', '==', repairDoc.id))
            );
            
            const repairParts = repairPartsSnapshot.docs.map(partDoc => ({
              id: partDoc.id,
              ...partDoc.data(),
              created_at: timestampToString(partDoc.data().created_at)
            })) as RepairPart[];

            return {
              id: repairDoc.id,
              ...repairData,
              created_at: timestampToString(repairData.created_at),
              updated_at: timestampToString(repairData.updated_at),
              completed_at: repairData.completed_at ? timestampToString(repairData.completed_at) : undefined,
              brand: brands.find(b => b.id === repairData.device_brand_id),
              model: models.find(m => m.id === repairData.device_model_id),
              repair_parts: repairParts
            };
          })
        );
        setRepairs(repairsData as RepairRequest[]);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [brands, models]);

  const addRepair = async (
    repair: Omit<RepairRequest, 'id' | 'created_at' | 'updated_at'>, 
    usedParts?: { spare_part_id: string; quantity_used: number; price_at_time: number }[]
  ): Promise<RepairRequest> => {
    const batch = writeBatch(db);

    // إضافة الإصلاح
    const repairRef = doc(collection(db, 'repair_requests'));
    const newRepair = {
      ...repair,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    };
    batch.set(repairRef, newRepair);

    // إضافة القطع المستخدمة وتحديث المخزون
    if (usedParts && usedParts.length > 0) {
      for (const part of usedParts) {
        // إضافة القطعة المستخدمة
        const repairPartRef = doc(collection(db, 'repair_parts'));
        batch.set(repairPartRef, {
          repair_id: repairRef.id,
          spare_part_id: part.spare_part_id,
          quantity_used: part.quantity_used,
          price_at_time: part.price_at_time,
          created_at: Timestamp.now()
        });

        // تقليل الكمية من المخزون
        const sparePartRef = doc(db, 'spare_parts', part.spare_part_id);
        const sparePartDoc = await getDocs(query(collection(db, 'spare_parts'), where('__name__', '==', part.spare_part_id)));
        if (!sparePartDoc.empty) {
          const currentQuantity = sparePartDoc.docs[0].data().quantity;
          batch.update(sparePartRef, {
            quantity: Math.max(0, currentQuantity - part.quantity_used),
            updated_at: Timestamp.now()
          });
        }
      }
    }

    await batch.commit();

    const repairWithRelations: RepairRequest = {
      ...repair,
      id: repairRef.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brand: brands.find(b => b.id === repair.device_brand_id),
      model: models.find(m => m.id === repair.device_model_id)
    };

    return repairWithRelations;
  };

  const updateRepairStatus = async (id: string, status: RepairRequest['status']): Promise<RepairRequest | null> => {
    const updates: any = { 
      status,
      updated_at: Timestamp.now()
    };
    
    if (status === 'completed') {
      updates.completed_at = Timestamp.now();
    }

    await updateDoc(doc(db, 'repair_requests', id), updates);
    const updatedRepair = repairs.find(r => r.id === id);
    return updatedRepair ? { ...updatedRepair, status, updated_at: new Date().toISOString() } : null;
  };

  const deleteRepair = async (id: string): Promise<void> => {
    const batch = writeBatch(db);

    // جلب القطع المستخدمة لإرجاعها للمخزون
    const repairPartsSnapshot = await getDocs(
      query(collection(db, 'repair_parts'), where('repair_id', '==', id))
    );

    // إرجاع القطع للمخزون
    for (const partDoc of repairPartsSnapshot.docs) {
      const partData = partDoc.data();
      const sparePartRef = doc(db, 'spare_parts', partData.spare_part_id);
      const sparePartSnapshot = await getDocs(
        query(collection(db, 'spare_parts'), where('__name__', '==', partData.spare_part_id))
      );
      
      if (!sparePartSnapshot.empty) {
        const currentQuantity = sparePartSnapshot.docs[0].data().quantity;
        batch.update(sparePartRef, {
          quantity: currentQuantity + partData.quantity_used,
          updated_at: Timestamp.now()
        });
      }

      // حذف القطعة المستخدمة
      batch.delete(doc(db, 'repair_parts', partDoc.id));
    }

    // حذف الإصلاح
    batch.delete(doc(db, 'repair_requests', id));

    await batch.commit();
  };

  const refetch = () => {
    // البيانات تتحدث تلقائياً مع onSnapshot
  };

  return { repairs, loading, error, addRepair, updateRepairStatus, deleteRepair, refetch };
};

// Hook لإدارة إعدادات الورشة
export const useWorkshopSettings = () => {
  const [settings, setSettings] = useState<WorkshopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'workshop_settings'),
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const settingsData = {
            id: doc.id,
            ...doc.data(),
            created_at: timestampToString(doc.data().created_at),
            updated_at: timestampToString(doc.data().updated_at)
          } as WorkshopSettings;
          setSettings(settingsData);
        } else {
          // إنشاء إعدادات افتراضية
          const defaultSettings = {
            name: 'ورشة الهواتف الذكية',
            address: '',
            phone: '',
            thank_you_message: 'شكراً لثقتكم بنا، نتمنى لكم تجربة ممتازة',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now()
          };
          
          addDoc(collection(db, 'workshop_settings'), defaultSettings).then((docRef) => {
            setSettings({
              id: docRef.id,
              ...defaultSettings,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as WorkshopSettings);
          });
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateSettings = async (updates: Partial<WorkshopSettings>): Promise<WorkshopSettings | null> => {
    if (!settings) return null;

    const updateData = {
      ...updates,
      updated_at: Timestamp.now()
    };
    
    await updateDoc(doc(db, 'workshop_settings', settings.id), updateData);
    const updatedSettings = { ...settings, ...updates, updated_at: new Date().toISOString() };
    return updatedSettings;
  };

  const refetch = () => {
    // البيانات تتحدث تلقائياً مع onSnapshot
  };

  return { settings, loading, error, updateSettings, refetch };
};