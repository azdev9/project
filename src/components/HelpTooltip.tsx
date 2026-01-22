import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  title: string;
  examples?: string[];
  method?: string;
  whereToFind?: string[];
}

export function HelpTooltip({ title, examples, method, whereToFind }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:text-blue-700 transition-colors"
        type="button"
      >
        <HelpCircle size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-8 z-50 w-80 bg-white rounded-lg shadow-xl border-2 border-blue-200 p-4 max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-blue-900">{title}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {examples && examples.length > 0 && (
              <div className="mb-3">
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Exemples:</h5>
                <ul className="space-y-1">
                  {examples.map((example, index) => (
                    <li key={index} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {method && (
              <div className="mb-3">
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Méthode:</h5>
                <p className="text-sm text-gray-600">{method}</p>
              </div>
            )}

            {whereToFind && whereToFind.length > 0 && (
              <div>
                <h5 className="font-semibold text-sm text-gray-700 mb-2">Où trouver:</h5>
                <ul className="space-y-1">
                  {whereToFind.map((source, index) => (
                    <li key={index} className="text-sm text-gray-600 pl-4 relative before:content-['→'] before:absolute before:left-0">
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
