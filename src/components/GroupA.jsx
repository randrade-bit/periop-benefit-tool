import { fmtPct, fmtNum, fmtMin, fmt$, ProgressBar } from './ui.jsx';

export default function GroupA({ results, inputs, onScenarioChange }) {
  const {
    fcotsScenario,
    FCOTSImprovementPP,
    projectedFCOTS,
    FCOTSAdditionalCasesPerYear,
    totScenario,
    TOTReductionMin,
    projectedTOT,
    effectiveScheduledCases,
    cancellationScenario,
    addressableShare,
    avoidableCancellations,
    blockUtilTarget,
    blockUtilGap,
    projectedBlockUtil,
    primeTimeUtilTarget,
    primeTimeUtilGap,
    projectedPrimeTimeUtil,
    computedCancellationRate,
    projectedCancellationRate,
    primeTimeCasesRecovered,
    totalAdditionalCases,
    FCOTSMinutesRecoveredPerYear,
    TOTMinutesRecoveredPerYear,
    totalMinutesRecoveredPerYear,
  } = results;

  const { currentFCOTS, currentTOT, currentBlockUtil, currentPrimeTimeUtil } = inputs;
  const cancDelta = computedCancellationRate - projectedCancellationRate;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Operational Impact</h2>
          <p className="text-sm text-gray-500 mt-0.5">Projected improvements to OR efficiency, throughput, and quality metrics</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricSummaryCard label="FCOTS" before={fmtPct(inputs.currentFCOTS)} after={fmtPct(projectedFCOTS)} />
          <MetricSummaryCard label="Turnover Time" before={fmtMin(inputs.currentTOT)} after={fmtMin(projectedTOT)} />
          <MetricSummaryCard label="Cancellations" before={fmtPct(computedCancellationRate)} after={fmtPct(projectedCancellationRate)} />
          <MetricSummaryCard label="Block Util" before={fmtPct(inputs.currentBlockUtil)} after={fmtPct(projectedBlockUtil)} />
          <MetricSummaryCard label="Prime Time Util" before={fmtPct(currentPrimeTimeUtil)} after={fmtPct(projectedPrimeTimeUtil)} />
        </div>
      </div>

      {/* FCOTS + TOT side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FCOTS card with scenario toggle */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">First Case On-Time Start (FCOTS)</div>
          </div>
          {/* Scenario toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              type="button"
              onClick={() => onScenarioChange('fcotsScenario', 'A')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${fcotsScenario === 'A' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Conservative
            </button>
            <button
              type="button"
              onClick={() => onScenarioChange('fcotsScenario', 'B')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${fcotsScenario === 'B' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Optimistic
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 font-medium mb-1">Current</div>
              <div className="text-3xl font-black text-gray-500 tabular-nums">{fmtPct(currentFCOTS)}</div>
            </div>
            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs text-red-400 font-medium mb-1">Projected</div>
              <div className="text-3xl font-black text-red-600 tabular-nums">{fmtPct(projectedFCOTS)}</div>
            </div>
          </div>
          <ProgressBar current={currentFCOTS} projected={projectedFCOTS} max={100} />
          <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <span className="text-sm font-bold text-green-600">
              +{FCOTSAdditionalCasesPerYear.toFixed(0)} additional on-time first cases/yr
            </span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            {fcotsScenario === 'A' ? (
              <>
                Conservative: Current {fmtPct(currentFCOTS)} + 10.7 pp = {fmtPct(projectedFCOTS)} · Based on{' '}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/34635421/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 underline"
                >
                  published QI literature
                </a>
                {' '}— structured pre-op workflows produce an average 10.7 percentage point improvement in FCOTS rates.
              </>
            ) : (
              `Optimistic: Target 90% · Based on high-performance OR benchmarks — top-performing facilities consistently achieve ≥90% FCOTS.`
            )}
          </div>
        </div>
        {/* TOT card with scenario toggle */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="mb-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg Turnover Time (TOT)</div>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
            <button
              type="button"
              onClick={() => onScenarioChange('totScenario', 'A')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${totScenario === 'A' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Conservative
            </button>
            <button
              type="button"
              onClick={() => onScenarioChange('totScenario', 'B')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${totScenario === 'B' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Optimistic
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 font-medium mb-1">Current</div>
              <div className="text-3xl font-black text-gray-500 tabular-nums">{fmtMin(currentTOT)}</div>
            </div>
            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs text-red-400 font-medium mb-1">Projected</div>
              <div className="text-3xl font-black text-red-600 tabular-nums">{fmtMin(projectedTOT)}</div>
            </div>
          </div>
          <ProgressBar current={currentTOT} projected={projectedTOT} max={120} lowIsBetter />
          <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            <span className="text-sm font-bold text-green-600">
              −{TOTReductionMin.toFixed(1)} min median turnover reduction
            </span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            {totScenario === 'A' ? (
              <>
                Conservative: {fmtMin(currentTOT)} × (1 − 0.20) = {fmtMin(projectedTOT)} · Based on{' '}
                <a
                  href="https://www.surgjournal.com/article/S0039-6060%2826%2900045-0/fulltext"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 underline"
                >
                  published QI literature
                </a>
                {' '}— passive visibility and coordination tools (timing boards, structured handoffs) produce a 20% relative reduction in TOT.
              </>
            ) : (
              `Optimistic: Target 25 min · Based on high-performance OR benchmarks — top-performing facilities consistently achieve ≤25 min turnover times.`
            )}
          </div>
        </div>
      </div>

      {/* Block Utilization + Prime Time Utilization side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Block Utilization */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Block Utilization</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 font-medium mb-1">Current</div>
              <div className="text-3xl font-black text-gray-500 tabular-nums">{fmtPct(currentBlockUtil)}</div>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs text-red-400 font-medium mb-1">Projected</div>
              <div className="text-3xl font-black text-red-600 tabular-nums">{fmtPct(projectedBlockUtil)}</div>
            </div>
          </div>
          <ProgressBar current={currentBlockUtil} projected={projectedBlockUtil} max={100} />
          <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">Improvement toward target</span>
            <span className="text-sm font-bold text-green-600">+{blockUtilGap.toFixed(1)} pp</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            Current {fmtPct(currentBlockUtil)} + {blockUtilGap.toFixed(1)} pp = {fmtPct(projectedBlockUtil)} · Target range: 65–85% (
            <a
              href="https://www.cambridge.org/core/books/operating-room-leadership-and-perioperative-practice-management/7231BFD28E677DF7EB0E96BB9663E349"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 underline"
            >
              Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management
            </a>
            )
          </div>
        </div>

        {/* Prime Time Utilization */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4">Prime Time Utilization</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-400 font-medium mb-1">Current</div>
              <div className="text-3xl font-black text-gray-500 tabular-nums">{fmtPct(currentPrimeTimeUtil)}</div>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="text-xs text-red-400 font-medium mb-1">Projected</div>
              <div className="text-3xl font-black text-red-600 tabular-nums">{fmtPct(projectedPrimeTimeUtil)}</div>
            </div>
          </div>
          <ProgressBar current={currentPrimeTimeUtil} projected={projectedPrimeTimeUtil} max={100} />
          <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">Improvement toward target</span>
            <span className="text-sm font-bold text-green-600">+{primeTimeUtilGap.toFixed(1)} pp</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400">
            Current {fmtPct(currentPrimeTimeUtil)} + {primeTimeUtilGap.toFixed(1)} pp = {fmtPct(projectedPrimeTimeUtil)} · Target range: 75–85% (default 80% midpoint) (
            <a
              href="https://www.cambridge.org/core/books/operating-room-leadership-and-perioperative-practice-management/7231BFD28E677DF7EB0E96BB9663E349"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 underline"
            >
              Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management
            </a>
            )
          </div>
        </div>
      </div>

      {/* Cancellations */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Cancellation Reduction</div>
        {/* Scenario toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => onScenarioChange('cancellationScenario', 'conservative')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${cancellationScenario === 'conservative' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Conservative
          </button>
          <button
            type="button"
            onClick={() => onScenarioChange('cancellationScenario', 'optimistic')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${cancellationScenario === 'optimistic' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Optimistic
          </button>
        </div>
        {/* Current vs projected */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 font-medium mb-1">Current rate</div>
            <div className="text-2xl font-black text-gray-500 tabular-nums">{fmtPct(computedCancellationRate)}</div>
            <div className="text-xs text-gray-400 mt-1">{fmtNum(results.annualCancellationsTotal)} cancellations/yr</div>
          </div>
          <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="text-xs text-red-400 font-medium mb-1">Projected rate</div>
            <div className="text-2xl font-black text-red-600 tabular-nums">{fmtPct(projectedCancellationRate)}</div>
            <div className="text-xs text-gray-400 mt-1">−{fmtPct(cancDelta, 1)} pts</div>
          </div>
        </div>
        <ProgressBar current={computedCancellationRate} projected={projectedCancellationRate} max={20} lowIsBetter />
        {/* Green result block */}
        <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          <span className="text-sm font-bold text-green-600">+{fmtNum(avoidableCancellations)} cases recovered/yr</span>
        </div>
        <div className="mt-2 text-[10px] text-gray-400">
          {cancellationScenario === 'conservative' ? (
            <>
              Conservative: {fmtNum(inputs.annualCases)} cases × {fmtPct(inputs.cancellationRate, 1)} = {fmtNum(results.annualCancellationsTotal)} cancelled · {fmtNum(results.annualCancellationsTotal)} × 20.2% = {fmtNum(avoidableCancellations)} cases we could act on · Based on{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3839960/#F1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 underline"
              >
                Xue et al. (2013)
              </a>
              {' '}— scheduling issues accounted for 20.2% of OR cancellations. We estimate LiveData directly addresses this share through real-time schedule visibility.
            </>
          ) : (
            <>
              Optimistic: {fmtNum(inputs.annualCases)} cases × {fmtPct(inputs.cancellationRate, 1)} = {fmtNum(results.annualCancellationsTotal)} cancelled · {fmtNum(results.annualCancellationsTotal)} × 59.2% = {fmtNum(avoidableCancellations)} cases we could act on · Based on{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3839960/#F1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 underline"
              >
                Xue et al. (2013)
              </a>
              {' '}— most (59.2 ± 8.9%) of cancellations were considered preventable by the study authors.
            </>
          )}
        </div>
      </div>

      {/* Operational Impact Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Operational Impact Summary</div>
        <div className="space-y-3">

          {/* Idle OR minutes recovered */}
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold text-gray-700">Idle OR Minutes Recovered</div>
              <div className="text-lg font-black text-red-600 tabular-nums">{Math.round(totalMinutesRecoveredPerYear).toLocaleString()} min/yr</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">FCOTS (start-of-day)</div>
                <div className="text-sm font-bold text-gray-700 tabular-nums">{Math.round(FCOTSMinutesRecoveredPerYear).toLocaleString()} min/yr</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{FCOTSAdditionalCasesPerYear.toFixed(0)} additional on-time starts × {inputs.avgFCOTSDelayMin} min/delay</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">TOT (between cases)</div>
                <div className="text-sm font-bold text-gray-700 tabular-nums">{Math.round(TOTMinutesRecoveredPerYear).toLocaleString()} min/yr</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{TOTReductionMin.toFixed(1)} min/turnover × turnovers per year</div>
              </div>
            </div>
          </div>

          {/* Increase in case volume */}
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold text-gray-700">Increase in Case Volume</div>
              <div className="text-lg font-black text-red-600 tabular-nums">+{totalAdditionalCases.toLocaleString()} cases/yr</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">Cancellation Recovery</div>
                <div className="text-sm font-bold text-gray-700 tabular-nums">+{avoidableCancellations.toLocaleString()} cases</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Avoidable cancellations prevented</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">Block Utilization</div>
                <div className="text-sm font-bold text-gray-700 tabular-nums">+{primeTimeCasesRecovered.toLocaleString()} cases</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Recoverable block min ÷ ({inputs.avgCaseDuration} min case + {inputs.currentTOT} min TOT) × backfill rate</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

function MetricSummaryCard({ label, before, after }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 tabular-nums flex-wrap justify-center">
        <span className="text-base font-black text-gray-400">{before}</span>
        <span className="text-xs text-gray-300 font-medium">→</span>
        <span className="text-base font-black text-red-600">{after}</span>
      </div>
      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide text-center">{label}</div>
    </div>
  );
}

function BeforeAfterCard({ label, benchmark, current, projected, max, lowIsBetter = false, currentLabel, projectedLabel, deltaLabel, source }) {
  const improvement = lowIsBetter ? current - projected : projected - current;
  const isPositive = improvement > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
        <div className="text-[11px] text-red-400 font-medium mt-0.5">Target: {benchmark}</div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-xs text-gray-400 font-medium mb-1">Current</div>
          <div className="text-3xl font-black text-gray-500 tabular-nums">{currentLabel}</div>
        </div>
        <div className="flex-shrink-0">
          <svg className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <div className="flex-1 bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="text-xs text-red-400 font-medium mb-1">Projected</div>
          <div className="text-3xl font-black text-red-600 tabular-nums">{projectedLabel}</div>
        </div>
      </div>
      <ProgressBar current={current} projected={projected} max={max} lowIsBetter={lowIsBetter} />
      <div className="mt-3 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
        <span className="text-sm font-bold text-green-600">{deltaLabel}</span>
      </div>
      {source && <div className="mt-2 text-[10px] text-gray-400">{source}</div>}
    </div>
  );
}
