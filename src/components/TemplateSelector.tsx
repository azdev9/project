import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';
import { sectorTemplates } from '../lib/sectorTemplates';
import { Package, AlertCircle } from 'lucide-react';

interface TemplateSelectorProps {
  onApplyTemplate: (templateKey: string) => void;
}

export function TemplateSelector({ onApplyTemplate }: TemplateSelectorProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates = sectorTemplates[language];

  function handleApply() {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate);
      setIsOpen(false);
      setSelectedTemplate('');
    }
  }

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Package size={20} />
        {language === 'fr' ? 'Utiliser un modèle' : 'استخدام نموذج'}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white">
                {language === 'fr' ? 'Choisir un modèle de secteur' : 'اختر نموذج قطاع'}
              </h2>
              <p className="text-blue-100 mt-1">
                {language === 'fr'
                  ? 'Pré-remplissez automatiquement vos investissements et charges'
                  : 'املأ تلقائيًا استثماراتك ومصاريفك'}
              </p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-800">
                  {language === 'fr'
                    ? 'Attention: Cela remplacera vos investissements et charges actuels par ceux du modèle.'
                    : 'تنبيه: سيتم استبدال استثماراتك ومصاريفك الحالية بتلك الموجودة في النموذج.'}
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{template.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.investments.length} {language === 'fr' ? 'investissements' : 'استثمارات'} •
                          {template.fixed_costs.length} {language === 'fr' ? 'charges fixes' : 'مصاريف ثابتة'} •
                          {template.variable_costs.length} {language === 'fr' ? 'charges variables' : 'مصاريف متغيرة'}
                        </p>
                      </div>
                      {selectedTemplate === key && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedTemplate('');
                }}
              >
                {t.common.cancel}
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedTemplate}
              >
                {language === 'fr' ? 'Appliquer le modèle' : 'تطبيق النموذج'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
