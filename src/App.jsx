import { useState, useMemo } from 'react';
import { calculate } from './calculations.js';
import InputPanel from './components/InputPanel.jsx';
import GroupA from './components/GroupA.jsx';
import GroupB from './components/GroupB.jsx';
import GroupC from './components/GroupC.jsx';

export const DEFAULTS = {
  staffedORs: 10,
  operatingDays: 250,
  annualCases: 3500,
  scheduledCases: null,
  cancellationRate: 7.9,
  cancellationScenario: 'conservative',
  avgCaseDuration: 90,
  nursingFTEs: 40,
  avgNurseReplacementCost: 52000,
  costPerMinute: 66,
  revenuePerCase: 3200,
  currentFCOTS: 64,
  fcotsScenario: 'A',
  avgFCOTSDelayMin: 12,
  totScenario: 'A',
  currentTOT: 85,
  currentBlockUtil: 70,
  blockUtilTarget: 75,
  blockHoursPerDay: 8,
  currentPrimeTimeUtil: 65,
  primeTimeUtilTarget: 80,
  primeTimeHoursPerDay: 10,
  backfillRate: 15,
  weeklyReportingHours: 5,
  reportingHourlyCost: 45,
  burnoutReductionPct: 15,
  contractLength: 3,
  benefitRetention: 80,
  implementationCost: 50000,
  complianceDocPerCase: 15,
  insightsPerOR: 7500,
  orDashboardPerOR: 4500,
  dayOfBoardsPerOR: 3000,
};

const TABS = [
  { id: 'A', label: 'Operational Impact' },
  { id: 'B', label: 'Financial Impact' },
  { id: 'C', label: 'Admin Efficiency' },
];

export default function App() {
  const [draft, setDraft] = useState(DEFAULTS);
  const [committed, setCommitted] = useState(DEFAULTS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('A');

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed);

  const results = useMemo(() => calculate(committed), [committed]);
  const validTab = TABS.find((t) => t.id === activeTab) ? activeTab : TABS[0].id;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col" style={{ minWidth: 320 }}>

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle inputs"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <img
              src="https://insights-roi-generator.vercel.app/assets/LiveData-logo-krU7lg0-.png"
              alt="LiveData"
              className="h-8 w-auto object-contain"
            />
            <div className="hidden sm:block text-[10px] text-gray-400 border-l border-gray-200 pl-3 leading-tight">
              OR Benefit<br />Analysis
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { setDraft(DEFAULTS); setCommitted(DEFAULTS); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors hidden sm:block"
        >
          Reset
        </button>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left Sidebar ── */}
        <aside
          className={`
            flex-shrink-0 bg-white border-r border-gray-200
            overflow-y-auto sidebar-scroll
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'w-80 min-w-80' : 'w-0 min-w-0 overflow-hidden'}
            lg:w-80 lg:min-w-80 lg:overflow-y-auto
          `}
        >
          <div className="p-4 min-w-80">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3">
              Configure Inputs
            </div>
            <InputPanel inputs={draft} onChange={setDraft} />
          </div>
          <div className="sticky bottom-0 px-3 pb-3 bg-white min-w-80">
            <button
              type="button"
              onClick={() => setCommitted(draft)}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 ${
                isDirty
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-400 cursor-default'
              }`}
            >
              {isDirty && (
                <span className="w-2 h-2 rounded-full bg-white opacity-80 flex-shrink-0" />
              )}
              {isDirty ? 'Calculate Results' : 'Results Up to Date'}
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">

            {/* Tabs */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    validTab === tab.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">Group {tab.id}</span>
                </button>
              ))}
            </div>

            <div>
              {validTab === 'A' && <GroupA results={results} inputs={committed} onScenarioChange={(key, val) => { setDraft(d => ({ ...d, [key]: val })); setCommitted(c => ({ ...c, [key]: val })); }} />}
              {validTab === 'B' && <GroupB results={results} inputs={committed} />}
              {validTab === 'C' && <GroupC results={results} inputs={committed} />}
            </div>

            <footer className="pt-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Benefit projections are based on peer-reviewed research and industry benchmarks. Results vary by institution.
                This tool is intended for illustrative purposes in sales conversations.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
