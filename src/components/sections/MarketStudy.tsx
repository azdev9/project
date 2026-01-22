import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { HelpTooltip } from '../HelpTooltip';
import { supabase } from '../../lib/supabase';
import { helpData } from '../../lib/helpData';
import { Trash2 } from 'lucide-react';

interface MarketStudyProps {
  businessPlanId: string | null;
}

interface Competitor {
  id: string;
  name: string;
  price: number;
  advantages: string;
  weaknesses: string;
  differentiation: string;
}

export function MarketStudy({ businessPlanId }: MarketStudyProps) {
  const { t, language } = useLanguage();
  const [targetCustomer, setTargetCustomer] = useState('');
  const [marketSize, setMarketSize] = useState('');
  const [problemSolution, setProblemSolution] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;

    const [marketDataResult, competitorsResult] = await Promise.all([
      supabase
        .from('market_data')
        .select('*')
        .eq('business_plan_id', businessPlanId)
        .maybeSingle(),
      supabase
        .from('competitors')
        .select('*')
        .eq('business_plan_id', businessPlanId)
    ]);

    if (marketDataResult.data) {
      setTargetCustomer(marketDataResult.data.target_customer || '');
      setMarketSize(marketDataResult.data.market_size || '');
      setProblemSolution(marketDataResult.data.problem_solution || '');
    }

    if (competitorsResult.data) {
      setCompetitors(competitorsResult.data as Competitor[]);
    }
  }

  async function handleSave() {
    if (!businessPlanId) return;
    setSaving(true);

    const { data: existingData } = await supabase
      .from('market_data')
      .select('id')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    if (existingData) {
      await supabase
        .from('market_data')
        .update({
          target_customer: targetCustomer,
          market_size: marketSize,
          problem_solution: problemSolution,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id);
    } else {
      await supabase
        .from('market_data')
        .insert({
          business_plan_id: businessPlanId,
          target_customer: targetCustomer,
          market_size: marketSize,
          problem_solution: problemSolution,
        });
    }

    setSaving(false);
  }

  async function addCompetitor() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('competitors')
      .insert({
        business_plan_id: businessPlanId,
        name: '',
        price: 0,
        advantages: '',
        weaknesses: '',
        differentiation: '',
      })
      .select()
      .single();

    if (data) {
      setCompetitors([...competitors, data as Competitor]);
    }
  }

  async function updateCompetitor(id: string, field: keyof Competitor, value: string | number) {
    await supabase
      .from('competitors')
      .update({ [field]: value })
      .eq('id', id);

    setCompetitors(competitors.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  async function deleteCompetitor(id: string) {
    await supabase.from('competitors').delete().eq('id', id);
    setCompetitors(competitors.filter(c => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card title={t.sections.marketStudy}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {t.marketStudy.targetCustomer}
              </label>
              <HelpTooltip {...helpData[language].market_study.target_customer} />
            </div>
            <Textarea
              value={targetCustomer}
              onChange={(e) => setTargetCustomer(e.target.value)}
              placeholder="B2C: Jeunes 18–35 ans, urbains..."
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {t.marketStudy.marketSize}
              </label>
              <HelpTooltip {...helpData[language].market_study.market_size} />
            </div>
            <Textarea
              value={marketSize}
              onChange={(e) => setMarketSize(e.target.value)}
              placeholder="SAM estimé: 80 000 clients × 5% × 600 MAD/an..."
            />
          </div>

          <Textarea
            label={t.valueCanvas.problemSolution}
            value={problemSolution}
            onChange={(e) => setProblemSolution(e.target.value)}
            placeholder="Problème: ... / Solution: ..."
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving ? t.common.loading : t.common.save}
          </Button>
        </div>
      </Card>

      <Card title={t.marketStudy.competitors}>
        <div className="space-y-4">
          {competitors.map((competitor) => (
            <div key={competitor.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start gap-2">
                <Input
                  label={t.marketStudy.competitorName}
                  value={competitor.name}
                  onChange={(e) => updateCompetitor(competitor.id, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  label={t.marketStudy.price}
                  type="number"
                  value={competitor.price}
                  onChange={(e) => updateCompetitor(competitor.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-32"
                />
                <button
                  onClick={() => deleteCompetitor(competitor.id)}
                  className="mt-7 text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <Textarea
                label={t.marketStudy.advantages}
                value={competitor.advantages}
                onChange={(e) => updateCompetitor(competitor.id, 'advantages', e.target.value)}
                className="min-h-[60px]"
              />

              <Textarea
                label={t.marketStudy.weaknesses}
                value={competitor.weaknesses}
                onChange={(e) => updateCompetitor(competitor.id, 'weaknesses', e.target.value)}
                className="min-h-[60px]"
              />

              <Textarea
                label={t.marketStudy.differentiation}
                value={competitor.differentiation}
                onChange={(e) => updateCompetitor(competitor.id, 'differentiation', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
          ))}

          <Button variant="secondary" onClick={addCompetitor}>
            {t.marketStudy.addCompetitor}
          </Button>
        </div>
      </Card>
    </div>
  );
}
