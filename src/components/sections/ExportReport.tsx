import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Button } from '../Button';
import { FileText, Printer, Download, CheckCircle } from 'lucide-react';

interface ExportReportProps {
  businessPlanId: string | null;
}

export function ExportReport({ businessPlanId }: ExportReportProps) {
  const { language } = useLanguage();
  const [exporting, setExporting] = useState(false);

  async function handlePrint() {
    window.print();
  }

  async function handleExportPDF() {
    setExporting(true);
    setTimeout(() => {
      alert(language === 'fr'
        ? 'Fonctionnalité d\'export PDF à venir! Utilisez l\'impression (Ctrl+P) pour créer un PDF.'
        : 'ميزة تصدير PDF قريبًا! استخدم الطباعة (Ctrl+P) لإنشاء PDF.');
      setExporting(false);
    }, 1000);
  }

  const features = language === 'fr' ? [
    {
      title: 'Imprimer le plan',
      description: 'Imprimez votre plan d\'affaires complet au format PDF',
      icon: <Printer size={24} />,
      action: handlePrint,
      color: 'blue',
    },
    {
      title: 'Télécharger PDF',
      description: 'Téléchargez une version PDF professionnelle',
      icon: <Download size={24} />,
      action: handleExportPDF,
      color: 'green',
      disabled: true,
    },
    {
      title: 'Format Word',
      description: 'Exportez au format Word pour modifications',
      icon: <FileText size={24} />,
      action: () => alert('Fonctionnalité à venir!'),
      color: 'purple',
      disabled: true,
    },
  ] : [
    {
      title: 'طباعة المخطط',
      description: 'اطبع مخطط أعمالك الكامل بصيغة PDF',
      icon: <Printer size={24} />,
      action: handlePrint,
      color: 'blue',
    },
    {
      title: 'تحميل PDF',
      description: 'قم بتنزيل نسخة PDF احترافية',
      icon: <Download size={24} />,
      action: handleExportPDF,
      color: 'green',
      disabled: true,
    },
    {
      title: 'صيغة Word',
      description: 'تصدير بصيغة Word للتعديلات',
      icon: <FileText size={24} />,
      action: () => alert('ميزة قريبًا!'),
      color: 'purple',
      disabled: true,
    },
  ];

  const tips = language === 'fr' ? [
    'Complétez toutes les sections avant d\'exporter',
    'Vérifiez vos calculs financiers',
    'Relisez l\'orthographe et la grammaire',
    'Ajoutez au moins 2-3 concurrents',
    'Incluez des prévisions réalistes',
  ] : [
    'أكمل جميع الأقسام قبل التصدير',
    'تحقق من حساباتك المالية',
    'راجع الإملاء والنحو',
    'أضف على الأقل 2-3 منافسين',
    'ضع توقعات واقعية',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Exporter le Plan d\'Affaires' : 'تصدير مخطط الأعمال'}
          </h2>
          <p className="text-gray-600">
            {language === 'fr'
              ? 'Téléchargez ou imprimez votre plan d\'affaires complet'
              : 'قم بتنزيل أو طباعة مخطط أعمالك الكامل'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={feature.action}
              disabled={feature.disabled || exporting}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                feature.disabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : `border-${feature.color}-300 bg-${feature.color}-50 hover:bg-${feature.color}-100 hover:border-${feature.color}-400`
              }`}
            >
              <div className={`inline-flex p-3 rounded-lg ${
                feature.disabled ? 'bg-gray-200' : `bg-${feature.color}-600`
              } mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
              {feature.disabled && (
                <span className="inline-block mt-2 text-xs text-gray-500 italic">
                  {language === 'fr' ? 'Bientôt disponible' : 'قريبًا'}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-3">
                {language === 'fr' ? 'Liste de vérification avant export' : 'قائمة التحقق قبل التصدير'}
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <span className="text-blue-600">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {language === 'fr' ? 'Conseil Pro' : 'نصيحة احترافية'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {language === 'fr' ? (
              <>
                Pour créer un PDF maintenant, utilisez la fonction d'impression de votre navigateur (Ctrl+P ou Cmd+P) et sélectionnez "Enregistrer au format PDF".
                Assurez-vous d'activer les "Graphiques d'arrière-plan" dans les options d'impression pour un rendu optimal.
              </>
            ) : (
              <>
                لإنشاء ملف PDF الآن، استخدم وظيفة الطباعة في متصفحك (Ctrl+P أو Cmd+P) واختر "حفظ كـ PDF".
                تأكد من تفعيل "رسومات الخلفية" في خيارات الطباعة للحصول على أفضل عرض.
              </>
            )}
          </p>
        </div>
      </Card>

      <style>{`
        @media print {
          aside, header, footer, button, .no-print {
            display: none !important;
          }
          main {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
