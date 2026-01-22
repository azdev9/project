import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import { Dashboard } from './components/sections/Dashboard';
import { ProjectInfo } from './components/sections/ProjectInfo';
import { MarketStudy } from './components/sections/MarketStudy';
import { ValueCanvas } from './components/sections/ValueCanvas';
import { SWOT } from './components/sections/SWOT';
import { Investments } from './components/sections/Investments';
import { Financials } from './components/sections/Financials';
import { Marketing } from './components/sections/Marketing';
import { ExportReport } from './components/sections/ExportReport';
import { Button } from './components/Button';
import { FileText, Globe, Menu, X } from 'lucide-react';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [businessPlanId, setBusinessPlanId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      loadOrCreateBusinessPlan(session.user.id);
    } else {
      signInAnonymously();
    }
  }

  async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (data?.user && !error) {
      setUser(data.user);
      loadOrCreateBusinessPlan(data.user.id);
    } else {
      loadOrCreateBusinessPlan(null);
    }
  }

  async function loadOrCreateBusinessPlan(userId: string | null) {
    const localStorageKey = 'business_plan_id';
    const storedPlanId = localStorage.getItem(localStorageKey);

    if (storedPlanId) {
      const { data: existingPlan } = await supabase
        .from('business_plans')
        .select('id')
        .eq('id', storedPlanId)
        .maybeSingle();

      if (existingPlan) {
        setBusinessPlanId(existingPlan.id);
        return;
      }
    }

    if (userId) {
      const { data: existingPlan } = await supabase
        .from('business_plans')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingPlan) {
        setBusinessPlanId(existingPlan.id);
        localStorage.setItem(localStorageKey, existingPlan.id);
        return;
      }
    }

    const { data: newPlan, error } = await supabase
      .from('business_plans')
      .insert({
        user_id: userId,
        project_name: 'Mon Projet',
        sector: 'Services',
        city_region: 'Maroc',
        language: language,
      })
      .select()
      .single();

    if (newPlan && !error) {
      setBusinessPlanId(newPlan.id);
      localStorage.setItem(localStorageKey, newPlan.id);
    } else if (error) {
      console.error('Error creating business plan:', error);
    }
  }

  async function updateBusinessPlan(data: { project_name: string; sector: string; city_region: string }) {
    if (!businessPlanId) return;

    await supabase
      .from('business_plans')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', businessPlanId);
  }

  const sections = [
    { id: 'dashboard', label: language === 'fr' ? 'Tableau de Bord' : 'لوحة القيادة', component: <Dashboard businessPlanId={businessPlanId} /> },
    { id: 'projectInfo', label: t.sections.projectInfo, component: <ProjectInfo businessPlanId={businessPlanId} onSave={updateBusinessPlan} /> },
    { id: 'marketStudy', label: t.sections.marketStudy, component: <MarketStudy businessPlanId={businessPlanId} /> },
    { id: 'valueCanvas', label: t.sections.valueCanvas, component: <ValueCanvas businessPlanId={businessPlanId} /> },
    { id: 'swot', label: t.sections.swot, component: <SWOT businessPlanId={businessPlanId} /> },
    { id: 'investments', label: t.sections.investments, component: <Investments businessPlanId={businessPlanId} /> },
    { id: 'financials', label: t.sections.financials, component: <Financials businessPlanId={businessPlanId} /> },
    { id: 'marketing', label: t.sections.marketing, component: <Marketing businessPlanId={businessPlanId} /> },
    { id: 'export', label: language === 'fr' ? 'Exporter' : 'تصدير', component: <ExportReport businessPlanId={businessPlanId} /> },
  ];

  const currentSectionData = sections.find(s => s.id === currentSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg">
                <FileText className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.app.title}</h1>
                <p className="text-sm text-gray-600">{t.app.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Globe size={20} />
                <span className="font-medium">{language === 'fr' ? 'العربية' : 'Français'}</span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${menuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <h2 className="text-white font-semibold text-lg">Sections</h2>
              </div>
              <nav className="p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setCurrentSection(section.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-md mb-1 transition-all ${
                      currentSection === section.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="space-y-8">
              {currentSectionData?.component ? (
                currentSectionData.component
              ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                  <p className="text-gray-600">Section en cours de développement</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            {language === 'fr'
              ? '© 2025 Plan d\'Affaires - Maroc. Outil d\'aide à la création d\'entreprise.'
              : '© 2025 مخطط الأعمال - المغرب. أداة مساعدة لإنشاء المشاريع.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
