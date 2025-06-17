import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.repairs': 'الإصلاحات',
    'nav.inventory': 'المخزون',
    'nav.brands': 'الماركات والموديلات',
    'nav.reports': 'التقارير',
    'nav.archive': 'الأرشيف',
    'nav.settings': 'الإعدادات',
    
    // Common
    'common.add': 'إضافة',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.search': 'البحث',
    'common.filter': 'تصفية',
    'common.loading': 'جاري التحميل...',
    'common.noData': 'لا توجد بيانات',
    'common.total': 'الإجمالي',
    'common.quantity': 'الكمية',
    'common.price': 'السعر',
    'common.status': 'الحالة',
    'common.date': 'التاريخ',
    'common.actions': 'الإجراءات',
    'common.name': 'الاسم',
    'common.phone': 'الهاتف',
    'common.address': 'العنوان',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.totalRevenue': 'إجمالي الإيرادات',
    'dashboard.totalCost': 'تكلفة القطع',
    'dashboard.netProfit': 'صافي الأرباح',
    'dashboard.totalRepairs': 'عدد الإصلاحات',
    'dashboard.weeklyProfits': 'تطور الأرباح الأسبوعية',
    'dashboard.popularModels': 'الموديلات الأكثر إصلاحاً',
    'dashboard.commonIssues': 'الأعطال الأكثر شيوعاً',
    
    // Repairs
    'repairs.title': 'إدارة الإصلاحات',
    'repairs.newRepair': 'إصلاح جديد',
    'repairs.customer': 'العميل',
    'repairs.device': 'الجهاز',
    'repairs.issue': 'العطل',
    'repairs.usedParts': 'القطع المستخدمة',
    'repairs.cost': 'التكلفة',
    'repairs.profit': 'الربح',
    'repairs.pending': 'في الانتظار',
    'repairs.inProgress': 'قيد التنفيذ',
    'repairs.completed': 'مكتمل',
    'repairs.archived': 'مؤرشف',
    
    // Inventory
    'inventory.title': 'إدارة المخزون',
    'inventory.addPart': 'إضافة قطعة غيار',
    'inventory.totalParts': 'إجمالي القطع',
    'inventory.lowStock': 'مخزون منخفض',
    'inventory.outOfStock': 'نفد المخزون',
    'inventory.stockValue': 'قيمة المخزون',
    'inventory.partName': 'اسم القطعة',
    'inventory.partType': 'نوع القطعة',
    'inventory.compatibleDevice': 'الجهاز المتوافق',
    'inventory.purchasePrice': 'سعر الشراء',
    'inventory.sellingPrice': 'سعر البيع',
    'inventory.totalValue': 'القيمة الإجمالية',
    
    // Brands
    'brands.title': 'إدارة الماركات والموديلات',
    'brands.addBrand': 'إضافة ماركة',
    'brands.addModel': 'إضافة موديل',
    'brands.brandsTitle': 'الماركات',
    'brands.modelsTitle': 'الموديلات',
    'brands.allModels': 'جميع الموديلات',
    'brands.selectBrand': 'اختر ماركة',
    
    // Settings
    'settings.title': 'إعدادات الورشة',
    'settings.workshopInfo': 'معلومات الورشة',
    'settings.workshopName': 'اسم الورشة',
    'settings.thankYouMessage': 'رسالة الشكر',
    'settings.accountSettings': 'إعدادات الحساب',
    'settings.addUser': 'إضافة مستخدم',
    'settings.changePassword': 'تغيير كلمة المرور',
    'settings.language': 'اللغة',
    
    // Status
    'status.pending': 'في الانتظار',
    'status.inProgress': 'قيد التنفيذ',
    'status.completed': 'مكتمل',
    'status.archived': 'مؤرشف',
    
    // Days
    'days.sunday': 'الأحد',
    'days.monday': 'الاثنين',
    'days.tuesday': 'الثلاثاء',
    'days.wednesday': 'الأربعاء',
    'days.thursday': 'الخميس',
    'days.friday': 'الجمعة',
    'days.saturday': 'السبت',
    
    // Time filters
    'time.today': 'اليوم',
    'time.week': 'هذا الأسبوع',
    'time.month': 'هذا الشهر',
    
    // Part types
    'partType.screen': 'شاشة',
    'partType.battery': 'بطارية',
    'partType.microphone': 'مايك',
    'partType.speaker': 'سماعة',
    'partType.camera': 'كاميرا',
    'partType.charger': 'شاحن',
    'partType.other': 'أخرى',
    
    // Issue types
    'issueType.screenBreak': 'كسر الشاشة',
    'issueType.batteryIssue': 'مشكلة البطارية',
    'issueType.microphoneIssue': 'عطل المايك',
    'issueType.speakerIssue': 'مشكلة السماعة',
    'issueType.cameraIssue': 'عطل الكاميرا',
    'issueType.chargingIssue': 'مشكلة الشحن',
    'issueType.softwareIssue': 'عطل البرمجيات',
    'issueType.otherIssue': 'مشكلة أخرى',
    
    // Messages
    'messages.saved': 'تم الحفظ بنجاح',
    'messages.deleted': 'تم الحذف بنجاح',
    'messages.error': 'حدث خطأ',
    'messages.confirmDelete': 'هل أنت متأكد من الحذف؟',
    'messages.noResults': 'لا توجد نتائج',
    'messages.lowStockAlert': 'تنبيه: قطع تحتاج إلى إعادة تخزين',
    
    // Currency
    'currency': 'د.ت',
    
    // Workshop
    'workshop.title': 'ورشة الإصلاح',
    'workshop.subtitle': 'نظام إدارة شامل',
    'workshop.manager': 'مدير الورشة',
    'workshop.role': 'مدير'
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.repairs': 'Réparations',
    'nav.inventory': 'Inventaire',
    'nav.brands': 'Marques et modèles',
    'nav.reports': 'Rapports',
    'nav.archive': 'Archive',
    'nav.settings': 'Paramètres',
    
    // Common
    'common.add': 'Ajouter',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.loading': 'Chargement...',
    'common.noData': 'Aucune donnée',
    'common.total': 'Total',
    'common.quantity': 'Quantité',
    'common.price': 'Prix',
    'common.status': 'Statut',
    'common.date': 'Date',
    'common.actions': 'Actions',
    'common.name': 'Nom',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.totalRevenue': 'Revenus totaux',
    'dashboard.totalCost': 'Coût des pièces',
    'dashboard.netProfit': 'Bénéfice net',
    'dashboard.totalRepairs': 'Nombre de réparations',
    'dashboard.weeklyProfits': 'Évolution des bénéfices hebdomadaires',
    'dashboard.popularModels': 'Modèles les plus réparés',
    'dashboard.commonIssues': 'Pannes les plus courantes',
    
    // Repairs
    'repairs.title': 'Gestion des réparations',
    'repairs.newRepair': 'Nouvelle réparation',
    'repairs.customer': 'Client',
    'repairs.device': 'Appareil',
    'repairs.issue': 'Panne',
    'repairs.usedParts': 'Pièces utilisées',
    'repairs.cost': 'Coût',
    'repairs.profit': 'Bénéfice',
    'repairs.pending': 'En attente',
    'repairs.inProgress': 'En cours',
    'repairs.completed': 'Terminé',
    'repairs.archived': 'Archivé',
    
    // Inventory
    'inventory.title': 'Gestion de l\'inventaire',
    'inventory.addPart': 'Ajouter une pièce',
    'inventory.totalParts': 'Total des pièces',
    'inventory.lowStock': 'Stock faible',
    'inventory.outOfStock': 'Rupture de stock',
    'inventory.stockValue': 'Valeur du stock',
    'inventory.partName': 'Nom de la pièce',
    'inventory.partType': 'Type de pièce',
    'inventory.compatibleDevice': 'Appareil compatible',
    'inventory.purchasePrice': 'Prix d\'achat',
    'inventory.sellingPrice': 'Prix de vente',
    'inventory.totalValue': 'Valeur totale',
    
    // Brands
    'brands.title': 'Gestion des marques et modèles',
    'brands.addBrand': 'Ajouter une marque',
    'brands.addModel': 'Ajouter un modèle',
    'brands.brandsTitle': 'Marques',
    'brands.modelsTitle': 'Modèles',
    'brands.allModels': 'Tous les modèles',
    'brands.selectBrand': 'Choisir une marque',
    
    // Settings
    'settings.title': 'Paramètres de l\'atelier',
    'settings.workshopInfo': 'Informations de l\'atelier',
    'settings.workshopName': 'Nom de l\'atelier',
    'settings.thankYouMessage': 'Message de remerciement',
    'settings.accountSettings': 'Paramètres du compte',
    'settings.addUser': 'Ajouter un utilisateur',
    'settings.changePassword': 'Changer le mot de passe',
    'settings.language': 'Langue',
    
    // Status
    'status.pending': 'En attente',
    'status.inProgress': 'En cours',
    'status.completed': 'Terminé',
    'status.archived': 'Archivé',
    
    // Days
    'days.sunday': 'Dimanche',
    'days.monday': 'Lundi',
    'days.tuesday': 'Mardi',
    'days.wednesday': 'Mercredi',
    'days.thursday': 'Jeudi',
    'days.friday': 'Vendredi',
    'days.saturday': 'Samedi',
    
    // Time filters
    'time.today': 'Aujourd\'hui',
    'time.week': 'Cette semaine',
    'time.month': 'Ce mois',
    
    // Part types
    'partType.screen': 'Écran',
    'partType.battery': 'Batterie',
    'partType.microphone': 'Microphone',
    'partType.speaker': 'Haut-parleur',
    'partType.camera': 'Caméra',
    'partType.charger': 'Chargeur',
    'partType.other': 'Autre',
    
    // Issue types
    'issueType.screenBreak': 'Écran cassé',
    'issueType.batteryIssue': 'Problème de batterie',
    'issueType.microphoneIssue': 'Panne du microphone',
    'issueType.speakerIssue': 'Problème de haut-parleur',
    'issueType.cameraIssue': 'Panne de caméra',
    'issueType.chargingIssue': 'Problème de charge',
    'issueType.softwareIssue': 'Panne logicielle',
    'issueType.otherIssue': 'Autre problème',
    
    // Messages
    'messages.saved': 'Enregistré avec succès',
    'messages.deleted': 'Supprimé avec succès',
    'messages.error': 'Une erreur s\'est produite',
    'messages.confirmDelete': 'Êtes-vous sûr de vouloir supprimer ?',
    'messages.noResults': 'Aucun résultat',
    'messages.lowStockAlert': 'Alerte: pièces nécessitant un réapprovisionnement',
    
    // Currency
    'currency': 'DT',
    
    // Workshop
    'workshop.title': 'Atelier de réparation',
    'workshop.subtitle': 'Système de gestion complet',
    'workshop.manager': 'Gérant de l\'atelier',
    'workshop.role': 'Gérant'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};