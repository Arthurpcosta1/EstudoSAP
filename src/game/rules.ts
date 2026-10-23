/**
 * Pure game rules, career progression, scoring calculations, and SAP transaction registry.
 * Decoupled from React UI for deterministic testing.
 */

export interface ScenarioOption {
  id: string;
  text: string;
  correct: boolean;
  note: string;
  technicalDetail?: string;
}

export interface SapDocumentSample {
  type: 'MIGO' | 'MIRO' | 'SE16N' | 'VA01' | 'QA32';
  title: string;
  fields: Record<string, string>;
  rawOutput?: string;
}

export interface Scenario {
  id: string;
  module: string;
  title: string;
  plantLocation: string;
  desc: string;
  options: ScenarioOption[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  xpReward: number;
  sapDocSample?: SapDocumentSample;
  recommendedTCode?: string;
}

export interface CareerRank {
  title: string;
  minXp: number;
  level: number;
  badge: string;
  description: string;
}

export const CAREER_RANKS: CareerRank[] = [
  { level: 1, minXp: 0, title: 'Estagiário de Testes SAP', badge: '🌱', description: 'Iniciando no ambiente de homologação (QAS) da Masterboi.' },
  { level: 2, minXp: 100, title: 'Assistente QA I', badge: '🥩', description: 'Executando testes manuais de pesagem e entrada de gado (MM).' },
  { level: 3, minXp: 250, title: 'Assistente QA II', badge: '🔍', description: 'Validando 3-way match, faturas fiscais e notas de entrada (FI/MM).' },
  { level: 4, minXp: 450, title: 'Analista QA Júnior SAP', badge: '⚙️', description: 'Conduzindo testes integrados em Order-to-Cash (SD) e expedição.' },
  { level: 5, minXp: 700, title: 'Analista QA Pleno Masterboi', badge: '🛡️', description: 'Perito em tabelas do dicionário ABAP (SE16N) e auditoria contábil.' },
  { level: 6, minXp: 1000, title: 'Analista QA Sênior E2E', badge: '⭐', description: 'Liderando homologações de go-live, rastreabilidade SIF e auditoria.' },
  { level: 7, minXp: 1300, title: 'QA Lead Auditor & Arquiteto SAP', badge: '👑', description: 'Referência máxima de qualidade de software do ecossistema Masterboi.' }
];

export interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const ALL_BADGES: Badge[] = [
  { id: 'first-blood', name: 'Primeiro Teste Aprovado', icon: '🎯', desc: 'Validou seu primeiro caso de teste no QAS sem regressão.' },
  { id: 'p2p-master', name: 'Mestre do Procure-to-Pay', icon: '📦', desc: 'Acertou os desafios de entrada de gado (MIGO) e tolerância de fatura (MIRO).' },
  { id: 'o2c-pro', name: 'Especialista em Distribuição', icon: '🚛', desc: 'Homologou o fluxo ponta a ponta de vendas e remessa para clientes.' },
  { id: 'se16n-detective', name: 'Detetive do Banco SE16N', icon: '🔎', desc: 'Identificou com precisão as tabelas contábeis (BKPF/BSEG) e de materiais.' },
  { id: 'sif-guardian', name: 'Guardião da Rastreabilidade SIF', icon: '🏷️', desc: 'Protegeu a fábrica contra expedição de lotes com divergência de controle.' },
  { id: 'perfect-run', name: 'Zero Bugs em Produção', icon: '💎', desc: 'Completou a homologação mantendo a integridade do sistema em 100%.' }
];

export interface PowerUps {
  fiftyFifty: number;
  seniorHint: number;
  dumpShield: boolean;
}

export interface GameState {
  currentStep: number;
  hp: number;
  xp: number;
  streak: number;
  maxStreak: number;
  answers: { scenarioId: string; optionIndex: number; correct: boolean }[];
  earnedBadges: string[];
  isFinished: boolean;
  powerUps: PowerUps;
  eliminatedOptions: number[]; // indices of options removed by 50/50 for current question
  activeSeniorHint: string | null;
  shieldUsedInCurrentQuestion: boolean;
}

export function getInitialGameState(): GameState {
  return {
    currentStep: 0,
    hp: 100,
    xp: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
    earnedBadges: [],
    isFinished: false,
    powerUps: {
      fiftyFifty: 1,
      seniorHint: 2,
      dumpShield: false
    },
    eliminatedOptions: [],
    activeSeniorHint: null,
    shieldUsedInCurrentQuestion: false
  };
}

export function useFiftyFifty(state: GameState, scenario: Scenario): GameState {
  if (state.powerUps.fiftyFifty <= 0 || state.eliminatedOptions.length > 0) {
    return state;
  }

  // Find incorrect options and pick 2 to eliminate
  const incorrectIndices = scenario.options
    .map((opt, idx) => ({ idx, correct: opt.correct }))
    .filter(item => !item.correct)
    .map(item => item.idx);

  // Take first 2 incorrect
  const eliminated = incorrectIndices.slice(0, 2);

  return {
    ...state,
    powerUps: {
      ...state.powerUps,
      fiftyFifty: state.powerUps.fiftyFifty - 1
    },
    eliminatedOptions: eliminated
  };
}

export function useSeniorHint(state: GameState, scenario: Scenario): GameState {
  if (state.powerUps.seniorHint <= 0) {
    return state;
  }

  const hint = scenario.options.find(o => o.correct)?.technicalDetail ||
    `Foque no módulo correto (${scenario.module.split('-')[0].trim()}) e lembre-se do fluxo padrão de compras/vendas!`;

  return {
    ...state,
    powerUps: {
      ...state.powerUps,
      seniorHint: state.powerUps.seniorHint - 1
    },
    activeSeniorHint: hint
  };
}

export function activateDumpShield(state: GameState): GameState {
  return {
    ...state,
    powerUps: {
      ...state.powerUps,
      dumpShield: true
    }
  };
}

export function getCareerRank(xp: number): CareerRank {
  for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= CAREER_RANKS[i].minXp) {
      return CAREER_RANKS[i];
    }
  }
  return CAREER_RANKS[0];
}

