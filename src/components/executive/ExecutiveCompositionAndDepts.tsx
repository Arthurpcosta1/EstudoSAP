import React from 'react';
import {
  Building2,
  ShoppingCart,
  Truck,
  Receipt,
  Landmark,
  ShieldCheck,
  Cpu,
  Store,
  ChevronRight
} from 'lucide-react';
import { Scenario } from '../../game/rules.ts';

interface ExecutiveCompositionAndDeptsProps {
  currentScenario: Scenario;
  currentStep: number;
  totalSteps: number;
}

export const ExecutiveCompositionAndDepts: React.FC<ExecutiveCompositionAndDeptsProps> = ({
  currentScenario,
  currentStep,
  totalSteps
}) => {
  const departments = [
    {
      name: 'Compras (MM)',
      icon: ShoppingCart,
      projects: '2 cenários',
      dots: { green: 1, yellow: 1, red: 0 },
      highlight: currentScenario.module.includes('MM'),
      tasks: [
        { name: 'Recebimento & Balança 01', pct: currentStep > 0 ? '100%' : 'Ativo' },
        { name: 'Entrada Fatura MIRO', pct: currentStep > 1 ? '100%' : 'Fila' },
      ]
    },
    {
      name: 'Comercial (SD)',
      icon: Store,
      projects: '1 cenário',
      dots: { green: 1, yellow: 0, red: 0 },
      highlight: currentScenario.module.includes('SD'),
      tasks: [
        { name: 'Ordem Venda VA01 & Remessa', pct: currentStep > 2 ? '100%' : 'Fila' },
      ]
    },
    {
      name: 'Controladoria (FI/CO)',
      icon: Landmark,
      projects: '1 cenário',
      dots: { green: 1, yellow: 0, red: 0 },
      highlight: currentScenario.module.includes('FI'),
      tasks: [
        { name: 'Auditoria BKPF/BSEG Contábil', pct: currentStep > 3 ? '100%' : 'Fila' },
      ]
    },
    {
      name: 'Qualidade & SIF (QM)',
      icon: ShieldCheck,
      projects: '1 cenário',
      dots: { green: 0, yellow: 1, red: 0 },
      highlight: currentScenario.module.includes('QM'),
      tasks: [
        { name: 'Lotes de Inspeção QA32', pct: currentStep > 4 ? '100%' : 'Fila' },
      ]
    },
    {
      name: 'TI & Arquitetura (BASIS)',
      icon: Cpu,
      projects: '1 cenário',
      dots: { green: 1, yellow: 0, red: 0 },
      highlight: currentScenario.module.includes('BASIS'),
      tasks: [
        { name: 'Análise DUMP ST22 & QAS', pct: currentStep > 5 ? '100%' : 'Fila' },
      ]
    },
    {
      name: 'Logística & Transporte',
      icon: Truck,
      projects: '1 cenário',
      dots: { green: 1, yellow: 0, red: 0 },
      highlight: false,
      tasks: [
        { name: 'Expedição Frigorífico Masterboi', pct: 'Monitorado' },
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Composition Bar matching Screenshot 1 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-800">
            Composição do portfólio por relevância estratégica
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {currentStep + 1} de {totalSteps} em execução
          </span>
        </div>

        {/* The segmented bar */}
        <div className="h-9 w-full bg-gray-200 rounded-lg flex overflow-hidden font-sans text-xs font-bold text-white shadow-inner">
          <div
            className="bg-[#ba0c2f] flex items-center justify-center transition-all duration-500"
            style={{ width: `${Math.round(((currentStep + 1) / totalSteps) * 100)}%` }}
          >
            <span className="truncate px-2">
              {currentStep + 1} ({Math.round(((currentStep + 1) / totalSteps) * 100)}%)
            </span>
          </div>
          <div
            className="bg-[#6b7280] flex items-center justify-center flex-1 transition-all duration-500"
          >
            <span className="truncate px-2">
              {totalSteps - (currentStep + 1)} ({100 - Math.round(((currentStep + 1) / totalSteps) * 100)}%)
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba0c2f]" />
            <span>Casos Estratégicos Homologados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6b7280]" />
            <span>Fila de Auditoria Pendente</span>
          </div>
        </div>
      </div>

      {/* Departmental Cards matching Screenshot 2 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              STATUS SEMANAL POR ÁREA MASTERBOI
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              ● viva · homologação ativa
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Versão de {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border p-3.5 transition-all ${
                  dept.highlight
                    ? 'border-[#ba0c2f] ring-2 ring-[#ba0c2f]/10 shadow-sm'
                    : 'border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-[#ba0c2f] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">
                        {dept.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 block">
                        {dept.projects}
                      </span>
                    </div>
                  </div>

                  {/* Status dots matching screenshot 2 */}
                  <div className="flex items-center gap-1">
                    {dept.dots.green > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● {dept.dots.green}
                      </span>
                    )}
                    {dept.dots.yellow > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ● {dept.dots.yellow}
                      </span>
                    )}
                    {dept.dots.red > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-700 border border-red-200">
                        ● {dept.dots.red}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtasks */}
                <div className="space-y-1.5 border-t border-gray-100 pt-2 text-[11px]">
                  {dept.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="flex items-center justify-between text-gray-600">
                      <span className="truncate max-w-[170px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {task.name}
                      </span>
                      <span
                        className={`font-semibold font-mono text-[10px] ${
                          task.pct === '100%'
                            ? 'text-emerald-600'
                            : task.pct === 'Ativo'
                            ? 'text-[#ba0c2f]'
                            : 'text-gray-400'
                        }`}
                      >
                        {task.pct}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
