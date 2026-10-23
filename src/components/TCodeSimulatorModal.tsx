import React, { useState } from 'react';
import { X, Play, RefreshCw, AlertCircle, CheckCircle2, Database, Table, HelpCircle } from 'lucide-react';
import { SAP_TCODES, TCodeInfo } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface TCodeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const TCodeSimulatorModal: React.FC<TCodeSimulatorModalProps> = ({
  isOpen,
  onClose,
  initialCode = 'MIGO'
}) => {
  const [activeCode, setActiveCode] = useState<string>(initialCode.toUpperCase());
  const [migoWeight, setMigoWeight] = useState<number>(5300);
  const [migoStatus, setMigoStatus] = useState<{ type: 'none' | 'success' | 'error'; message: string }>({
    type: 'none',
    message: ''
  });

  const [miroPrice, setMiroPrice] = useState<number>(25);
  const [miroStatus, setMiroStatus] = useState<{ type: 'none' | 'success' | 'blocked'; message: string }>({
    type: 'none',
    message: ''
  });

  const [se16nTable, setSe16nTable] = useState<string>('BKPF');
  const [se16nRows, setSe16nRows] = useState<Record<string, string>[] | null>(null);

  if (!isOpen) return null;

  const currentInfo: TCodeInfo | undefined = SAP_TCODES[activeCode];

  const handleRunMigo = () => {
    sound.playKeyClick();
    if (migoWeight > 5000) {
      sound.playError();
      setMigoStatus({
        type: 'error',
        message: 'ERRO M7 021: Excesso de fornecimento de 300,000 KG não admitido. Tolerância configurada no Pedido 4500089201 é 0,0%.'
      });
    } else {
      sound.playSuccess();
      setMigoStatus({
        type: 'success',
        message: `SUCESSO: Documento de Material 5000948291 gerado com êxito! 1 item lançado no estoque frigorífico MB01/DEP-BOV. Movimento 101.`
      });
    }
  };

  const handleRunMiro = () => {
    sound.playKeyClick();
    if (miroPrice > 20) {
      sound.playError();
      setMiroStatus({
        type: 'blocked',
        message: 'AVISO / BLOQUEIO (M8 082): Divergência de preço ultrapassou tolerância. Fatura gravada com BLOQUEIO R (Preço Pedido R$ 20,00 vs Fatura R$ 25,00). Pagamento retido em FI.'
      });
    } else {
      sound.playSuccess();
      setMiroStatus({
        type: 'success',
        message: 'SUCESSO (M8 014): Documento contábil 5105600189 lançado sem bloqueios. 3-Way Match 100% conciliado.'
      });
    }
  };

  const handleRunSe16n = () => {
    sound.playKeyClick();
    sound.playSuccess();
    if (se16nTable === 'BKPF') {
      setSe16nRows([
        { BUKRS: 'MB01', BELNR: '100049281', GJAHR: '2026', BLART: 'KR', BUDAT: '22.10.2026', USNAM: 'QA_MASTER', BKTXT: 'NF CARNE CANHOTINHO' },
        { BUKRS: 'MB01', BELNR: '100049282', GJAHR: '2026', BLART: 'WE', BUDAT: '22.10.2026', USNAM: 'OP_BALANCA', BKTXT: 'ENTRADA DE GADO VIVO' },
        { BUKRS: 'MB01', BELNR: '100049283', GJAHR: '2026', BLART: 'RV', BUDAT: '22.10.2026', USNAM: 'EXP_RECIFE', BKTXT: 'FATURA PICANHA EMBALADA' }
      ]);
    } else if (se16nTable === 'BSEG') {
      setSe16nRows([
        { BELNR: '100049281', BUZEI: '001', SHKZG: 'S (Débito)', KOART: 'S', HKONT: '1103001 (Estoque Carnes)', WRBTR: 'R$ 100.000,00' },
        { BELNR: '100049281', BUZEI: '002', SHKZG: 'H (Crédito)', KOART: 'K', HKONT: '2101001 (Fornecedores)', WRBTR: 'R$ 100.000,00' }
      ]);
    } else if (se16nTable === 'MSEG') {
      setSe16nRows([
        { MBLNR: '5000948291', MJAHR: '2026', ZEILE: '0001', BWART: '101', MATNR: 'BOV-INTEIRO-01', MENGE: '5.000,000 KG', CHARG: 'LOT-2026-X8' }
      ]);
    } else {
      setSe16nRows([
        { VBELN: '0008001928', ERDAT: '22.10.2026', ERNAM: 'VENDAS_SP', AUART: 'OR', KUNNR: '0000109281 (REDE BOMPRECO)', NETWR: 'R$ 285.000,00' }
      ]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tcode-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span id="tcode-modal-title" className="text-xs font-mono font-semibold text-cyan-400 ml-2">
              SAP GUI / Terminal Interativo — Ambiente Masterboi QAS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            aria-label="Fechar terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Bar for Quick T-Codes */}
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400">Atalhos T-Codes:</span>
          {Object.keys(SAP_TCODES).map(code => (
            <button
              key={code}
              type="button"
              onClick={() => {
                sound.playKeyClick();
                setActiveCode(code);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded transition ${
                activeCode === code
                  ? 'bg-cyan-600 text-white font-bold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              /n{code}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {currentInfo ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="font-mono text-cyan-400">/{currentInfo.code}</span>
                  <span>— {currentInfo.title}</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Módulo SAP {currentInfo.module}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-4">{currentInfo.description}</p>

              {/* Interactive Screen Sandbox */}
              {activeCode === 'MIGO' && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
                  <div className="text-slate-400 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>SIMULAÇÃO: RECEBIMENTO FÍSICO NA BALANÇA (MIGO - MOV 101)</span>
                    <span className="text-emerald-400">PO: 4500089201 (5.000 KG)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Peso da Balança Rodoviária (KG):</label>
                      <input
                        type="number"
                        value={migoWeight}
                        onChange={e => setMigoWeight(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Dica: Teste 5000 KG (dentro do pedido) vs 5300 KG (excesso não tolerado).
                      </span>
                    </div>

                    <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Dados do Lançamento:</div>
                      <div className="text-slate-200">Fornecedor: Fazenda Vale do Boi (LFA1)</div>
                      <div className="text-slate-200">Material: CARNE BOVINA RESFRIADA (MARA)</div>
                      <div className="text-slate-200">Tolerância do Pedido: 0%</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunMigo}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Simular Postagem no QAS
                  </button>

                  {migoStatus.type !== 'none' && (
                    <div
                      className={`mt-4 p-3 rounded border text-xs leading-relaxed ${
                        migoStatus.type === 'success'
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-600 text-rose-300'
                      }`}
                    >
                      {migoStatus.message}
                    </div>
                  )}
                </div>
              )}

              {activeCode === 'MIRO' && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
                  <div className="text-slate-400 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>SIMULAÇÃO: ENTRADA DE FATURA FISCAL / 3-WAY MATCH (MIRO)</span>
                    <span className="text-cyan-400">PO Unitário: R$ 20,00 / KG</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Preço Cobrado na NF-e (R$/KG):</label>
                      <input
                        type="number"
                        value={miroPrice}
                        onChange={e => setMiroPrice(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Dica: Teste R$ 20,00 (preço conforme pedido) vs R$ 25,00 (divergência).
                      </span>
                    </div>

                    <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Regra de Negócio:</div>
                      <div className="text-slate-200">Pedido x Entrada MIGO x Nota Fiscal</div>
                      <div className="text-slate-200">Chave de Bloqueio esperada: R</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunMiro}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Simular Validação 3-Way Match
                  </button>

                  {miroStatus.type !== 'none' && (
                    <div
                      className={`mt-4 p-3 rounded border text-xs leading-relaxed ${
                        miroStatus.type === 'success'
                          ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                          : 'bg-amber-950/60 border-amber-600 text-amber-300'
                      }`}
                    >
                      {miroStatus.message}
                    </div>
                  )}
                </div>
              )}

              {activeCode === 'SE16N' && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
                  <div className="text-slate-400 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>SIMULAÇÃO: AUDITORIA DE TABELAS TRANSPARENTES (SE16N)</span>
                    <span className="text-amber-400">Dicionário ABAP Masterboi</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <label className="text-slate-400">Nome da Tabela:</label>
                    <select
                      value={se16nTable}
                      onChange={e => setSe16nTable(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white font-mono"
                    >
                      <option value="BKPF">BKPF (Cabeçalho Documento Contábil)</option>
                      <option value="BSEG">BSEG (Partidas Dobradas Contábeis)</option>
                      <option value="MSEG">MSEG (Itens Documento de Material)</option>
                      <option value="VBAK">VBAK (Cabeçalho de Ordens de Venda SD)</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleRunSe16n}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition flex items-center gap-1.5"
                    >
                      <Database className="w-3.5 h-3.5" />
                      Executar Consulta (F8)
                    </button>
                  </div>

                  {se16nRows && (
                    <div className="overflow-x-auto border border-slate-800 rounded">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-cyan-400 border-b border-slate-800">
                            {Object.keys(se16nRows[0]).map(col => (
                              <th key={col} className="p-2 font-mono text-[11px]">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {se16nRows.map((row, i) => (
                            <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-900/50">
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="p-2 font-mono text-slate-300">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* QA Checklist for current T-Code */}
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 mt-4">
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Checklist Essencial de QA para {currentInfo.code}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentInfo.qaChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Tables */}
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="font-bold text-slate-300">Tabelas Relacionadas:</span>
                {currentInfo.keyTables.map((t, idx) => (
                  <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>T-Code não cadastrado no simulador.</p>
              <p className="text-xs mt-2">Escolha uma das opções acima (MIGO, MIRO, VA01, SE16N, etc.)</p>
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
            Fechar Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