export function getNextRankProgress(xp: number): { currentRank: CareerRank; nextRank: CareerRank | null; progressPercent: number } {
  const currentRank = getCareerRank(xp);
  const currentIndex = CAREER_RANKS.findIndex(r => r.level === currentRank.level);
  const nextRank = currentIndex < CAREER_RANKS.length - 1 ? CAREER_RANKS[currentIndex + 1] : null;

  if (!nextRank) {
    return { currentRank, nextRank: null, progressPercent: 100 };
  }

  const range = nextRank.minXp - currentRank.minXp;
  const currentInRank = xp - currentRank.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));

  return { currentRank, nextRank, progressPercent };
}

export function applyAnswer(
  currentState: GameState,
  scenario: Scenario,
  optionIndex: number
): { nextState: GameState; isCorrect: boolean; xpDelta: number; hpDelta: number; newBadgeUnlocked?: string } {
  const option = scenario.options[optionIndex];
  if (!option) {
    throw new Error(`Invalid optionIndex: ${optionIndex}`);
  }

  const isCorrect = option.correct;
  let xpDelta = 0;
  let hpDelta = 0;
  let shieldUsed = false;
  const newStreak = isCorrect ? currentState.streak + 1 : 0;
  const maxStreak = Math.max(currentState.maxStreak, newStreak);

  let nextPowerUps = { ...currentState.powerUps };

  if (isCorrect) {
    // XP reward + streak bonus (10% extra per streak after 1)
    const streakBonus = Math.min(50, (newStreak - 1) * 10);
    xpDelta = scenario.xpReward + streakBonus;
  } else {
    // If shield is active, block the damage!
    if (currentState.powerUps.dumpShield) {
      shieldUsed = true;
      hpDelta = 0;
      nextPowerUps.dumpShield = false;
    } else {
      hpDelta = -25;
    }
  }

  const nextHp = Math.max(0, Math.min(100, currentState.hp + hpDelta));
  const nextXp = currentState.xp + xpDelta;

  const nextAnswers = [
    ...currentState.answers,
    { scenarioId: scenario.id, optionIndex, correct: isCorrect }
  ];

  // Evaluate badges
  const earnedBadges = [...currentState.earnedBadges];
  let newBadgeUnlocked: string | undefined;

  function tryAwardBadge(badgeId: string) {
    if (!earnedBadges.includes(badgeId)) {
      earnedBadges.push(badgeId);
      newBadgeUnlocked = badgeId;
    }
  }

  if (isCorrect && !earnedBadges.includes('first-blood')) {
    tryAwardBadge('first-blood');
  }

  if (scenario.id === 'sc-01' && isCorrect && nextAnswers.some(a => a.scenarioId === 'sc-02' && a.correct)) {
    tryAwardBadge('p2p-master');
  }
  if (scenario.id === 'sc-02' && isCorrect && nextAnswers.some(a => a.scenarioId === 'sc-01' && a.correct)) {
    tryAwardBadge('p2p-master');
  }

  if (scenario.id === 'sc-04' && isCorrect) {
    tryAwardBadge('o2c-pro');
  }

  if (scenario.id === 'sc-03' && isCorrect) {
    tryAwardBadge('se16n-detective');
  }

  if (scenario.id === 'sc-05' && isCorrect) {
    tryAwardBadge('sif-guardian');
  }

  return {
    nextState: {
      ...currentState,
      hp: nextHp,
      xp: nextXp,
      streak: newStreak,
      maxStreak,
      answers: nextAnswers,
      earnedBadges,
      powerUps: nextPowerUps,
      shieldUsedInCurrentQuestion: shieldUsed
    },
    isCorrect,
    xpDelta,
    hpDelta,
    newBadgeUnlocked
  };
}

