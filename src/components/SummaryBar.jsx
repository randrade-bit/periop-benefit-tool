import { fmt$, fmtPct, fmtNum } from './ui.jsx';

export default function SummaryBar({ results, inputs }) {
  const {
    totalAnnualBenefit,
    totalContractBenefit,
    totalContractCost,
    roiMultiple,
    roiPct,
    projectedFCOTS,
    projectedTOT,
    avoidableCancellations,
    computedCancellationRate,
    projectedCancellationRate,
  } = results;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Headline numbers */}
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Total Annual Benefit</div>
          <div className="text-4xl font-black text-green-600 tabular-nums tracking-tight">
            {fmt$(totalAnnualBenefit)}
          </div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-gray-100" />
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">
            {inputs.contractLength}-Year Contract Value
          </div>
          <div className="text-2xl font-bold text-red-600 tabular-nums">
            {fmt$(totalContractBenefit)}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">at {inputs.benefitRetention}% benefit retention</div>
        </div>
        <div className="hidden sm:block w-px h-12 bg-gray-100" />
        {totalContractCost > 0 && roiMultiple !== null ? (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">ROI</div>
            <div className="text-2xl font-bold text-gray-800 tabular-nums">
              {roiMultiple.toFixed(1)}×
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {roiPct !== null ? `${roiPct >= 0 ? '+' : ''}${Math.round(roiPct)}% net return` : ''}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Contract Cost</div>
            <div className="text-sm text-gray-400 italic">Enter platform pricing</div>
            <div className="text-xs text-gray-400 mt-0.5">to calculate ROI</div>
          </div>
        )}
      </div>

      {/* Operational badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          icon="⏰"
          label="FCOTS"
          before={fmtPct(inputs.currentFCOTS)}
          after={fmtPct(projectedFCOTS)}
        />
        <Badge
          icon="🔄"
          label="Turnover Time"
          before={`${fmtNum(inputs.currentTOT)} min`}
          after={`${fmtNum(projectedTOT)} min`}
        />
        <Badge
          icon="🚫"
          label="Cancellations"
          before={fmtPct(computedCancellationRate)}
          after={fmtPct(projectedCancellationRate)}
        />
      </div>

      <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
        All projections based on published academic and industry research. Hospital-specific results will vary.
      </p>
    </div>
  );
}

function Badge({ icon, label, before, after }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-xs text-gray-500 font-medium">{label}:</span>
      <span className="text-xs text-gray-400 tabular-nums">{before}</span>
      <span className="text-xs text-gray-400">→</span>
      <span className="text-xs text-red-600 font-semibold tabular-nums">{after}</span>
    </div>
  );
}
