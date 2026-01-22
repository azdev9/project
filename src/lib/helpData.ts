export const helpData = {
  fr: {
    project_info: {
      project_name: {
        title: "Nom du projet",
        examples: ["Atlas Print", "Berkane Honey Coop", "Oujda Fitness Studio", "Scalaire Academy"],
        method: "Choisis un nom court, mémorable, prononçable en FR/AR, et vérifie la disponibilité sur Google + réseaux sociaux.",
        whereToFind: ["Recherche Google/Instagram/TikTok", "Registre de commerce (vérification ultérieure)", "Nom de domaine (.ma/.com)"],
      },
      sector: {
        title: "Secteur d'activité",
        examples: ["Imprimerie/Communication", "Agroalimentaire", "Services", "E-commerce", "Tech/SaaS"],
        method: "Choisis le secteur principal qui génère le CA. Tu peux ajouter un sous-secteur dans la description.",
        whereToFind: ["Classification interne plateforme", "Références CGEM/Chambres", "Benchmark concurrents"],
      },
      city_region: {
        title: "Ville / Région",
        examples: ["Oujda – Oriental", "Berkane – Oriental", "Nador – Oriental", "Marrakech – Marrakech-Safi"],
        method: "Indique la zone d'implantation principale. Si tu vends en ligne, précise aussi la zone de livraison.",
        whereToFind: ["Adresse projet", "Zone cible clients", "Cartes Google + zones commerciales"],
      },
    },
    market_study: {
      target_customer: {
        title: "Client cible (persona)",
        examples: [
          "B2C: Femmes 25–45 ans, urbaines, revenus moyens",
          "B2B: Petites entreprises (TPE) 1–20 salariés",
          "B2G: Communes / établissements publics locaux"
        ],
        method: "Décris 1 persona principal : Qui? Quel problème? Où? Combien paie-t-il? Pourquoi toi?",
        whereToFind: ["Observation terrain", "Mini enquête (Google Form 30–100 réponses)", "Groupes Facebook/WhatsApp", "Avis Google concurrents"],
      },
      market_size: {
        title: "Estimation taille du marché",
        examples: [
          "TAM: Maroc entier (tous clients potentiels)",
          "SAM: Région Oriental (clients accessibles)",
          "SOM: 1–3% de SAM la 1ère année"
        ],
        method: "Méthode simple: (Population cible) × (taux d'adoption estimé) × (panier annuel).",
        whereToFind: ["HCP (population)", "Rapports sectoriels", "Données communes/région", "Benchmark prix concurrents"],
      },
    },
    investments: {
      investment_line: {
        title: "Ligne d'investissement",
        examples: [
          "Machine impression — Qté 1 — 25 000 HT — TVA 20%",
          "Laser découpe — Qté 1 — 40 000 HT — TVA 20%",
          "PC — Qté 2 — 6 000 HT — TVA 20%"
        ],
        method: "Toujours saisir Quantité + PU HT + TVA%. Le système calcule Total HT, TVA et TTC automatiquement.",
        whereToFind: ["Devis fournisseurs", "Catalogues", "Avito/Jumia (référence prix)", "Appels 3 fournisseurs"],
      },
    },
    financials: {
      sales_forecast: {
        title: "Prévision CA mensuel",
        examples: ["20 clients/jour × 60 MAD × 26 jours = 31 200 MAD/mois", "100 commandes/mois × 150 MAD = 15 000 MAD/mois"],
        method: "Formule simple: (volume) × (prix) × (période). Justifie le volume par enquête/test.",
        whereToFind: ["Test MVP", "Précommandes", "Observation trafic", "Historique si existe"],
      },
      costs: {
        title: "Charges fixes & variables",
        examples: ["Fixes: loyer, internet, salaires", "Variables: matière, livraison, commission paiement"],
        method: "Sépare fixes/variables pour mieux calculer le seuil de rentabilité.",
        whereToFind: ["Devis loyer", "Offres opérateurs", "Devis fournisseurs"],
      },
      projections: {
        title: "Prévisions 3 ans",
        examples: ["Année1: CA 300k, Année2: 450k, Année3: 650k"],
        method: "Croissance réaliste: 10–30%/an selon secteur. Justifie par capacité + marketing + équipe.",
        whereToFind: ["Capacité production", "Plan marketing", "Saisonnalité"],
      },
    },
    marketing: {
      sales_strategy: {
        title: "Stratégie vente",
        examples: ["Prospection terrain + WhatsApp", "Partenariats B2B", "Offres pack"],
        method: "Décris 3 canaux de vente + script + objectif mensuel.",
        whereToFind: ["Concurrents", "Réseau", "Tests messages"],
      },
      digital_marketing: {
        title: "Marketing digital",
        examples: ["Instagram/TikTok pour B2C", "LinkedIn pour B2B", "Google Maps + avis"],
        method: "Choisis 2 réseaux + 1 canal acquisition (Ads/SEO) + KPI.",
        whereToFind: ["Meta Ads Library (benchmark)", "Google Trends", "Pages concurrents"],
      },
    },
  },
  ar: {
    project_info: {
      project_name: {
        title: "اسم المشروع",
        examples: ["أطلس برينت", "تعاونية عسل بركان", "نادي لياقة وجدة", "سكالاير أكاديمي"],
        method: "اختر اسمًا قصيرًا وسهل النطق بالعربية والفرنسية، وتأكد من توفره على الإنترنت وشبكات التواصل.",
        whereToFind: ["بحث Google/Instagram/TikTok", "التحقق لاحقًا من السجل التجاري", "حجز اسم نطاق (.ma/.com)"],
      },
      sector: {
        title: "قطاع النشاط",
        examples: ["الطباعة والتواصل", "المنتجات الغذائية", "الخدمات", "التجارة الإلكترونية", "التكنولوجيا/البرمجيات"],
        method: "اختر القطاع الرئيسي الذي يحقق أغلب المداخيل، ويمكن إضافة قطاع فرعي في الوصف.",
        whereToFind: ["تصنيفات داخل المنصة", "مراجع الغرف المهنية", "مقارنة المنافسين"],
      },
      city_region: {
        title: "المدينة / الجهة",
        examples: ["وجدة – الشرق", "بركان – الشرق", "الناظور – الشرق", "مراكش – مراكش آسفي"],
        method: "حدد منطقة الاشتغال الأساسية، وإذا كان البيع عبر الإنترنت أضف مناطق التوصيل.",
        whereToFind: ["عنوان المشروع", "مناطق الزبناء المستهدفين", "خرائط Google + المناطق التجارية"],
      },
    },
    market_study: {
      target_customer: {
        title: "الزبون المستهدف",
        examples: [
          "B2C: نساء 25–45 سنة، حضريّات، دخل متوسط",
          "B2B: مقاولات صغيرة جدًا (1–20 عامل)",
          "B2G: جماعات/مؤسسات عمومية"
        ],
        method: "صف زبونًا رئيسيًا: من هو؟ ما المشكلة؟ أين يوجد؟ كم يمكنه الدفع؟ لماذا أنت؟",
        whereToFind: ["ملاحظة ميدانية", "استبيان بسيط (30–100 إجابة)", "مجموعات فيسبوك/واتساب", "تعليقات Google للمنافسين"],
      },
      market_size: {
        title: "تقدير حجم السوق",
        examples: ["TAM: المغرب كامل", "SAM: جهة الشرق", "SOM: 1–3% من SAM في السنة الأولى"],
        method: "طريقة مبسطة: (عدد الفئة المستهدفة) × (نسبة تبنّي متوقعة) × (المصاريف السنوية للزبون).",
        whereToFind: ["المندوبية السامية للتخطيط", "تقارير قطاعية", "معطيات الجهة/الجماعة", "مقارنة أسعار المنافسين"],
      },
    },
    investments: {
      investment_line: {
        title: "سطر الاستثمار",
        examples: [
          "آلة طباعة — كمية 1 — 25,000 HT — TVA 20%",
          "آلة تقطيع ليزر — كمية 1 — 40,000 HT — TVA 20%",
          "حاسوب — كمية 2 — 6,000 HT — TVA 20%"
        ],
        method: "أدخل دائمًا: الكمية + ثمن الوحدة HT + نسبة TVA. النظام يحسب HT وTVA وTTC تلقائيًا.",
        whereToFind: ["عروض أسعار الموردين", "كتالوجات", "Avito/Jumia (مرجع)", "3 مكالمات لموردين"],
      },
    },
    financials: {
      sales_forecast: {
        title: "توقع رقم المعاملات الشهري",
        examples: ["20 زبون/يوم × 60 درهم × 26 يوم = 31,200 درهم/شهر", "100 طلب/شهر × 150 درهم = 15,000 درهم/شهر"],
        method: "صيغة بسيطة: (العدد) × (السعر) × (المدة). برّر العدد بتجربة أو استبيان.",
        whereToFind: ["تجربة MVP", "طلبات مسبقة", "ملاحظة الإقبال", "أرقام سابقة إن وجدت"],
      },
      costs: {
        title: "المصاريف الثابتة والمتغيرة",
        examples: ["ثابتة: كراء، إنترنت، أجور", "متغيرة: مواد، توصيل، عمولة الدفع"],
        method: "قسّم المصاريف لتحديد نقطة التعادل بسهولة.",
        whereToFind: ["عقد الكراء", "عروض الاتصالات", "عروض الموردين"],
      },
      projections: {
        title: "توقعات 3 سنوات",
        examples: ["س1: 300k، س2: 450k، س3: 650k"],
        method: "نمو واقعي 10–30% حسب القطاع مع تبرير (قدرة إنتاج، تسويق، فريق).",
        whereToFind: ["القدرة الإنتاجية", "خطة التسويق", "الموسمية"],
      },
    },
    marketing: {
      sales_strategy: {
        title: "استراتيجية المبيعات",
        examples: ["زيارات ميدانية + واتساب", "شراكات B2B", "عروض باقات"],
        method: "حدد 3 قنوات بيع + رسالة/سكريبت + هدف شهري.",
        whereToFind: ["مقارنة المنافسين", "الشبكة", "اختبار الرسائل"],
      },
      digital_marketing: {
        title: "التسويق الرقمي",
        examples: ["Instagram/TikTok لـ B2C", "LinkedIn لـ B2B", "Google Maps + تقييمات"],
        method: "اختر منصتين + قناة اكتساب (إعلانات/SEO) + مؤشرات KPI.",
        whereToFind: ["Meta Ads Library", "Google Trends", "صفحات المنافسين"],
      },
    },
  },
};
