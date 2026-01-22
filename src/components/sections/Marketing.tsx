import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Textarea } from '../Textarea';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';

interface MarketingProps {
  businessPlanId: string | null;
}

export function Marketing({ businessPlanId }: MarketingProps) {
  const { t } = useLanguage();
  const [salesStrategy, setSalesStrategy] = useState('');
  const [digitalMarketing, setDigitalMarketing] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('marketing_strategy')
      .select('*')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    if (data) {
      setSalesStrategy(data.sales_strategy || '');
      setDigitalMarketing(data.digital_marketing || '');
    }
  }

  async function handleSave() {
    if (!businessPlanId) return;
    setSaving(true);

    const { data: existingData } = await supabase
      .from('marketing_strategy')
      .select('id')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    const marketingData = {
      business_plan_id: businessPlanId,
      sales_strategy: salesStrategy,
      digital_marketing: digitalMarketing,
      channels: [],
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      await supabase
        .from('marketing_strategy')
        .update(marketingData)
        .eq('id', existingData.id);
    } else {
      await supabase.from('marketing_strategy').insert(marketingData);
    }

    setSaving(false);
  }

  return (
    <Card title={t.sections.marketing}>
      <div className="space-y-4">
        <Textarea
          label={t.marketing.salesStrategy}
          value={salesStrategy}
          onChange={(e) => setSalesStrategy(e.target.value)}
          placeholder="WhatsApp + partenariats + offres pack..."
          className="min-h-[150px]"
        />

        <Textarea
          label={t.marketing.digitalMarketing}
          value={digitalMarketing}
          onChange={(e) => setDigitalMarketing(e.target.value)}
          placeholder="Instagram + TikTok + Google Maps + Ads léger..."
          className="min-h-[150px]"
        />

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </Button>
      </div>
    </Card>
  );
}
