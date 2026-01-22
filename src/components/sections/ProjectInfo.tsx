import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { HelpTooltip } from '../HelpTooltip';
import { supabase } from '../../lib/supabase';
import { helpData } from '../../lib/helpData';

interface ProjectInfoProps {
  businessPlanId: string | null;
  onSave: (data: { project_name: string; sector: string; city_region: string }) => void;
}

export function ProjectInfo({ businessPlanId, onSave }: ProjectInfoProps) {
  const { t, language } = useLanguage();
  const [projectName, setProjectName] = useState('');
  const [sector, setSector] = useState('');
  const [cityRegion, setCityRegion] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (businessPlanId) {
      loadData();
    }
  }, [businessPlanId]);

  async function loadData() {
    if (!businessPlanId) return;

    const { data, error } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', businessPlanId)
      .maybeSingle();

    if (data && !error) {
      setProjectName(data.project_name || '');
      setSector(data.sector || '');
      setCityRegion(data.city_region || '');
    }
  }

  async function handleSave() {
    setSaving(true);
    onSave({
      project_name: projectName,
      sector,
      city_region: cityRegion,
    });
    setSaving(false);
  }

  return (
    <Card title={t.sections.projectInfo}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {t.projectInfo.projectName}
            </label>
            <HelpTooltip {...helpData[language].project_info.project_name} />
          </div>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Atlas Print"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {t.projectInfo.sector}
            </label>
            <HelpTooltip {...helpData[language].project_info.sector} />
          </div>
          <Input
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Services"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {t.projectInfo.cityRegion}
            </label>
            <HelpTooltip {...helpData[language].project_info.city_region} />
          </div>
          <Input
            value={cityRegion}
            onChange={(e) => setCityRegion(e.target.value)}
            placeholder="Oujda – Oriental"
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t.common.loading : t.common.save}
        </Button>
      </div>
    </Card>
  );
}
