import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.colleges': 'Colleges',
    'nav.fafsa': 'FAFSA Guide',
    'nav.timeline': 'Timeline',
    'nav.comparison': 'Compare',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    
    // Home page
    'home.title': 'Your Path to US College Success',
    'home.subtitle': 'Empowering international and underprivileged students with comprehensive college admissions guidance',
    'home.cta': 'Get Started',
    'home.student_types': 'Choose Your Student Type',
    'home.international': 'International Students',
    'home.low_income': 'Low-Income Students',
    'home.first_gen': 'First-Generation Students',
    
    // Features
    'features.title': 'Everything You Need for College Success',
    'features.fafsa': 'FAFSA Guidance',
    'features.fafsa_desc': 'Step-by-step instructions for financial aid applications',
    'features.colleges': 'College Profiles',
    'features.colleges_desc': 'Detailed information on Ivy League and T20 schools',
    'features.timeline': 'Application Timeline',
    'features.timeline_desc': 'Personalized deadlines and reminders',
    'features.comparison': 'College Comparison',
    'features.comparison_desc': 'Compare schools side by side',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.full_name': 'Full Name',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.create_account': 'Create Account',
    'auth.have_account': 'Already have an account?',
    'auth.no_account': "Don't have an account?",
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.colleges': 'Universidades',
    'nav.fafsa': 'Guía FAFSA',
    'nav.timeline': 'Cronograma',
    'nav.comparison': 'Comparar',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    
    // Home page
    'home.title': 'Tu Camino al Éxito Universitario en EE.UU.',
    'home.subtitle': 'Empoderando a estudiantes internacionales y desfavorecidos con orientación integral para admisiones universitarias',
    'home.cta': 'Comenzar',
    'home.student_types': 'Elige Tu Tipo de Estudiante',
    'home.international': 'Estudiantes Internacionales',
    'home.low_income': 'Estudiantes de Bajos Ingresos',
    'home.first_gen': 'Estudiantes de Primera Generación',
    
    // Features
    'features.title': 'Todo lo que Necesitas para el Éxito Universitario',
    'features.fafsa': 'Orientación FAFSA',
    'features.fafsa_desc': 'Instrucciones paso a paso para solicitudes de ayuda financiera',
    'features.colleges': 'Perfiles Universitarios',
    'features.colleges_desc': 'Información detallada sobre escuelas Ivy League y T20',
    'features.timeline': 'Cronograma de Aplicación',
    'features.timeline_desc': 'Fechas límite personalizadas y recordatorios',
    'features.comparison': 'Comparación de Universidades',
    'features.comparison_desc': 'Compara escuelas lado a lado',
    
    // Auth
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.full_name': 'Nombre Completo',
    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.create_account': 'Crear Cuenta',
    'auth.have_account': '¿Ya tienes una cuenta?',
    'auth.no_account': '¿No tienes una cuenta?',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.colleges': 'कॉलेज',
    'nav.fafsa': 'FAFSA गाइड',
    'nav.timeline': 'समयसीमा',
    'nav.comparison': 'तुलना',
    'nav.login': 'लॉगिन',
    'nav.signup': 'साइन अप',
    'nav.logout': 'लॉगआउट',
    
    // Home page
    'home.title': 'अमेरिकी कॉलेज सफलता का आपका रास्ता',
    'home.subtitle': 'अंतर्राष्ट्रीय और वंचित छात्रों को व्यापक कॉलेज प्रवेश मार्गदर्शन के साथ सशक्त बनाना',
    'home.cta': 'शुरू करें',
    'home.student_types': 'अपना छात्र प्रकार चुनें',
    'home.international': 'अंतर्राष्ट्रीय छात्र',
    'home.low_income': 'कम आय वाले छात्र',
    'home.first_gen': 'पहली पीढ़ी के छात्र',
    
    // Features
    'features.title': 'कॉलेज सफलता के लिए आपको जो कुछ चाहिए',
    'features.fafsa': 'FAFSA मार्गदर्शन',
    'features.fafsa_desc': 'वित्तीय सहायता आवेदनों के लिए चरण-दर-चरण निर्देश',
    'features.colleges': 'कॉलेज प्रोफाइल',
    'features.colleges_desc': 'आइवी लीग और T20 स्कूलों की विस्तृत जानकारी',
    'features.timeline': 'आवेदन समयसीमा',
    'features.timeline_desc': 'व्यक्तिगत समय सीमा और अनुस्मारक',
    'features.comparison': 'कॉलेज तुलना',
    'features.comparison_desc': 'स्कूलों की साथ-साथ तुलना करें',
    
    // Auth
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.full_name': 'पूरा नाम',
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.create_account': 'खाता बनाएं',
    'auth.have_account': 'क्या आपका पहले से खाता है?',
    'auth.no_account': 'क्या आपका खाता नहीं है?',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.dashboard': '仪表板',
    'nav.colleges': '大学',
    'nav.fafsa': 'FAFSA指南',
    'nav.timeline': '时间线',
    'nav.comparison': '比较',
    'nav.login': '登录',
    'nav.signup': '注册',
    'nav.logout': '退出',
    
    // Home page
    'home.title': '您通往美国大学成功的道路',
    'home.subtitle': '为国际学生和弱势学生提供全面的大学录取指导',
    'home.cta': '开始',
    'home.student_types': '选择您的学生类型',
    'home.international': '国际学生',
    'home.low_income': '低收入学生',
    'home.first_gen': '第一代大学生',
    
    // Features
    'features.title': '大学成功所需的一切',
    'features.fafsa': 'FAFSA指导',
    'features.fafsa_desc': '财政援助申请的分步说明',
    'features.colleges': '大学简介',
    'features.colleges_desc': '常春藤盟校和T20学校的详细信息',
    'features.timeline': '申请时间线',
    'features.timeline_desc': '个性化截止日期和提醒',
    'features.comparison': '大学比较',
    'features.comparison_desc': '并排比较学校',
    
    // Auth
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.full_name': '全名',
    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.create_account': '创建账户',
    'auth.have_account': '已有账户？',
    'auth.no_account': '没有账户？',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.colleges': 'الكليات',
    'nav.fafsa': 'دليل FAFSA',
    'nav.timeline': 'الجدول الزمني',
    'nav.comparison': 'مقارنة',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'التسجيل',
    'nav.logout': 'تسجيل الخروج',
    
    // Home page
    'home.title': 'طريقك إلى النجاح في الجامعات الأمريكية',
    'home.subtitle': 'تمكين الطلاب الدوليين والمحرومين بإرشادات شاملة لقبول الجامعات',
    'home.cta': 'ابدأ',
    'home.student_types': 'اختر نوع الطالب',
    'home.international': 'الطلاب الدوليون',
    'home.low_income': 'الطلاب ذوو الدخل المنخفض',
    'home.first_gen': 'طلاب الجيل الأول',
    
    // Features
    'features.title': 'كل ما تحتاجه لنجاح الجامعة',
    'features.fafsa': 'إرشادات FAFSA',
    'features.fafsa_desc': 'تعليمات خطوة بخطوة لطلبات المساعدة المالية',
    'features.colleges': 'ملفات الكليات',
    'features.colleges_desc': 'معلومات مفصلة عن مدارس Ivy League و T20',
    'features.timeline': 'الجدول الزمني للتطبيق',
    'features.timeline_desc': 'مواعيد نهائية شخصية وتذكيرات',
    'features.comparison': 'مقارنة الكليات',
    'features.comparison_desc': 'قارن المدارس جنباً إلى جنب',
    
    // Auth
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.full_name': 'الاسم الكامل',
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'التسجيل',
    'auth.create_account': 'إنشاء حساب',
    'auth.have_account': 'هل لديك حساب بالفعل؟',
    'auth.no_account': 'ليس لديك حساب؟',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.colleges': 'Universités',
    'nav.fafsa': 'Guide FAFSA',
    'nav.timeline': 'Chronologie',
    'nav.comparison': 'Comparer',
    'nav.login': 'Connexion',
    'nav.signup': "S'inscrire",
    'nav.logout': 'Déconnexion',
    
    // Home page
    'home.title': 'Votre Chemin vers le Succès Universitaire aux États-Unis',
    'home.subtitle': 'Autonomiser les étudiants internationaux et défavorisés avec des conseils complets pour les admissions universitaires',
    'home.cta': 'Commencer',
    'home.student_types': 'Choisissez Votre Type d\'Étudiant',
    'home.international': 'Étudiants Internationaux',
    'home.low_income': 'Étudiants à Faible Revenu',
    'home.first_gen': 'Étudiants de Première Génération',
    
    // Features
    'features.title': 'Tout ce dont Vous Avez Besoin pour le Succès Universitaire',
    'features.fafsa': 'Conseils FAFSA',
    'features.fafsa_desc': 'Instructions étape par étape pour les demandes d\'aide financière',
    'features.colleges': 'Profils Universitaires',
    'features.colleges_desc': 'Informations détaillées sur les écoles Ivy League et T20',
    'features.timeline': 'Chronologie des Candidatures',
    'features.timeline_desc': 'Échéances personnalisées et rappels',
    'features.comparison': 'Comparaison d\'Universités',
    'features.comparison_desc': 'Comparez les écoles côte à côte',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.full_name': 'Nom complet',
    'auth.login': 'Connexion',
    'auth.signup': "S'inscrire",
    'auth.create_account': 'Créer un compte',
    'auth.have_account': 'Vous avez déjà un compte?',
    'auth.no_account': 'Vous n\'avez pas de compte?',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};