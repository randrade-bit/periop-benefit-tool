import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { fmt$, FinanceRow } from './ui.jsx';

const COLORS = {
  'Time Recovery Cost Savings': '#dc2626',
  'FCOTS Case Revenue': '#ef4444',
  'TOT Additional Case Revenue': '#f87171',
  'Cancellation Revenue Recovery': '#f97316',
  'Surgical Supply Savings': '#9ca3af',
  'Administrative Efficiency': '#6b7280',
  'Block Utilization Revenue': '#b45309',
  'Staff Retention Savings': '#b91c1c',
  'Compliance Documentation': '#d1d5db',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl text-sm">
        <p className="text-gray-200 font-medium">{payload[0].payload.name}</p>
        <p className="text-green-400 font-bold">{fmt$(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function GroupB({ results, inputs }) {
  const {
    timeSavingsCostValue,
    cancellationRevenue,
    annualReportingCostSaved,
    primeTimeRevenue,
    complianceDocAnnualValue,
    totalAnnualBenefit,
    totalContractBenefit,
    totalContractCost,
    roiMultiple,
    roiPct,
    annualPlatformCost,
    totalMinutesRecoveredPerYear,
    performedCases,
  } = results;

  const breakdown = [
    {
      name: 'Cancellation Revenue Recovery',
      value: cancellationRevenue,
      desc: '49.6% addressable share (UPenn) × 60% prevention rate × revenue/case.',
    },
    {
      name: 'Administrative Efficiency',
      value: annualReportingCostSaved,
      desc: 'Scheduling task time saved via digitalization.',
    },
    {
      name: 'Block Utilization Revenue',
      value: primeTimeRevenue,
      desc: 'Additional cases from prime time utilization improvement × net revenue/case.',
    },
  ].filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const chartData = breakdown.map((d) => ({ name: d.name, value: Math.round(d.value) }));
  const chartHeight = Math.max(280, breakdown.length * 52);

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Financial Impact</h2>
          <p className="text-sm text-gray-500 mt-0.5">Annual dollar value by benefit category</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Total Annual Benefit</div>
            <div className="text-4xl font-black text-green-600 tabular-nums tracking-tight">{fmt$(totalAnnualBenefit)}</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-100" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">{inputs.contractLength}-Year Contract Value</div>
            <div className="text-2xl font-bold text-red-600 tabular-nums">{fmt$(totalContractBenefit)}</div>
            <div className="text-xs text-gray-400 mt-0.5">at {inputs.benefitRetention}% benefit retention</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-100" />
          {totalContractCost > 0 && roiMultiple !== null ? (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">ROI</div>
              <div className="text-2xl font-bold text-gray-800 tabular-nums">{roiMultiple.toFixed(1)}×</div>
              <div className="text-xs text-gray-400 mt-0.5">{roiPct !== null ? `${roiPct >= 0 ? '+' : ''}${Math.round(roiPct)}% net return` : ''}</div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Contract Cost</div>
              <div className="text-sm text-gray-400 italic">Enter platform pricing</div>
              <div className="text-xs text-gray-400 mt-0.5">to calculate ROI</div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
          Annual Benefit Breakdown
        </div>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            barCategoryGap="35%"
            margin={{ top: 4, right: 110, bottom: 4, left: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={190}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={22}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || '#dc2626'} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => fmt$(v)}
                style={{ fill: '#374151', fontSize: 11, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Time savings note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <div className="text-xs font-semibold text-amber-700 mb-1">Idle OR Minutes Recovered</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          {`${Math.round(totalMinutesRecoveredPerYear).toLocaleString()} min/yr recovered from FCOTS + TOT improvements.`}
          {' '}OR time savings value (monetary value of unused prime time, not actual cost savings): {fmt$(timeSavingsCostValue)}.
        </p>
      </div>

      {/* Compliance documentation — additional value, not in total */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <div className="text-xs font-semibold text-amber-700 mb-1">Additional Unquantified Value — Compliance Documentation</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          ${inputs.complianceDocPerCase}/case × {performedCases.toLocaleString()} cases = <strong>{fmt$(complianceDocAnnualValue)}/yr</strong>.
          Shown separately — not included in the financial total above.
        </p>
      </div>

      {/* Detail rows */}
      <div className="space-y-2">
        {breakdown.map((item) => (
          <div key={item.name}>
            <FinanceRow label={item.name} value={item.value} />
            <div className="text-[10px] text-gray-400 px-3 pb-0.5">{item.desc}</div>
          </div>
        ))}
        <div className="pt-2 space-y-2">
          <FinanceRow label="Total Annual Benefit" value={totalAnnualBenefit} highlight />
          <FinanceRow
            label={`${inputs.contractLength}-Year Contract Benefit (${inputs.benefitRetention}% retention)`}
            value={totalContractBenefit}
            highlight
          />
        </div>
      </div>

      {/* ROI block */}
      {totalContractCost > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">ROI Analysis</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Implementation Cost" value={fmt$(inputs.implementationCost)} />
            <Stat label="Annual Platform Cost" value={fmt$(annualPlatformCost)} sub={`${inputs.staffedORs} ORs`} />
            <Stat label="Total Contract Cost" value={fmt$(totalContractCost)} sub={`${inputs.contractLength} yrs`} />
            <Stat
              label="ROI Multiple"
              value={roiMultiple !== null ? `${roiMultiple.toFixed(1)}×` : '—'}
              sub={roiPct !== null ? `${roiPct >= 0 ? '+' : ''}${Math.round(roiPct)}% net return` : ''}
              highlight
            />
          </div>
        </div>
      )}

    </div>
  );
}

function Stat({ label, value, sub, highlight = false }) {
  return (
    <div className={`border rounded-lg p-3 shadow-sm ${highlight ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
      <div className="text-xs text-gray-400 mb-1 font-medium">{label}</div>
      <div className={`text-lg font-bold ${highlight ? 'text-red-600' : 'text-red-600'}`}>{value}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
