import { CollapsibleSection, NumberInput, Tooltip } from './ui.jsx';

export default function InputPanel({ inputs, onChange }) {
  const set = (key) => (val) => onChange({ ...inputs, [key]: val });

  return (
    <div className="space-y-3">

      {/* ── Group 1: Hospital Profile ── */}
      <CollapsibleSection title="1 — Hospital Profile" defaultOpen>
        <NumberInput
          label="Staffed ORs"
          value={inputs.staffedORs}
          onChange={set('staffedORs')}
          min={1} max={100}
          tooltip="Total number of operating rooms staffed and actively scheduling cases. Default of 10 is a common mid-size community hospital configuration."
        />
        <NumberInput
          label="OR Operating Days / Year"
          value={inputs.operatingDays}
          onChange={set('operatingDays')}
          min={50} max={365}
          tooltip="Number of days per year the ORs operate. Default 250 assumes a 5-day schedule with holidays excluded."
        />
        <NumberInput
          label="Annual Cases Performed"
          value={inputs.annualCases}
          onChange={set('annualCases')}
          min={100} max={50000}
          tooltip="Total surgical cases actually performed annually. This is the primary volume input used throughout all calculations."
        />

      </CollapsibleSection>

      {/* ── Group 2: Financial Baseline ── */}
      <CollapsibleSection title="2 — Financial Baseline" defaultOpen>
        <NumberInput
          label="OR Cost / Minute"
          value={inputs.costPerMinute}
          onChange={set('costPerMinute')}
          min={10} max={500}
          prefix="$"
          tooltip="All-in cost per minute of OR time. Default $62 is based on Girotto et al., International Journal of Surgery. Used to value recovered OR minutes."
        />
        <NumberInput
          label="Net Revenue / Case"
          value={inputs.revenuePerCase}
          onChange={set('revenuePerCase')}
          min={100} max={50000}
          prefix="$"
          tooltip="Average net revenue (after payer mix adjustments) per surgical case. Default $3,200 is a conservative proxy based on ASC industry data."
        />
      </CollapsibleSection>

      {/* ── Group 3: Current Performance ── */}
      <CollapsibleSection title="3 — Current Performance" defaultOpen>
        <NumberInput
          label="First Case On-Time Start (FCOTS) %"
          value={inputs.currentFCOTS}
          onChange={set('currentFCOTS')}
          min={0} max={100}
          suffix="%"
          tooltip="Percentage of first cases that begin on time. National median is ~64%; the published target benchmark is 88.3%. Enter your hospital's current rate."
        />
        <NumberInput
          label="Avg FCOTS Delay (min)"
          value={inputs.avgFCOTSDelayMin ?? 12}
          onChange={set('avgFCOTSDelayMin')}
          min={1} max={60}
          suffix="min"
          tooltip="Average delay in minutes when a first case does not start on time. Default 12 min is the published benchmark median."
        />
        <NumberInput
          label="Median Turnover Time (min)"
          value={inputs.currentTOT}
          onChange={set('currentTOT')}
          min={5} max={180}
          suffix="min"
          tooltip="Median time between end of one case and start of the next. Published target is 25 min (Brown OR Metrics). National average is ~40–85 min by specialty."
        />
        <NumberInput
          label="Block Utilization %"
          value={inputs.currentBlockUtil}
          onChange={set('currentBlockUtil')}
          min={0} max={100}
          suffix="%"
          tooltip="Current percentage of assigned block time used. Block utilization improvement is derived from FCOTS and TOT time recovery as a proportion of total allocated block time."
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 flex items-center font-medium">
            Block utilization target (%)
            <Tooltip text="Target block utilization percentage. Benchmark range is 65–85% (Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management). Default 75%." />
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={65}
              max={85}
              step={1}
              value={inputs.blockUtilTarget ?? 75}
              onChange={(e) => set('blockUtilTarget')(Number(e.target.value))}
              className="flex-1 accent-red-600"
            />
            <span className="text-sm font-semibold text-red-600 w-10 text-right">
              {inputs.blockUtilTarget ?? 75}%
            </span>
          </div>
          <div className="text-[10px] text-gray-400">Range: 65–85% (Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management)</div>
        </div>
        <NumberInput
          label="Block Hours / Day"
          value={inputs.blockHoursPerDay}
          onChange={set('blockHoursPerDay')}
          min={1} max={24}
          suffix="hrs"
          tooltip="Number of hours per day allocated to block scheduling. Default 8 hrs."
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 flex items-center font-medium">
            Scheduled Cases / Year
            <span className="ml-1 text-[10px] text-gray-400 italic font-normal">(optional)</span>
            <Tooltip text="If you know your total scheduled cases (before cancellations), enter it here and it will be used for cancellation calculations. If left blank, it will be derived automatically from your annual cases performed and cancellation rate." />
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100 transition-all">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Auto-calculated"
              value={inputs.scheduledCases ?? ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') { set('scheduledCases')(null); return; }
                const n = parseInt(raw, 10);
                if (!isNaN(n)) set('scheduledCases')(n);
              }}
              className="flex-1 bg-transparent text-gray-800 text-sm px-2 py-1.5 outline-none min-w-[4rem]"
            />
          </div>
        </div>
        <NumberInput
          label="Prime Time Utilization %"
          value={inputs.currentPrimeTimeUtil}
          onChange={set('currentPrimeTimeUtil')}
          min={0} max={100}
          suffix="%"
          tooltip="Current percentage of prime OR time that is utilized. Benchmark range is 75–85% (default target 80%) (Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management)."
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 flex items-center font-medium">
            Prime time utilization target (%)
            <Tooltip text="Target prime time utilization percentage. Benchmark range is 75–85%; default 80% is the midpoint (Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management)." />
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={75}
              max={85}
              step={1}
              value={inputs.primeTimeUtilTarget ?? 80}
              onChange={(e) => set('primeTimeUtilTarget')(Number(e.target.value))}
              className="flex-1 accent-red-600"
            />
            <span className="text-sm font-semibold text-red-600 w-10 text-right">
              {inputs.primeTimeUtilTarget ?? 80}%
            </span>
          </div>
          <div className="text-[10px] text-gray-400">Range: 75–85% (Todd Brown, Ch.27. Operating Room Leadership and Perioperative Practice Management)</div>
        </div>
        <NumberInput
          label="Prime Time Hours / Day"
          value={inputs.primeTimeHoursPerDay}
          onChange={set('primeTimeHoursPerDay')}
          min={1} max={24}
          suffix="hrs"
          tooltip="Number of prime time OR hours available per day. Default 10 hrs."
        />
        <NumberInput
          label="Backfill Rate %"
          value={inputs.backfillRate}
          onChange={set('backfillRate')}
          min={0} max={100}
          suffix="%"
          tooltip="Share of released prime time (after accounting for turnover) that is actually backfilled with new cases. Default 15%."
        />
        <NumberInput
          label="Cancellation Rate %"
          value={inputs.cancellationRate}
          onChange={set('cancellationRate')}
          min={0} max={100}
          suffix="%"
          tooltip="Your current surgical case cancellation rate as a percentage of scheduled cases."
        />
        <NumberInput
          label="Avg Case Duration (min)"
          value={inputs.avgCaseDuration}
          onChange={set('avgCaseDuration')}
          min={15} max={360}
          suffix="min"
          tooltip="Average surgical case duration in minutes. Default 90 min is the average industry figure."
        />
      </CollapsibleSection>

      {/* ── Group 4: Operational Context ── */}
      <CollapsibleSection title="4 — Scheduling & Reporting" defaultOpen={false}>
        <NumberInput
          label="Weekly Reporting Hours"
          value={inputs.weeklyReportingHours}
          onChange={set('weeklyReportingHours')}
          min={0} max={168}
          suffix="hrs"
          tooltip="Hours spent per week on manual scheduling and reporting tasks. Default 5 hrs."
        />
        <NumberInput
          label="Reporting Hourly Cost"
          value={inputs.reportingHourlyCost}
          onChange={set('reportingHourlyCost')}
          min={10} max={300}
          prefix="$"
          tooltip="Loaded hourly cost of staff who perform scheduling and reporting tasks. Default $45 represents a mid-level analyst or RN coordinator."
        />
        <div className="text-[10px] text-gray-400 leading-relaxed">
          Annual savings = Weekly Hours × 52 × Hourly Cost × 50%
        </div>
      </CollapsibleSection>

      {/* ── Group 5: Platform & Pricing ── */}
      <CollapsibleSection title="5 — Platform & Pricing" defaultOpen={false}>
        <NumberInput
          label="Year 1 Implementation Cost"
          value={inputs.implementationCost}
          onChange={set('implementationCost')}
          min={0} max={5000000}
          prefix="$"
          tooltip="One-time Year 1 implementation and onboarding cost. Used as the denominator in ROI calculation along with ongoing platform fees."
        />
        <NumberInput
          label="Compliance Doc Value ($/case)"
          value={inputs.complianceDocPerCase}
          onChange={set('complianceDocPerCase')}
          min={0} max={500}
          prefix="$"
          tooltip="Value of automated compliance documentation per case performed. Default $15 based on time and audit risk savings from structured data capture."
        />
        <NumberInput
          label="Insights Add-on ($/OR/year)"
          value={inputs.insightsPerOR}
          onChange={set('insightsPerOR')}
          min={0} max={50000}
          prefix="$"
          tooltip="Annual per-OR cost of the LiveData Insights reporting module. Default $7,500/OR/year."
        />
        <NumberInput
          label="OR-Dashboard Add-on ($/OR/year)"
          value={inputs.orDashboardPerOR}
          onChange={set('orDashboardPerOR')}
          min={0} max={50000}
          prefix="$"
          tooltip="Annual per-OR cost of the OR Dashboard display module. Default $4,500/OR/year."
        />
        <NumberInput
          label="Day-of Boards Add-on ($/OR/year)"
          value={inputs.dayOfBoardsPerOR}
          onChange={set('dayOfBoardsPerOR')}
          min={0} max={50000}
          prefix="$"
          tooltip="Annual per-OR cost of the day-of scheduling boards module. Default $3,000/OR/year."
        />
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Annual platform cost</span>
            <span className="font-semibold text-gray-700">
              ${((inputs.insightsPerOR + inputs.orDashboardPerOR + inputs.dayOfBoardsPerOR) * inputs.staffedORs).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Total contract cost ({inputs.contractLength} yrs)</span>
            <span className="font-semibold text-red-600">
              ${(inputs.implementationCost + (inputs.insightsPerOR + inputs.orDashboardPerOR + inputs.dayOfBoardsPerOR) * inputs.staffedORs * inputs.contractLength).toLocaleString()}
            </span>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Group 6: Projection Parameters ── */}
      <CollapsibleSection title="6 — Projection Parameters" defaultOpen={false}>
        <NumberInput
          label="Contract Length (years)"
          value={inputs.contractLength}
          onChange={set('contractLength')}
          min={1} max={10}
          suffix="yrs"
          tooltip="Duration of the LiveData contract in years. Used to calculate total contract-period benefit and ROI."
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 flex items-center font-medium">
            Benefit Retention Rate
            <Tooltip text="Accounts for the reality that not all projected improvements are fully sustained. Default 80% is a conservative assumption." />
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={inputs.benefitRetention}
              onChange={(e) => set('benefitRetention')(Number(e.target.value))}
              className="flex-1 accent-red-600"
            />
            <span className="text-sm font-semibold text-red-600 w-10 text-right">
              {inputs.benefitRetention}%
            </span>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