export interface TCodeInfo {
  code: string;
  module: 'MM' | 'SD' | 'FI' | 'CO' | 'PP' | 'QM' | 'BASIS';
  title: string;
  description: string;
  keyTables: string[];
  qaChecklist: string[];
  samplePayload?: string;
}

export const SAP_TCODES: Record<string, TCodeInfo> = {
  MIGO: {
    code: 'MIGO',
    module: 'MM',
    title: 'Movimentação de Mercadorias (Goods Movement)',
    description: 'Entrada de mercadorias, descarregamento na balança rodoviária, devoluções e transferências entre depósitos.',
    keyTables: ['MKPF (Cabeçalho)', 'MSEG (Itens do Documento de Material)', 'MCH1 (Lotes)'],
    qaChecklist: [
      'Validar bloqueio automático para excesso de peso além da tolerância do Pedido (tolerância 0% vs 5%).',
      'Verificar geração correta de Lote Masterboi com data de abate/pesagem.',
      'Checar se o tipo de movimento 101 gerou partida no razão para Fornecedores a Receber.'
    ]
  },
  MIRO: {
    code: 'MIRO',
    module: 'MM',
    title: 'Entrada de Fatura de Fornecedor (3-Way Match)',
    description: 'Lançamento fiscal do XML da NF-e vinculando Pedido de Compras (PO) + Entrada Física (MIGO) + Fatura.',
    keyTables: ['RBKP (Cabeçalho da Fatura)', 'RSEG (Itens da Fatura)', 'BKPF (Documento FI)'],
    qaChecklist: [
      'Garantir bloqueio de pagamento quando valor do XML divergir do PO acima da margem cadastrada.',
      'Testar cálculo automático de impostos retidos (IRRF, INSS, PIS/COFINS).',
      'Verificar conferência de quantidade (faturar apenas o que foi conferido fisicamente).'
    ]
  },
  VA01: {
    code: 'VA01',
    module: 'SD',
    title: 'Criar Ordem do Cliente (Sales Order)',
    description: 'Início do fluxo Order-to-Cash (O2C). Registra o pedido de cortes bovinos para grandes redes ou exportação.',
    keyTables: ['VBAK (Cabeçalho da Venda)', 'VBAP (Itens da Venda)', 'VBEP (Linhas de Divisão)'],
    qaChecklist: [
      'Validar verificação de crédito do cliente (bloqueio caso limite esteja estourado).',
      'Checar determinação de preço através da tabela de condições (VK11 / PR00).',
      'Homologar bloqueio de exportação caso cliente não possua habilitação SIF internacional.'
    ]
  },
  VL01N: {
    code: 'VL01N',
    module: 'SD',
    title: 'Criar Fornecimento com Referência à Ordem (Outbound Delivery)',
    description: 'Gera a remessa para picking, pesagem na expedição e carregamento em caminhão refrigerado.',
    keyTables: ['LIKP (Cabeçalho da Remessa)', 'LIPS (Itens da Remessa)'],
    qaChecklist: [
      'Testar picking por lote específico (FIFO e validade de carne refrigerada).',
      'Validar pesagem real do caminhão versus peso estimado no pedido.',
      'Garantir status de picking concluído antes de permitir o PGI (Post Goods Issue).'
    ]
  },
  VF01: {
    code: 'VF01',
    module: 'SD',
    title: 'Criar Documento de Faturamento / Nota Fiscal de Saída',
    description: 'Gera a fatura comercial, emite a NF-e de saída Masterboi e transmite o XML para a SEFAZ.',
    keyTables: ['VBRK (Cabeçalho do Faturamento)', 'VBRP (Itens do Faturamento)'],
    qaChecklist: [
      'Testar validação de retorno do protocolo de autorização da SEFAZ.',
      'Checar cálculo de ICMS interestadual com alíquotas de carne bovina in natura.',
      'Validar sincronização contábil imediata com contas a receber em FI.'
    ]
  },
  SE16N: {
    code: 'SE16N',
    module: 'BASIS',
    title: 'Visualizador Geral de Tabelas (Data Browser)',
    description: 'Ferramenta primordial do QA para auditar registros gravados em tabelas transparentes do SAP.',
    keyTables: ['DD02L (Dicionário de Tabelas)', 'BKPF', 'BSEG', 'MARA', 'EKKO'],
    qaChecklist: [
      'Confirmar que campos de auditoria (ERNAM, ERDAT, AEDAT) foram preenchidos corretamente.',
      'Verificar integridade referencial entre cabeçalho e itens (ex: chave BELNR e GJAHR).',
      'Garantir que usuários sem autorização específica não possam executar &SAP_EDIT.'
    ]
  },
  QA32: {
    code: 'QA32',
    module: 'QM',
    title: 'Lista de Lotes de Inspeção de Qualidade',
    description: 'Inspeção sanitária e controle de qualidade do SIF Masterboi para liberação de carcaças e carnes.',
    keyTables: ['QALS (Lote de Inspeção)', 'QAVE (Decisão de Emprego)'],
    qaChecklist: [
      'Validar que estoque sob inspeção não possa ser vendido nem expedido antes da decisão de emprego.',
      'Checar registro obrigatório de temperatura (0°C a 4°C) para carnes resfriadas.',
      'Garantir trilha de auditoria para lotes reprovados com desvio para graxaria.'
    ]
  }
};

