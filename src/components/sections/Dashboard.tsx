import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { supabase } from '../../lib/supabase';
import { TrendingUp, DollarSign, Target, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  businessPlanId: string | null;
}

export function Dashboard({ businessPlanId }: DashboardProps) {
  const { t, language } = useLanguage();
  const [metrics, setMetrics] = useState({
    totalInvestment: 0,
    monthlyRevenue: 0,
    monthlyFixedCosts: 0,
    monthlyVariableCosts: 0,
    breakEvenPoint: 0,
    profitMargin: 0,
    competitorCount: 0,
    completionRate: 0,
  });

  useEffect(() => {
    if (businessPlanId) {
      loadMetrics();
    }
  }, [businessPlanId]);

  async function loadMetrics() {
    if (!businessPlanId) return;

    const [
      investmentsResult,
      projectionsResult,
      fixedCostsResult,
      variableCostsResult,
      competitorsResult,
      businessPlanResult,
      marketDataResult,
      swotResult,
      marketingResult,
    ] = await Promise.all([
      supabase.from('investments').select('total_ttc').eq('business_plan_id', businessPlanId),
      supabase.from('financial_projections').select('*').eq('business_plan_id', businessPlanId).maybeSingle(),
      supabase.from('fixed_costs').select('monthly_amount').eq('business_plan_id', businessPlanId),
      supabase.from('variable_costs').select('rate_of_sales').eq('business_plan_id', businessPlanId),
      supabase.from('competitors').select('id').eq('business_plan_id', businessPlanId),
      supabase.from('business_plans').select('*').eq('id', businessPlanId).maybeSingle(),
      supabase.from('market_data').select('*').eq('business_plan_id', businessPlanId).maybeSingle(),
      supabase.from('swot_analysis').select('*').eq('business_plan_id', businessPlanId).maybeSingle(),
      supabase.from('marketing_strategy').select('*').eq('business_plan_id', businessPlanId).maybeSingle(),
    ]);

    const totalInvestment = investmentsResult.data?.reduce((sum, inv) => sum + (inv.total_ttc || 0), 0) || 0;
    const monthlyRevenue = projectionsResult.data
      ? (projectionsResult.data.monthly_orders || 0) * (projectionsResult.data.avg_price || 0)
      : 0;
    const monthlyFixedCosts = fixedCostsResult.data?.reduce((sum, cost) => sum + (cost.monthly_amount || 0), 0) || 0;
    const variableRate = variableCostsResult.data?.reduce((sum, cost) => sum + (cost.rate_of_sales || 0), 0) || 0;
    const monthlyVariableCosts = monthlyRevenue * (variableRate / 100);

    const totalMonthlyCosts = monthlyFixedCosts + monthlyVariableCosts;
    const breakEvenPoint = monthlyFixedCosts > 0 ? Math.ceil(monthlyFixedCosts / (1 - variableRate / 100) / (projectionsResult.data?.avg_price || 1)) : 0;
    const profitMargin = monthlyRevenue > 0 ? ((monthlyRevenue - totalMonthlyCosts) / monthlyRevenue) * 100 : 0;

    let completedSections = 0;
    const totalSections = 7;

    if (businessPlanResult.data?.project_name) completedSections++;
    if (marketDataResult.data?.target_customer) completedSections++;
    if (competitorsResult.data && competitorsResult.data.length > 0) completedSections++;
    if (swotResult.data) completedSections++;
    if (investmentsResult.data && investmentsResult.data.length > 0) completedSections++;
    if (projectionsResult.data?.monthly_orders) completedSections++;
    if (marketingResult.data?.sales_strategy) completedSections++;

    const completionRate = (completedSections / totalSections) * 100;

    setMetrics({
      totalInvestment,
      monthlyRevenue,
      monthlyFixedCosts,
      monthlyVariableCosts,
      breakEvenPoint,
      profitMargin,
      competitorCount: competitorsResult.data?.length || 0,
      completionRate,
    });
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatPercent(value: number) {
    return value.toFixed(1);
  }

  const monthlyProfit = metrics.monthlyRevenue - metrics.monthlyFixedCosts - metrics.monthlyVariableCosts;
  const isProfitable = monthlyProfit > 0;

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'fr' ? 'Tableau de Bord' : 'لوحة القيادة'}
          </h2>
          <p className="text-gray-600">
            {language === 'fr'
              ? 'Vue d\'ensemble de votre plan d\'affaires'
              : 'نظرة عامة على مخطط أعمالك'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {language === 'fr' ? 'Progression' : 'التقدم'}
            </span>
            <span className="text-sm font-bold text-blue-700">{formatPercent(metrics.completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${metrics.completionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.completionRate >= 100 ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={14} />
                {language === 'fr' ? 'Plan d\'affaires complet!' : 'مخطط الأعمال مكتمل!'}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertCircle size={14} />
                {language === 'fr'
                  ? `Complétez toutes les sections pour finaliser votre plan`
                  : `أكمل جميع الأقسام لإنهاء مخططك`}
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <DollarSign className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  {language === 'fr' ? 'Investissement Total' : 'الاستثمار الإجمالي'}
                </p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalInvestment)} MAD</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">
                  {language === 'fr' ? 'CA Mensuel' : 'المبيعات الشهرية'}
                </p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.monthlyRevenue)} MAD</p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${isProfitable ? 'from-emerald-50 to-emerald-100 border-emerald-300' : 'from-red-50 to-red-100 border-red-300'} border-2 rounded-lg p-4`}>
            <div className="flex items-center gap-3">
              <div className={`${isProfitable ? 'bg-emerald-600' : 'bg-red-600'} p-3 rounded-lg`}>
                <Target className="text-white" size={24} />
              </div>
              <div>
                <p className={`text-sm ${isProfitable ? 'text-emerald-700' : 'text-red-700'} font-medium`}>
                  {language === 'fr' ? 'Profit Mensuel' : 'الربح الشهري'}
                </p>
                <p className={`text-2xl font-bold ${isProfitable ? 'text-emerald-900' : 'text-red-900'}`}>
                  {formatCurrency(monthlyProfit)} MAD
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 p-3 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">
                  {language === 'fr' ? 'Seuil de Rentabilité' : 'نقطة التعادل'}
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {metrics.breakEvenPoint} {language === 'fr' ? 'ventes/mois' : 'مبيعات/شهر'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-3 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  {language === 'fr' ? 'Marge Bénéficiaire' : 'هامش الربح'}
                </p>
                <p className="text-2xl font-bold text-purple-900">{formatPercent(metrics.profitMargin)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-600 p-3 rounded-lg">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  {language === 'fr' ? 'Concurrents Analysés' : 'المنافسون المحللون'}
                </p>
                <p className="text-2xl font-bold text-slate-900">{metrics.competitorCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              {language === 'fr' ? 'Charges Mensuelles' : 'المصاريف الشهرية'}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Charges fixes' : 'مصاريف ثابتة'}
                </span>
                <span className="font-semibold">{formatCurrency(metrics.monthlyFixedCosts)} MAD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'fr' ? 'Charges variables' : 'مصاريف متغيرة'}
                </span>
                <span className="font-semibold">{formatCurrency(metrics.monthlyVariableCosts)} MAD</span>
              </div>
              <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg">
                  {formatCurrency(metrics.monthlyFixedCosts + metrics.monthlyVariableCosts)} MAD
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">
              {language === 'fr' ? 'Conseils Rapides' : 'نصائح سريعة'}
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {metrics.profitMargin < 20 && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    {language === 'fr'
                      ? 'Votre marge est faible. Considérez augmenter vos prix ou réduire vos coûts.'
                      : 'هامشك منخفض. فكر في زيادة أسعارك أو تقليل تكاليفك.'}
                  </span>
                </li>
              )}
              {metrics.competitorCount < 2 && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    {language === 'fr'
                      ? 'Ajoutez plus de concurrents pour une meilleure analyse de marché.'
                      : 'أضف المزيد من المنافسين لتحليل أفضل للسوق.'}
                  </span>
                </li>
              )}
              {metrics.completionRate < 100 && (
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    {language === 'fr'
                      ? 'Complétez toutes les sections pour un plan d\'affaires solide.'
                      : 'أكمل جميع الأقسام للحصول على مخطط أعمال قوي.'}
                  </span>
                </li>
              )}
              {isProfitable && metrics.completionRate >= 100 && (
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span className="font-semibold">
                    {language === 'fr'
                      ? 'Excellent! Votre plan d\'affaires est rentable et complet.'
                      : 'ممتاز! مخطط أعمالك مربح ومكتمل.'}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
