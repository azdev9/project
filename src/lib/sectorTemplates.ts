export interface InvestmentTemplate {
  name: string;
  quantity: number;
  unit_price_ht: number;
  vat_rate: number;
}

export interface CostTemplate {
  name: string;
  monthly_amount?: number;
  rate_of_sales?: number;
}

export interface SectorTemplate {
  label: string;
  investments: InvestmentTemplate[];
  fixed_costs: CostTemplate[];
  variable_costs: CostTemplate[];
  sales_hypothesis?: {
    avg_price: number;
    monthly_orders: number;
  };
}

export const sectorTemplates = {
  fr: {
    imprimerie: {
      label: "Atelier impression / communication",
      investments: [
        { name: "Machine d'impression", quantity: 1, unit_price_ht: 25000, vat_rate: 20 },
        { name: "Machine de découpe laser", quantity: 1, unit_price_ht: 40000, vat_rate: 20 },
        { name: "PC design", quantity: 2, unit_price_ht: 6000, vat_rate: 20 },
        { name: "Bureau et chaises", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "Logiciels (Adobe Suite)", quantity: 1, unit_price_ht: 5000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "Loyer", monthly_amount: 3500 },
        { name: "Internet + téléphone", monthly_amount: 400 },
        { name: "Électricité", monthly_amount: 800 },
        { name: "Salaire employé", monthly_amount: 4000 },
      ],
      variable_costs: [
        { name: "Consommables (papier/encre)", rate_of_sales: 25 },
        { name: "Emballage et livraison", rate_of_sales: 5 },
      ],
      sales_hypothesis: {
        avg_price: 150,
        monthly_orders: 150,
      },
    },
    cafe_restaurant: {
      label: "Café / Restaurant",
      investments: [
        { name: "Équipement cuisine", quantity: 1, unit_price_ht: 45000, vat_rate: 20 },
        { name: "Mobilier (tables, chaises)", quantity: 1, unit_price_ht: 30000, vat_rate: 20 },
        { name: "Caisse enregistreuse + TPE", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "Réfrigérateur/Congélateur", quantity: 2, unit_price_ht: 6000, vat_rate: 20 },
        { name: "Décoration et aménagement", quantity: 1, unit_price_ht: 15000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "Loyer", monthly_amount: 8000 },
        { name: "Salaires (2 employés)", monthly_amount: 8000 },
        { name: "Électricité et eau", monthly_amount: 1500 },
        { name: "Internet + téléphone", monthly_amount: 300 },
      ],
      variable_costs: [
        { name: "Matières premières (nourriture)", rate_of_sales: 30 },
        { name: "Emballages", rate_of_sales: 3 },
      ],
      sales_hypothesis: {
        avg_price: 80,
        monthly_orders: 600,
      },
    },
    ecommerce: {
      label: "E-commerce / Boutique en ligne",
      investments: [
        { name: "Site web e-commerce", quantity: 1, unit_price_ht: 15000, vat_rate: 20 },
        { name: "Stock initial produits", quantity: 1, unit_price_ht: 50000, vat_rate: 20 },
        { name: "Ordinateurs", quantity: 2, unit_price_ht: 7000, vat_rate: 20 },
        { name: "Caméra photo produits", quantity: 1, unit_price_ht: 4000, vat_rate: 20 },
        { name: "Mobilier bureau", quantity: 1, unit_price_ht: 5000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "Hébergement + domaine", monthly_amount: 500 },
        { name: "Internet haut débit", monthly_amount: 400 },
        { name: "Loyer local", monthly_amount: 2500 },
        { name: "Salaire gestionnaire", monthly_amount: 5000 },
      ],
      variable_costs: [
        { name: "Commission plateforme paiement", rate_of_sales: 3 },
        { name: "Livraison", rate_of_sales: 8 },
        { name: "Marketing digital (Ads)", rate_of_sales: 10 },
      ],
      sales_hypothesis: {
        avg_price: 250,
        monthly_orders: 120,
      },
    },
    services: {
      label: "Services professionnels",
      investments: [
        { name: "Ordinateurs", quantity: 3, unit_price_ht: 7000, vat_rate: 20 },
        { name: "Mobilier bureau", quantity: 1, unit_price_ht: 10000, vat_rate: 20 },
        { name: "Logiciels métier", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "Site web", quantity: 1, unit_price_ht: 12000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "Loyer", monthly_amount: 4000 },
        { name: "Internet + téléphone", monthly_amount: 500 },
        { name: "Électricité", monthly_amount: 400 },
        { name: "Salaires", monthly_amount: 10000 },
      ],
      variable_costs: [
        { name: "Déplacements", rate_of_sales: 5 },
        { name: "Commission commerciale", rate_of_sales: 10 },
      ],
      sales_hypothesis: {
        avg_price: 500,
        monthly_orders: 40,
      },
    },
  },
  ar: {
    imprimerie: {
      label: "ورشة الطباعة والتواصل",
      investments: [
        { name: "آلة طباعة", quantity: 1, unit_price_ht: 25000, vat_rate: 20 },
        { name: "آلة تقطيع ليزر", quantity: 1, unit_price_ht: 40000, vat_rate: 20 },
        { name: "حاسوب تصميم", quantity: 2, unit_price_ht: 6000, vat_rate: 20 },
        { name: "مكاتب وكراسي", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "برامج (Adobe Suite)", quantity: 1, unit_price_ht: 5000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "الكراء", monthly_amount: 3500 },
        { name: "الإنترنت والهاتف", monthly_amount: 400 },
        { name: "الكهرباء", monthly_amount: 800 },
        { name: "أجرة موظف", monthly_amount: 4000 },
      ],
      variable_costs: [
        { name: "مواد مستهلكة (ورق/حبر)", rate_of_sales: 25 },
        { name: "تغليف وتوصيل", rate_of_sales: 5 },
      ],
      sales_hypothesis: {
        avg_price: 150,
        monthly_orders: 150,
      },
    },
    cafe_restaurant: {
      label: "مقهى / مطعم",
      investments: [
        { name: "معدات المطبخ", quantity: 1, unit_price_ht: 45000, vat_rate: 20 },
        { name: "أثاث (طاولات، كراسي)", quantity: 1, unit_price_ht: 30000, vat_rate: 20 },
        { name: "صندوق تسجيل + TPE", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "ثلاجة/فريزر", quantity: 2, unit_price_ht: 6000, vat_rate: 20 },
        { name: "الديكور والتجهيز", quantity: 1, unit_price_ht: 15000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "الكراء", monthly_amount: 8000 },
        { name: "الأجور (2 موظفين)", monthly_amount: 8000 },
        { name: "الكهرباء والماء", monthly_amount: 1500 },
        { name: "الإنترنت والهاتف", monthly_amount: 300 },
      ],
      variable_costs: [
        { name: "المواد الأولية (أطعمة)", rate_of_sales: 30 },
        { name: "التغليف", rate_of_sales: 3 },
      ],
      sales_hypothesis: {
        avg_price: 80,
        monthly_orders: 600,
      },
    },
    ecommerce: {
      label: "التجارة الإلكترونية / متجر عبر الإنترنت",
      investments: [
        { name: "موقع التجارة الإلكترونية", quantity: 1, unit_price_ht: 15000, vat_rate: 20 },
        { name: "المخزون الأولي للمنتجات", quantity: 1, unit_price_ht: 50000, vat_rate: 20 },
        { name: "حواسيب", quantity: 2, unit_price_ht: 7000, vat_rate: 20 },
        { name: "كاميرا تصوير المنتجات", quantity: 1, unit_price_ht: 4000, vat_rate: 20 },
        { name: "أثاث المكتب", quantity: 1, unit_price_ht: 5000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "الاستضافة + النطاق", monthly_amount: 500 },
        { name: "إنترنت عالي السرعة", monthly_amount: 400 },
        { name: "كراء المحل", monthly_amount: 2500 },
        { name: "أجرة المدير", monthly_amount: 5000 },
      ],
      variable_costs: [
        { name: "عمولة منصة الدفع", rate_of_sales: 3 },
        { name: "التوصيل", rate_of_sales: 8 },
        { name: "التسويق الرقمي (إعلانات)", rate_of_sales: 10 },
      ],
      sales_hypothesis: {
        avg_price: 250,
        monthly_orders: 120,
      },
    },
    services: {
      label: "الخدمات المهنية",
      investments: [
        { name: "حواسيب", quantity: 3, unit_price_ht: 7000, vat_rate: 20 },
        { name: "أثاث المكتب", quantity: 1, unit_price_ht: 10000, vat_rate: 20 },
        { name: "برامج مهنية", quantity: 1, unit_price_ht: 8000, vat_rate: 20 },
        { name: "موقع ويب", quantity: 1, unit_price_ht: 12000, vat_rate: 20 },
      ],
      fixed_costs: [
        { name: "الكراء", monthly_amount: 4000 },
        { name: "الإنترنت والهاتف", monthly_amount: 500 },
        { name: "الكهرباء", monthly_amount: 400 },
        { name: "الأجور", monthly_amount: 10000 },
      ],
      variable_costs: [
        { name: "التنقلات", rate_of_sales: 5 },
        { name: "عمولة تجارية", rate_of_sales: 10 },
      ],
      sales_hypothesis: {
        avg_price: 500,
        monthly_orders: 40,
      },
    },
  },
};

export function getSectorTemplate(language: 'fr' | 'ar', sectorKey: string): SectorTemplate | null {
  return sectorTemplates[language][sectorKey as keyof typeof sectorTemplates.fr] || null;
}

export function getSectorKeys(): string[] {
  return Object.keys(sectorTemplates.fr);
}
