import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { TemplateSelector } from '../TemplateSelector';
import { HelpTooltip } from '../HelpTooltip';
import { supabase } from '../../lib/supabase';
import { getSectorTemplate } from '../../lib/sectorTemplates';
import { helpData } from '../../lib/helpData';
import { Trash2, TrendingUp } from 'lucide-react';

interface FinancialsProps {
  businessPlanId: string | null;
}

interface FixedCost {
  id: string;
  name: string;
  monthly_amount: number;
}

interface VariableCost {
  id: string;
  name: string;
  rate_of_sales: number;
}

export function Financials({ businessPlanId }: FinancialsProps) {
  const { t, language } = useLanguage();
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [year1Revenue, setYear1Revenue] = useState(0);
  const [year2GrowthRate, setYear2GrowthRate] = useState(10);
  const [year3GrowthRate, setYear3GrowthRate] = useState(10);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [variableCosts, setVariableCosts] = useState<VariableCost[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  useEffect(() => {
    const monthlyRevenue = monthlyOrders * avgPrice;
    setYear1Revenue(monthlyRevenue * 12);
  }, [monthlyOrders, avgPrice]);

  async function loadData() {
    if (!businessPlanId) return;

    const [projectionsResult, fixedCostsResult, variableCostsResult] = await Promise.all([
      supabase
        .from('financial_projections')
        .select('*')
        .eq('business_plan_id', businessPlanId)
        .maybeSingle(),
      supabase
        .from('fixed_costs')
        .select('*')
        .eq('business_plan_id', businessPlanId),
      supabase
        .from('variable_costs')
        .select('*')
        .eq('business_plan_id', businessPlanId)
    ]);

    if (projectionsResult.data) {
      setMonthlyOrders(projectionsResult.data.monthly_orders || 0);
      setAvgPrice(projectionsResult.data.avg_price || 0);
      setYear1Revenue(projectionsResult.data.year_1_revenue || 0);
      setYear2GrowthRate(projectionsResult.data.year_2_revenue || 10);
      setYear3GrowthRate(projectionsResult.data.year_3_revenue || 10);
    }

    if (fixedCostsResult.data) {
      setFixedCosts(fixedCostsResult.data as FixedCost[]);
    }

    if (variableCostsResult.data) {
      setVariableCosts(variableCostsResult.data as VariableCost[]);
    }
  }

  async function saveProjections() {
    if (!businessPlanId) return;
    setSaving(true);

    const { data: existingData } = await supabase
      .from('financial_projections')
      .select('id')
      .eq('business_plan_id', businessPlanId)
      .maybeSingle();

    const projectionData = {
      business_plan_id: businessPlanId,
      monthly_orders: monthlyOrders,
      avg_price: avgPrice,
      year_1_revenue: year1Revenue,
      year_2_revenue: year2GrowthRate,
      year_3_revenue: year3GrowthRate,
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      await supabase
        .from('financial_projections')
        .update(projectionData)
        .eq('id', existingData.id);
    } else {
      await supabase.from('financial_projections').insert(projectionData);
    }

    setSaving(false);
  }

  async function addFixedCost() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('fixed_costs')
      .insert({
        business_plan_id: businessPlanId,
        name: '',
        monthly_amount: 0,
      })
      .select()
      .single();

    if (data) {
      setFixedCosts([...fixedCosts, data as FixedCost]);
    }
  }

  async function updateFixedCost(id: string, field: string, value: string | number) {
    await supabase
      .from('fixed_costs')
      .update({ [field]: value })
      .eq('id', id);

    setFixedCosts(fixedCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  async function deleteFixedCost(id: string) {
    await supabase.from('fixed_costs').delete().eq('id', id);
    setFixedCosts(fixedCosts.filter(c => c.id !== id));
  }

  async function addVariableCost() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('variable_costs')
      .insert({
        business_plan_id: businessPlanId,
        name: '',
        rate_of_sales: 0,
      })
      .select()
      .single();

    if (data) {
      setVariableCosts([...variableCosts, data as VariableCost]);
    }
  }

  async function updateVariableCost(id: string, field: string, value: string | number) {
    await supabase
      .from('variable_costs')
      .update({ [field]: value })
      .eq('id', id);

    setVariableCosts(variableCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  async function deleteVariableCost(id: string) {
    await supabase.from('variable_costs').delete().eq('id', id);
    setVariableCosts(variableCosts.filter(c => c.id !== id));
  }

  async function applyTemplate(templateKey: string) {
    if (!businessPlanId) return;

    const template = getSectorTemplate(language, templateKey);
    if (!template) return;

    setSaving(true);

    await Promise.all([
      supabase.from('fixed_costs').delete().eq('business_plan_id', businessPlanId),
      supabase.from('variable_costs').delete().eq('business_plan_id', businessPlanId),
    ]);

    const [newFixedCosts, newVariableCosts] = await Promise.all([
      Promise.all(
        template.fixed_costs.map(async (cost) => {
          const { data } = await supabase
            .from('fixed_costs')
            .insert({
              business_plan_id: businessPlanId,
              name: cost.name,
              monthly_amount: cost.monthly_amount || 0,
            })
            .select()
            .single();
          return data;
        })
      ),
      Promise.all(
        template.variable_costs.map(async (cost) => {
          const { data } = await supabase
            .from('variable_costs')
            .insert({
              business_plan_id: businessPlanId,
              name: cost.name,
              rate_of_sales: cost.rate_of_sales || 0,
            })
            .select()
            .single();
          return data;
        })
      ),
    ]);

    setFixedCosts(newFixedCosts.filter(Boolean) as FixedCost[]);
    setVariableCosts(newVariableCosts.filter(Boolean) as VariableCost[]);

    if (template.sales_hypothesis) {
      setMonthlyOrders(template.sales_hypothesis.monthly_orders);
      setAvgPrice(template.sales_hypothesis.avg_price);
    }

    setSaving(false);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  const monthlyRevenue = monthlyOrders * avgPrice;
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.monthly_amount, 0);
  const totalVariableRate = variableCosts.reduce((sum, cost) => sum + cost.rate_of_sales, 0);
  const monthlyVariableCosts = monthlyRevenue * (totalVariableRate / 100);

  const year2Revenue = year1Revenue * (1 + year2GrowthRate / 100);
  const year3Revenue = year2Revenue * (1 + year3GrowthRate / 100);

  return (
    <div className="space-y-6">
      <Card title={t.financials.salesForecast}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t.financials.monthlyOrders}
                </label>
                <HelpTooltip {...helpData[language].financials.sales_forecast} />
              </div>
              <Input
                type="number"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <Input
              label={t.financials.avgPrice}
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
            <div className="flex items-center gap-2 text-blue-800">
              <TrendingUp size={24} />
              <div>
                <div className="text-sm font-medium">{t.financials.monthlyRevenue}</div>
                <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)} MAD</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title={t.financials.fixedCosts}>
        <div className="space-y-4">
          {fixedCosts.map((cost) => (
            <div key={cost.id} className="flex items-end gap-2">
              <Input
                label={t.financials.costName}
                value={cost.name}
                onChange={(e) => updateFixedCost(cost.id, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                label={t.financials.monthlyAmount}
                type="number"
                value={cost.monthly_amount}
                onChange={(e) => updateFixedCost(cost.id, 'monthly_amount', parseFloat(e.target.value) || 0)}
                className="w-40"
                min="0"
              />
              <button
                onClick={() => deleteFixedCost(cost.id)}
                className="text-red-600 hover:text-red-700 p-2 mb-1"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t-2">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold">{formatCurrency(totalFixedCosts)} MAD/mois</span>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button variant="secondary" onClick={addFixedCost}>
              {t.financials.addFixedCost}
            </Button>
            <TemplateSelector onApplyTemplate={applyTemplate} />
          </div>
        </div>
      </Card>

      <Card title={t.financials.variableCosts}>
        <div className="space-y-4">
          {variableCosts.map((cost) => (
            <div key={cost.id} className="flex items-end gap-2">
              <Input
                label={t.financials.costName}
                value={cost.name}
                onChange={(e) => updateVariableCost(cost.id, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                label={t.financials.rateOfSales}
                type="number"
                value={cost.rate_of_sales}
                onChange={(e) => updateVariableCost(cost.id, 'rate_of_sales', parseFloat(e.target.value) || 0)}
                className="w-40"
                min="0"
                max="100"
                step="0.1"
              />
              <button
                onClick={() => deleteVariableCost(cost.id)}
                className="text-red-600 hover:text-red-700 p-2 mb-1"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <div className="space-y-2 pt-2 border-t-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Rate:</span>
              <span className="text-xl font-bold">{totalVariableRate.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Monthly Variable:</span>
              <span className="text-xl font-bold">{formatCurrency(monthlyVariableCosts)} MAD</span>
            </div>
          </div>

          <Button variant="secondary" onClick={addVariableCost}>
            {t.financials.addVariableCost}
          </Button>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            {language === 'fr'
              ? '💡 Conseil: Utilisez le bouton "Utiliser un modèle" dans les Charges fixes pour pré-remplir automatiquement les charges fixes, variables ET les hypothèses de vente.'
              : '💡 نصيحة: استخدم زر "استخدام نموذج" في المصاريف الثابتة لملء المصاريف الثابتة والمتغيرة وافتراضات البيع تلقائيًا.'}
          </div>
        </div>
      </Card>

      <Card title={t.financials.projections}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.financials.year} 1
              </label>
              <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(year1Revenue)} MAD
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.financials.year} 2 ({language === 'fr' ? 'Croissance %' : '% النمو'})
              </label>
              <Input
                type="number"
                value={year2GrowthRate}
                onChange={(e) => setYear2GrowthRate(parseFloat(e.target.value) || 0)}
                min="-100"
                step="0.1"
              />
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="text-sm text-gray-600">{language === 'fr' ? 'Revenu calculé' : 'الإيرادات المحسوبة'}</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(year2Revenue)} MAD
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.financials.year} 3 ({language === 'fr' ? 'Croissance %' : '% النمو'})
              </label>
              <Input
                type="number"
                value={year3GrowthRate}
                onChange={(e) => setYear3GrowthRate(parseFloat(e.target.value) || 0)}
                min="-100"
                step="0.1"
              />
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                <div className="text-sm text-gray-600">{language === 'fr' ? 'Revenu calculé' : 'الإيرادات المحسوبة'}</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatCurrency(year3Revenue)} MAD
                </div>
              </div>
            </div>
          </div>

          <Button onClick={saveProjections} disabled={saving}>
            {saving ? t.common.loading : t.common.save}
          </Button>
        </div>
      </Card>
    </div>
  );
}