export const MASTERBOI_SCENARIOS: Scenario[] = [
  {
    id: 'sc-01',
    module: 'SAP MM / P2P - ENTRADA DE GADO & BALANÇA',
    title: 'Homologação de Recebimento de Carga na Balança Rodoviária',
    plantLocation: 'Frigorífico Masterboi - São Geraldo do Araguaia / PA',
    desc: 'Um caminhão de gado chegou à unidade com Pedido de Compras (PO) emitido para 5.000 kg com tolerância máxima de 0%. No descarregamento físico na portaria, a balança rodoviária aferiu 5.300 kg (excesso de 300 kg). Seu papel como QA é testar se o sistema bloqueia o recebimento indevido.<br/><br/>Qual transação você usa para simular o recebimento físico e qual tabela audita os itens do Documento de Material gerado?',
    difficulty: 'Iniciante',
    xpReward: 120,
    recommendedTCode: 'MIGO',
    sapDocSample: {
      type: 'MIGO',
      title: 'Transação MIGO - Entrada de Mercadorias (Movimento 101)',
      fields: {
        'Pedido de Compra (PO)': '4500089201',
        'Fornecedor': 'Fazenda Vale do Boi (LFA1-10294)',
        'Qtd Pedida': '5.000 KG',
        'Qtd Pesada na Balança': '5.300 KG',
        'Tolerância Cadastrada': '0.0 % (Bloqueio Obrigatório)',
        'Centro / Depósito': 'MB01 / DEP-BOV'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) Transação VA01 | Tabela VBAK (Ordem de Venda)',
        correct: false,
        note: 'VA01 e VBAK pertencem ao módulo SD (Vendas). Para entrada de estoque em compras na fábrica usamos MM (MIGO)!'
      },
      {
        id: 'opt-b',
        text: 'B) Transação MIGO | Tabela MSEG (Itens de Documento de Material)',
        correct: true,
        note: 'Exato! A MIGO realiza a movimentação de mercadorias (tipo 101) e a MSEG armazena os registros, pesos e lotes no banco.',
        technicalDetail: 'No teste de regressão, tente lançar 5.300 kg. O sistema deve emitir mensagem de erro bloqueante "M7 021 - Excesso de fornecimento não admitido".'
      },
      {
        id: 'opt-c',
        text: 'C) Transação MIRO | Tabela BKPF (Documento Contábil)',
        correct: false,
        note: 'MIRO é usada para fatura fiscal/financeiro (invoicing), não para o descarregamento físico na portaria.'
      },
      {
        id: 'opt-d',
        text: 'D) Transação ME21N | Tabela EKKO (Cabeçalho do Pedido)',
        correct: false,
        note: 'ME21N apenas CRIA o pedido de compras; ela não realiza a pesagem nem o recebimento da carga viva na fábrica.'
      }
    ]
  },
  {
    id: 'sc-02',
    module: 'SAP MM/FI - 3-WAY MATCHING (VERIFICAÇÃO DE FATURA)',
    title: 'Discrepância de Preço no XML da Nota Fiscal de Entrada',
    plantLocation: 'Unidade Agroindustrial Masterboi - Canhotinho / PE',
    desc: 'A carga de matéria-prima foi confirmada na MIGO para 5.000 kg. Agora a equipe fiscal recebeu o arquivo XML da NF-e para lançamento. No Pedido de Compras o valor negociado foi R$ 20,00/kg (Total: R$ 100.000,00). Porém, o fornecedor emitiu a NF-e cobrando R$ 25,00/kg (Total: R$ 125.000,00).<br/><br/>Onde o QA deve homologar a entrada da fatura e qual o comportamento esperado do SAP?',
    difficulty: 'Intermediário',
    xpReward: 140,
    recommendedTCode: 'MIRO',
    sapDocSample: {
      type: 'MIRO',
      title: 'Transação MIRO - 3-Way Match Audit (PO x MIGO x NF)',
      fields: {
        'Valor no Pedido (EKPO)': 'R$ 20,00 / KG (R$ 100.000,00)',
        'Valor da NF-e Recebida': 'R$ 25,00 / KG (R$ 125.000,00)',
        'Divergência de Preço': '+ R$ 25.000,00 (+25%)',
        'Chave de Bloqueio': 'Bloqueio R (Desvio de Preço)',
        'Tolerância Permitida': 'Max R$ 50,00 ou 1%'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) Transação MIRO | O SAP deve bloquear a fatura para pagamento por desvio de preço.',
        correct: true,
        note: 'Perfeito! Na MIRO o SAP executa o 3-Way Match (Pedido x Entrada MIGO x Fatura). Se o preço divergir além da tolerância, a fatura recebe a Chave de Bloqueio R (Price Variance)!',
        technicalDetail: 'Como QA, verifique na tabela RBKP o campo ZLSPR ou RBSTAT = 2. O contas a pagar (F-53) fica impedido de liberar a TED até aprovação gerencial.'
      },
      {
        id: 'opt-b',
        text: 'B) Transação MIGO | O SAP recalcula o estoque físico e absorve o prejuízo automaticamente.',
        correct: false,
        note: 'A MIGO não lança faturas comerciais nem escritura valores fiscais, apenas movimenta estoques físicos.'
      },
      {
        id: 'opt-c',
        text: 'C) Transação F-53 | O SAP efetua o pagamento antecipado com aplicação de juros de mora.',
        correct: false,
        note: 'F-53 é o pagamento manual de contas a pagar e jamais deve pagar uma fatura divergente sem aprovação prévia.'
      },
      {
        id: 'opt-d',
        text: 'D) Transação VF01 | A fatura é cancelada e os dados excluídos da SE16N.',
        correct: false,
        note: 'VF01 é criação de fatura de saída em SD (para clientes da Masterboi), e nunca remove dados diretamente do banco.'
      }
    ]
  },
  {
    id: 'sc-03',
    module: 'SAP FI - AUDITORIA DE TABELAS CONTÁBEIS',
    title: 'Inspeção de Lançamentos a Débito e Crédito na SE16N',
    plantLocation: 'Controladoria & Finanças Corporativas - Recife / PE',
    desc: 'Um pagamento milionário de fornecedor de insumos foi efetuado no fluxo P2P. O Product Owner solicitou que o QA valide se os lançamentos de Crédito (Fornecedores) e Débito (Contas Transitórias / Estoque) no razão contábil foram gravados com integridade no banco de dados.<br/><br/>Quais são as duas tabelas clássicas de Finanças (FI) que você deve auditar na transação SE16N?',
    difficulty: 'Intermediário',
    xpReward: 150,
    recommendedTCode: 'SE16N',
    sapDocSample: {
      type: 'SE16N',
      title: 'Dicionário ABAP - Estrutura de Documentos Contábeis',
      fields: {
        'Tabela Cabeçalho': 'BKPF (BELNR, BUKRS, GJAHR, BLART, BUDAT)',
        'Tabela Itens / Partidas': 'BSEG (BELNR, BUZEI, KOART, SHKZG, WRBTR)',
        'Empresa (BUKRS)': 'MB01 (Masterboi Alimentos S.A.)',
        'Partidas Dobradas': 'Soma Débito = Soma Crédito (Balanço = 0)'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) KNA1 e LFA1 (Mestres de Clientes e Fornecedores)',
        correct: false,
        note: 'KNA1 e LFA1 guardam dados cadastrais (CNPJ, endereço, banco), não os lançamentos contábeis das partidas dobradas.'
      },
      {
        id: 'opt-b',
        text: 'B) VBAK e VBAP (Ordens de Venda do Módulo SD)',
        correct: false,
        note: 'Tabelas iniciadas com "V" referem-se ao módulo de Vendas (SD).'
      },
      {
        id: 'opt-c',
        text: 'C) BKPF (Cabeçalho do Documento) e BSEG (Itens / Partidas do Documento)',
        correct: true,
        note: 'Excelente! BKPF armazena número do documento, data contábil e empresa, enquanto a BSEG detalha cada conta, centro de custo e valores a débito (S) e crédito (H).',
        technicalDetail: 'Dica de QA sênior: no SAP S/4HANA os dados também são consolidados na ACDOCA (Universal Journal), mantendo compatibilidade com BKPF/BSEG.'
      },
      {
        id: 'opt-d',
        text: 'D) MARA e MARC (Dados de Materiais do Centro)',
        correct: false,
        note: 'MARA e MARC guardam o cadastro mestre do material (ex: corte bovino, peso líquido, tipo de carne).'
      }
    ]
  },
  {
    id: 'sc-04',
    module: 'SAP SD - ORDER TO CASH (DISTRIBUIÇÃO & EXPORTAÇÃO)',
    title: 'Sequência Ponta a Ponta de Vendas de Picanha Masterboi',
    plantLocation: 'Centro de Distribuição & Logística - Jaboatão dos Guararapes / PE',
    desc: 'Uma grande rede de supermercados comprou 3 toneladas de cortes nobres (picanha a vácuo) da Masterboi. O fluxo Order-to-Cash (O2C) foi iniciado. Como analista de testes, você deve validar o encadeamento das transações até a saída da carga frigorífica.<br/><br/>Qual é a sequência lógica padrão do fluxo SD até a emissão da NF-e e Fatura?',
    difficulty: 'Intermediário',
    xpReward: 160,
    recommendedTCode: 'VA01',
    sapDocSample: {
      type: 'VA01',
      title: 'Fluxo de Documentos SD (Order-to-Cash)',
      fields: {
        'Passo 1': 'Ordem de Venda Tipo OR (VA01)',
        'Passo 2': 'Fornecimento / Expedição Tipo LF (VL01N)',
        'Passo 3': 'Picking de Lotes e PGI / Saída de Mercadorias (VL02N)',
        'Passo 4': 'Faturamento / Emissão de NF-e (VF01)'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) MIGO (Entrada) ➔ MIRO (Fatura) ➔ ME21N (Pedido)',
        correct: false,
        note: 'Essa ordem está incorreta e pertence ao fluxo de compras (P2P), não à venda de carne para clientes!'
      },
      {
        id: 'opt-b',
        text: 'B) VA01 (Ordem de Venda) ➔ VL01N (Remessa / Picking) ➔ VF01 (Faturamento / Nota Fiscal)',
        correct: true,
        note: 'Show de bola! Esse é o clássico ciclo O2C: Cria o pedido (VA01), expede e carrega o caminhão refrigerado (VL01N) e fatura para o cliente (VF01).',
        technicalDetail: 'No teste de QA, confirme se a remessa VL01N não permite faturamento (VF01) antes da confirmação da baixa contábil de saída (PGI - Post Goods Issue).'
      },
      {
        id: 'opt-c',
        text: 'C) VF01 (Fatura) ➔ VA01 (Ordem) ➔ F-53 (Pagamento)',
        correct: false,
        note: 'Impossível faturar antes de ter uma ordem de venda criada e mercadoria separada.'
      },
      {
        id: 'opt-d',
        text: 'D) ME23N (Exibir Pedido) ➔ SE16N (Banco) ➔ MIGO (Entrada)',
        correct: false,
        note: 'Essa sequência é de consulta de compras e não representa a venda para clientes.'
      }
    ]
  },
  {
    id: 'sc-05',
    module: 'SAP QM / PP - CONTROLE DE QUALIDADE & RASTREABILIDADE SIF',
    title: 'Bloqueio de Lote com Desvio Térmico no Abate',
    plantLocation: 'Frigorífico Masterboi - Nova Veneza / GO',
    desc: 'Durante a desossa, os sensores da câmara fria registraram temperatura de 11°C (o limite sanitário do Serviço de Inspeção Federal - SIF é de até 4°C para carnes resfriadas). O lote de contrafilé LOT-MB-2026-99 foi marcado como suspeito.<br/><br/>Qual transação o auditor de QA utiliza para gerenciar o Lote de Inspeção e qual a Decisão de Emprego (UD) necessária para impedir a venda?',
    difficulty: 'Avançado',
    xpReward: 180,
    recommendedTCode: 'QA32',
    sapDocSample: {
      type: 'QA32',
      title: 'Transação QA32 / QA11 - Decisão de Emprego QM',
      fields: {
        'Lote de Inspeção': '04000049281',
        'Material': 'CARNE BOVINA CONTRAFILE RESFRIADO',
        'Parâmetro Crítico': 'Temperatura da Câmara Fria (Aferido: 11°C | Max: 4°C)',
        'SIF Fiscalização': 'SIF Masterboi 4512 - Inspeção Federal',
        'Decisão Esperada': 'Rejeição / Bloqueio para Sucata ou Graxaria'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) Transação QA32 (ou QA11) | Tomar Decisão de Emprego "Rejeitado" transferindo o lote para estoque bloqueado.',
        correct: true,
        note: 'Sensacional! Na QA32/QA11 a Decisão de Emprego (Usage Decision) com código "REJEITADO" move o material para estoque bloqueado (Block Stock), impedindo qualquer faturamento ou saída!',
        technicalDetail: 'O SAP executa o movimento de mercadorias 350 (de controle de qualidade para bloqueado). Na tabela MCH1 o lote fica com status restrito.'
      },
      {
        id: 'opt-b',
        text: 'B) Transação MM02 | Apenas alterar o nome do lote para "Carne Normal" e liberar o frete.',
        correct: false,
        note: 'Gravíssimo! Isso violaria as regras do Ministério da Agricultura / SIF e causaria interdição sanitária da planta.'
      },
      {
        id: 'opt-c',
        text: 'C) Transação ME21N | Gerar um novo pedido de compras para substituir a carne estragada.',
        correct: false,
        note: 'ME21N é para comprar insumos e não atua sobre a auditoria do lote sanitário já produzido.'
      },
      {
        id: 'opt-d',
        text: 'D) Transação SU01 | Excluir o usuário do veterinário responsável pelo laudo.',
        correct: false,
        note: 'SU01 é manutenção de usuários e permissões do SAP, nada a ver com controle sanitário!'
      }
    ]
  },
  {
    id: 'sc-06',
    module: 'SAP BASIS / SECURITY - GESTÃO DE ACESSOS E GO-LIVE',
    title: 'Prevenção de Falhas Críticas antes do Go-Live em Produção',
    plantLocation: 'TI Corporativa & Release Management - Masterboi HQ',
    desc: 'Faltam 48 horas para a virada de versão do SAP na Masterboi. Durante o teste de segurança, você detectou que os operadores da balança rodoviária receberam perfil com acesso à transação de modificação direta de tabelas com privilégios de &SAP_EDIT e transações de contabilidade financeira.<br/><br/>Qual objeto de autorização / transação o QA de Segurança deve auditar para assegurar a segregação de funções (SoD)?',
    difficulty: 'Avançado',
    xpReward: 200,
    recommendedTCode: 'SE16N',
    sapDocSample: {
      type: 'SE16N',
      title: 'Transação SU53 / PFCG - Auditoria de Perfis e SoD',
      fields: {
        'Risco Detectado': 'SoD Crítico: Operador de Balança com &SAP_EDIT e FB01',
        'Objeto de Autorização': 'S_TABU_DIS (Grupo de Tabelas)',
        'Atividade Crítica': '02 (Modificar) / 03 (Exibir)',
        'Transação de Perfis': 'PFCG (Role Maintenance)'
      }
    },
    options: [
      {
        id: 'opt-a',
        text: 'A) Transação PFCG e auditoria do objeto S_TABU_DIS | Revogar acesso de modificação e restringir apenas à MIGO.',
        correct: true,
        note: 'Excelente! A transação PFCG gerencia perfis de acesso (Roles). O objeto S_TABU_DIS controla a manutenção direta de tabelas e jamais deve ser liberado para operação de chão de fábrica!',
        technicalDetail: 'Como QA, simule o teste com o usuário do operador e execute /nSE16N. O sistema deve retornar o erro de autorização visualizado na SU53.'
      },
      {
        id: 'opt-b',
        text: 'B) Transação SM12 | Liberar todos os bloqueios de tabelas para que qualquer um possa editar.',
        correct: false,
        note: 'SM12 apenas monitora e remove locks de banco de dados e não configura perfis nem segregação de funções.'
      },
      {
        id: 'opt-c',
        text: 'C) Transação STMS | Importar todas as ordens de transporte diretamente sem testar em QAS.',
        correct: false,
        note: 'Desastre garantido! Transportar direto sem homologação em QAS quebra a integridade produtiva.'
      },
      {
        id: 'opt-d',
        text: 'D) Transação SP01 | Limpar os logs de impressão da fábrica.',
        correct: false,
        note: 'SP01 é o spool de impressão (ordens de impressão de etiquetas e romaneios).'
      }
    ]
  }
];
