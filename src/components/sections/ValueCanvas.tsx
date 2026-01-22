import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';
import { Lightbulb, Target } from 'lucide-react';

interface ValueCanvasProps {
  businessPlanId: string | null;
}

export function ValueCanvas({ businessPlanId }: ValueCanvasProps) {
  const { t, language } = useLanguage();
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('market_data')
      .select('problem_solution')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    if (data?.problem_solution) {
      const parts = data.problem_solution.split('|SOLUTION|');
      setProblem(parts[0]?.replace('PROBLEM|', '') || '');
      setSolution(parts[1] || '');
    }
  }

  async function handleSave() {
    if (!businessPlanId) return;
    setSaving(true);

    const problemSolutionText = `PROBLEM|${problem}|SOLUTION|${solution}`;

    const { data: existingData } = await supabase
      .from('market_data')
      .select('id')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    if (existingData) {
      await supabase
        .from('market_data')
        .update({
          problem_solution: problemSolutionText,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id);
    } else {
      await supabase
        .from('market_data')
        .insert({
          business_plan_id: businessPlanId,
          problem_solution: problemSolutionText,
        });
    }

    setSaving(false);
  }

  const examples = language === 'fr' ? [
    {
      problem: 'Délais de livraison trop longs (5-7 jours)',
      solution: 'Service express 24-48h avec suivi en temps réel',
    },
    {
      problem: 'Prix non transparents, devis compliqués',
      solution: 'Calculateur en ligne + devis instantané',
    },
    {
      problem: 'Manque de confiance dans la qualité',
      solution: 'Garantie satisfaction 30 jours + échantillons gratuits',
    },
  ] : [
    {
      problem: 'التأخر في التسليم (5-7 أيام)',
      solution: 'خدمة سريعة 24-48 ساعة مع متابعة مباشرة',
    },
    {
      problem: 'أسعار غير واضحة، عروض معقدة',
      solution: 'حاسبة عبر الإنترنت + عرض سعر فوري',
    },
    {
      problem: 'ضعف الثقة في الجودة',
      solution: 'ضمان الرضا 30 يوم + عينات مجانية',
    },
  ];

  return (
    <Card title={t.valueCanvas.problemSolution}>
      <div className="space-y-6">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">
                {language === 'fr' ? 'Exemples de Problème / Solution' : 'أمثلة على المشكلة / الحل'}
              </h3>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-red-700">
                        {language === 'fr' ? '❌ Problème:' : '❌ المشكلة:'}
                      </span>
                      <span className="text-gray-700">{example.problem}</span>
                    </div>
                    <div className="flex items-start gap-2 mt-1">
                      <span className="font-semibold text-green-700">
                        {language === 'fr' ? '✅ Solution:' : '✅ الحل:'}
                      </span>
                      <span className="text-gray-700">{example.solution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-red-600" size={24} />
              <h3 className="text-lg font-bold text-red-900">{t.valueCanvas.problem}</h3>
            </div>
            <Textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Décrivez le problème principal que vos clients rencontrent...'
                  : 'صف المشكلة الرئيسية التي يواجهها زبناؤك...'
              }
              className="min-h-[200px] bg-white"
            />
            <div className="mt-3 text-sm text-red-700">
              {language === 'fr' ? (
                <>
                  <strong>Conseils:</strong> Soyez spécifique. Utilisez des chiffres si possible (ex: "délai de 7 jours", "coût élevé de 30%").
                </>
              ) : (
                <>
                  <strong>نصائح:</strong> كن محددًا. استخدم الأرقام إن أمكن (مثل: "مدة 7 أيام"، "تكلفة عالية 30%").
                </>
              )}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-green-600" size={24} />
              <h3 className="text-lg font-bold text-green-900">{t.valueCanvas.solution}</h3>
            </div>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder={
                language === 'fr'
                  ? 'Comment votre produit/service résout ce problème...'
                  : 'كيف يحل منتجك/خدمتك هذه المشكلة...'
              }
              className="min-h-[200px] bg-white"
            />
            <div className="mt-3 text-sm text-green-700">
              {language === 'fr' ? (
                <>
                  <strong>Conseils:</strong> Incluez une preuve ou garantie (ex: "livraison 24h garantie", "satisfaction ou remboursé").
                </>
              ) : (
                <>
                  <strong>نصائح:</strong> أضف دليلًا أو ضمانًا (مثل: "تسليم 24 ساعة مضمون"، "الرضا أو استرداد الأموال").
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            {language === 'fr' ? 'Méthode Value Proposition Canvas' : 'طريقة Value Proposition Canvas'}
          </h4>
          <p className="text-sm text-blue-800">
            {language === 'fr' ? (
              <>
                Un bon Value Proposition répond à: <strong>Quel problème?</strong> → <strong>Quelle solution?</strong> → <strong>Quelle preuve?</strong>
                <br />
                Exemple: "Délai long" → "Livraison 24h" → "Garantie ou remboursé"
              </>
            ) : (
              <>
                عرض قيمة جيد يجيب على: <strong>ما المشكلة؟</strong> → <strong>ما الحل؟</strong> → <strong>ما الدليل؟</strong>
                <br />
                مثال: "التأخر" → "تسليم 24 ساعة" → "ضمان أو استرداد"
              </>
            )}
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </Button>
      </div>
    </Card>
  );
}
