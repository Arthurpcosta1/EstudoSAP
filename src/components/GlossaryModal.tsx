import React, { useState } from 'react';
import { X, BookOpen, Search, Layers, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { SAP_TCODES } from '../game/rules.ts';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'tcodes' | 'tables' | 'agro'>('tcodes');

  if (!isOpen) return null;

  const sapTables = [
    { name: 'MKPF', module: 'MM', title: 'Cabeçalho do Documento de Material', desc: 'Armazena data de lançamento, tipo de movimento e usuário que registrou a entrada de boi/carne.' },
    { name: 'MSEG', module: 'MM', title: 'Itens do Documento de Material', desc: 'Guarda as quantidades em KG, lotes Masterboi (CHARG), centros (WERKS) e depósitos.' },
    { name: 'EKKO', module: 'MM', title: 'Cabeçalho do Pedido de Compras', desc: 'Dados do fornecedor (LFA1), condições de pagamento, moeda e organização de compras.' },
    { name: 'EKPO', module: 'MM', title: 'Itens do Pedido de Compras', desc: 'Preço unitário por KG, limites de tolerância de excesso/falta de fornecimento.' },
    { name: 'BKPF', module: 'FI', title: 'Cabeçalho do Documento Contábil', desc: 'Chave primária BUKRS + BELNR + GJAHR. Registra moeda, data do documento e tipo de documento (BLART).' },
    { name: 'BSEG', module: 'FI', title: 'Partidas Individuais do Documento FI', desc: 'Contém lançamentos a Débito (S) e Crédito (H), contas do razão (HKONT) e centros de custo.' },
    { name: 'VBAK', module: 'SD', title: 'Cabeçalho da Ordem de Venda', desc: 'Canal de distribuição, cliente (KUNNR), tipo de pedido de venda de cortes bovinos.' },
    { name: 'VBAP', module: 'SD', title: 'Itens da Ordem de Venda', desc: 'Produtos faturados, peso líquido, peso bruto e rota logística frigorífica.' },
    { name: 'QALS', module: 'QM', title: 'Lote de Inspeção da Qualidade', desc: 'Armazena laudo veterinário, amostras sanitárias e status de liberação SIF.' },
    { name: 'MARA', module: 'Geral', title: 'Dados Gerais de Materiais', desc: 'Mestre de materiais: cortes bovinos, peso líquido, unidade de medida (KG/UN).' }
  ];

  const agroTerms = [
    { term: '3-Way Matching (Conferência Tríplice)', desc: 'Mecanismo no SAP onde a Fatura Fiscal (MIRO) só é liberada se conferir rigorosamente com o Pedido de Compras (ME21N) e a Entrada Física de Mercadorias (MIGO).' },
    { term: 'SIF (Serviço de Inspeção Federal)', desc: 'Selo oficial do Ministério da Agricultura (MAPA) obrigatório em plantas frigoríficas. Exige rastreabilidade total de lote e temperatura de câmara fria entre 0°C e 4°C.' },
    { term: 'Balança Rodoviária & Tolerância', desc: 'No recebimento de gado e saída de cargas, pesagens com variação acima da tolerância cadastrada no SAP devem gerar bloqueio imediato (Erro M7 021).' },
    { term: 'Rastreabilidade de Batelada (Lote FIFO)', desc: 'Gestão de lote (tabela MCH1) que conecta o animal desde a fazenda de origem, abate, desossa até o empacotamento da carne e envio ao cliente final.' }
  ];

  const filteredTcodes = Object.values(SAP_TCODES).filter(
    t => t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTables = sapTables.filter(
    t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAgro = agroTerms.filter(
    a => a.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
         a.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span id="glossary-modal-title" className="text-sm font-bold text-white">
              Guia Prático & Dicionário SAP Masterboi
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar T-Code, tabela (ex: MSEG, MIGO) ou termo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('tcodes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition flex items-center gap-1.5 ${
                activeTab === 'tcodes'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Transações (T-Codes)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tables')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition flex items-center gap-1.5 ${
                activeTab === 'tables'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Tabelas do Banco (SE16N)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('agro')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition flex items-center gap-1.5 ${
                activeTab === 'agro'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Conceitos Agro & SIF
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'tcodes' && (
            <div className="space-y-3">
              {filteredTcodes.map(tc => (
                <div key={tc.code} className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-cyan-400 text-sm">/{tc.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Módulo {tc.module}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs mb-1">{tc.title}</h4>
                  <p className="text-xs text-slate-400 mb-2">{tc.description}</p>
                  <div className="text-[11px] font-mono text-slate-500">
                    Tabelas: {tc.keyTables.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-3">
              {filteredTables.map(tb => (
                <div key={tb.name} className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-400 text-sm">{tb.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Módulo {tb.module}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs mb-1">{tb.title}</h4>
                  <p className="text-xs text-slate-400">{tb.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'agro' && (
            <div className="space-y-3">
              {filteredAgro.map((ag, i) => (
                <div key={i} className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
                  <h4 className="font-bold text-emerald-400 text-xs mb-1.5">{ag.term}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ag.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-xs transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
