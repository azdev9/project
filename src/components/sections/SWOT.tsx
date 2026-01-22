import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';
import { Plus, X } from 'lucide-react';

interface SWOTProps {
  businessPlanId: string | null;
}

export function SWOT({ businessPlanId }: SWOTProps) {
  const { t } = useLanguage();
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [threats, setThreats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('swot_analysis')
      .select('*')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    if (data) {
      setStrengths((data.strengths as string[]) || []);
      setWeaknesses((data.weaknesses as string[]) || []);
      setOpportunities((data.opportunities as string[]) || []);
      setThreats((data.threats as string[]) || []);
    }
  }

  async function handleSave() {
    if (!businessPlanId) return;
    setSaving(true);

    const { data: existingData } = await supabase
      .from('swot_analysis')
      .select('id')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    const swotData = {
      business_plan_id: businessPlanId,
      strengths,
      weaknesses,
      opportunities,
      threats,
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      await supabase
        .from('swot_analysis')
        .update(swotData)
        .eq('id', existingData.id);
    } else {
      await supabase.from('swot_analysis').insert(swotData);
    }

    setSaving(false);
  }

  function addItem(category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') {
    const setters = {
      strengths: setStrengths,
      weaknesses: setWeaknesses,
      opportunities: setOpportunities,
      threats: setThreats,
    };

    const values = {
      strengths,
      weaknesses,
      opportunities,
      threats,
    };

    setters[category]([...values[category], '']);
  }

  function updateItem(category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number, value: string) {
    const setters = {
      strengths: setStrengths,
      weaknesses: setWeaknesses,
      opportunities: setOpportunities,
      threats: setThreats,
    };

    const values = {
      strengths,
      weaknesses,
      opportunities,
      threats,
    };

    const newArray = [...values[category]];
    newArray[index] = value;
    setters[category](newArray);
  }

  function removeItem(category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) {
    const setters = {
      strengths: setStrengths,
      weaknesses: setWeaknesses,
      opportunities: setOpportunities,
      threats: setThreats,
    };

    const values = {
      strengths,
      weaknesses,
      opportunities,
      threats,
    };

    setters[category](values[category].filter((_, i) => i !== index));
  }

  function renderCategory(
    title: string,
    items: string[],
    category: 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
    colorClass: string
  ) {
    return (
      <div className={`p-4 rounded-lg border-2 ${colorClass}`}>
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(category, index, e.target.value)}
                className="flex-1"
              />
              <button
                onClick={() => removeItem(category, index)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addItem(category)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mt-2"
          >
            <Plus size={16} />
            {t.swot.addItem}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card title={t.sections.swot}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderCategory(t.swot.strengths, strengths, 'strengths', 'border-green-300 bg-green-50')}
          {renderCategory(t.swot.weaknesses, weaknesses, 'weaknesses', 'border-yellow-300 bg-yellow-50')}
          {renderCategory(t.swot.opportunities, opportunities, 'opportunities', 'border-blue-300 bg-blue-50')}
          {renderCategory(t.swot.threats, threats, 'threats', 'border-red-300 bg-red-50')}
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </Button>
      </div>
    </Card>
  );
}
