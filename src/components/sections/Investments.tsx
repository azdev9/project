import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { TemplateSelector } from '../TemplateSelector';
import { supabase } from '../../lib/supabase';
import { getSectorTemplate } from '../../lib/sectorTemplates';
import { Trash2 } from 'lucide-react';

interface InvestmentsProps {
  businessPlanId: string | null;
}

interface Investment {
  id: string;
  name: string;
  quantity: number;
  unit_price_ht: number;
  vat_rate: number;
  total_ht: number;
  vat_amount: number;
  total_ttc: number;
}

const VAT_RATES = [0, 7, 10, 14, 20];

export function Investments({ businessPlanId }: InvestmentsProps) {
  const { t, language } = useLanguage();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;
    setLoading(true);

    const { data } = await supabase
      .from('investments')
      .select('*')
      .eq('business_plan_id', businessPlanId)
      .order('created_at', { ascending: true });

    if (data) {
      setInvestments(data as Investment[]);
    }

    setLoading(false);
  }

  async function addInvestment() {
    if (!businessPlanId) return;

    const { data } = await supabase
      .from('investments')
      .insert({
        business_plan_id: businessPlanId,
        name: '',
        quantity: 1,
        unit_price_ht: 0,
        vat_rate: 20,
      })
      .select()
      .single();

    if (data) {
      setInvestments([...investments, data as Investment]);
    }
  }

  async function updateInvestment(id: string, field: string, value: string | number) {
    const updates: Record<string, string | number> = { [field]: value };

    await supabase
      .from('investments')
      .update(updates)
      .eq('id', id);

    const { data } = await supabase
      .from('investments')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setInvestments(investments.map(inv => inv.id === id ? data as Investment : inv));
    }
  }

  async function deleteInvestment(id: string) {
    await supabase.from('investments').delete().eq('id', id);
    setInvestments(investments.filter(inv => inv.id !== id));
  }

  async function applyTemplate(templateKey: string) {
    if (!businessPlanId) return;

    const template = getSectorTemplate(language, templateKey);
    if (!template) return;

    setLoading(true);

    await supabase.from('investments').delete().eq('business_plan_id', businessPlanId);

    const newInvestments = await Promise.all(
      template.investments.map(async (inv) => {
        const { data } = await supabase
          .from('investments')
          .insert({
            business_plan_id: businessPlanId,
            name: inv.name,
            quantity: inv.quantity,
            unit_price_ht: inv.unit_price_ht,
            vat_rate: inv.vat_rate,
          })
          .select()
          .single();
        return data;
      })
    );

    setInvestments(newInvestments.filter(Boolean) as Investment[]);
    setLoading(false);
  }

  const totals = investments.reduce(
    (acc, inv) => ({
      total_ht: acc.total_ht + (inv.total_ht || 0),
      vat_amount: acc.vat_amount + (inv.vat_amount || 0),
      total_ttc: acc.total_ttc + (inv.total_ttc || 0),
    }),
    { total_ht: 0, vat_amount: 0, total_ttc: 0 }
  );

  function formatNumber(num: number) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  if (loading) {
    return <Card title={t.investments.title}><div>{t.common.loading}</div></Card>;
  }

  return (
    <Card title={t.investments.title}>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">{t.investments.name}</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold w-24">{t.investments.quantity}</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold w-32">{t.investments.unitPriceHT}</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold w-24">{t.investments.vatRate}</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold w-32">{t.investments.totalHT}</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold w-32">{t.investments.vatAmount}</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold w-32">{t.investments.totalTTC}</th>
                <th className="border border-gray-300 px-3 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={investment.name}
                      onChange={(e) => updateInvestment(investment.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={investment.quantity}
                      onChange={(e) => updateInvestment(investment.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-blue-500 rounded"
                      min="0"
                      step="1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={investment.unit_price_ht}
                      onChange={(e) => updateInvestment(investment.id, 'unit_price_ht', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 text-right border-0 focus:ring-2 focus:ring-blue-500 rounded"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      value={investment.vat_rate}
                      onChange={(e) => updateInvestment(investment.id, 'vat_rate', parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-center border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      {VAT_RATES.map(rate => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm bg-gray-50">
                    {formatNumber(investment.total_ht || 0)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm bg-gray-50">
                    {formatNumber(investment.vat_amount || 0)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold bg-gray-50">
                    {formatNumber(investment.total_ttc || 0)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => deleteInvestment(investment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="bg-blue-50 font-bold">
                <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right">
                  {t.investments.totals}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {formatNumber(totals.total_ht)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right">
                  {formatNumber(totals.vat_amount)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right text-blue-700">
                  {formatNumber(totals.total_ttc)}
                </td>
                <td className="border border-gray-300"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="secondary" onClick={addInvestment}>
            {t.investments.addInvestment}
          </Button>
          <TemplateSelector onApplyTemplate={applyTemplate} />
        </div>
      </div>
    </Card>
  );
}
