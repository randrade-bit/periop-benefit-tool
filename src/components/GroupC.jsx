import { fmtNum, fmt$ } from './ui.jsx';

export default function GroupC({ results, inputs }) {
  const {
    annualReportingHoursSaved,
    annualReportingCostSaved,
    complianceDocAnnualValue,
  } = results;

  const weeklyHoursSaved = inputs.weeklyReportingHours * 0.5;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Administrative Efficiency</h2>
          <p className="text-sm text-gray-500 mt-0.5">Time and cost savings from scheduling digitalization</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Annual Hours Recovered</div>
            <div className="text-3xl font-black text-gray-800 tabular-nums">{fmtNum(annualReportingHoursSaved)} hrs</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gray-100" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5 font-medium">Reporting Cost Saved</div>
            <div className="text-2xl font-bold text-red-600 tabular-nums">{fmt$(annualReportingCostSaved)}</div>
          </div>
        </div>
      </div>

      {/* Reporting formula breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
          Scheduling Task Time Savings
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-600 mb-4 leading-relaxed">
          <div>Annual Cost Saved = Weekly Hours × 52 weeks × Hourly Cost × 50%</div>
          <div className="mt-1 text-gray-400">
            = {inputs.weeklyReportingHours} hrs × 52 × {fmt$(inputs.reportingHourlyCost)} × 50%
            = <span className="text-red-600 font-bold">{fmt$(annualReportingCostSaved)}/yr</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EffCard
            icon="📋"
            label="Hours Saved / Week"
            value={`${weeklyHoursSaved.toFixed(1)} hrs`}
            sub={`${inputs.weeklyReportingHours} hrs × 50%`}
            accent="gray"
          />
          <EffCard
            icon="📅"
            label="Annual Hours Recovered"
            value={`${fmtNum(annualReportingHoursSaved)} hrs`}
            sub="Redirected to patient care & strategy"
            accent="gray"
          />
          <EffCard
            icon="💰"
            label="Annual Cost Saved"
            value={fmt$(annualReportingCostSaved)}
            sub={`At ${fmt$(inputs.reportingHourlyCost)}/hr loaded cost`}
            accent="red"
          />
        </div>
      </div>

      {/* Compliance doc — shown as additional value, not in financial total */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <div className="text-xs font-semibold text-amber-700 mb-1">Additional Unquantified Value — Compliance Documentation</div>
        <p className="text-xs text-amber-700 leading-relaxed mb-2">
          Structured per-case documentation generates value through audit readiness, reduced manual chart work, and compliance risk reduction.
          This figure is shown separately and <strong>not included in the financial total</strong>.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600">${inputs.complianceDocPerCase}/case × {results.performedCases.toLocaleString()} performed cases</span>
          <span className="text-sm font-bold text-amber-700">{fmt$(complianceDocAnnualValue)}/yr</span>
        </div>
      </div>

      {/* Qualitative capabilities */}
      <div className="space-y-3">
        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Platform Capabilities</div>
        <QualCard
          icon="⚡"
          title="Real-Time Perioperative Visibility"
          body="LiveData replaces periodic manual reporting with a continuous, live view of OR status. Charge nurses, anesthesia, and OR directors see case progress, turnover status, and delay flags the moment they occur — not hours or days later in a static report."
          tag="Latency: periodic → real-time"
          tagColor="red"
        />
        <QualCard
          icon="📊"
          title="Surgeon Performance Dashboards"
          body="Surgeons gain access to real-time personal performance data including case duration trends, supply utilization, and on-time start history. Visibility into cost and efficiency metrics drives cost-aware decision-making and voluntary behavior change — without administrative mandate."
          tag="OR SCORE study: 6.54% supply cost reduction"
          tagColor="gray"
        />
        <QualCard
          icon="🔔"
          title="Automated Pre-Op Compliance Alerts"
          body="Real-time flags surface incomplete pre-admissions, missing clearances, and unresolved hold orders before they cascade into same-day cancellations. The system monitors readiness across all scheduled cases — something manual workflows cannot do at scale."
          tag="49.6% avoidable cancellations addressed (UPenn)"
          tagColor="red"
        />
        <QualCard
          icon="🗂️"
          title="Structured Compliance Documentation"
          body="Every case interaction generates structured, auditable records that reduce documentation burden on clinical staff while improving compliance posture. Each case generates measurable documentation value through time savings and reduced audit risk."
          tag={`$${inputs.complianceDocPerCase}/case compliance value`}
          tagColor="gray"
        />
      </div>
    </div>
  );
}

function EffCard({ icon, label, value, sub, accent }) {
  const styles = {
    red: { border: 'border-red-100', bg: 'bg-red-50', text: 'text-red-600' },
    gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-700' },
    green: { border: 'border-green-100', bg: 'bg-green-50', text: 'text-green-600' },
  };
  const s = styles[accent] || styles.gray;
  return (
    <div className={`border rounded-xl p-4 ${s.border} ${s.bg}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>
      <div className={`text-2xl font-black tabular-nums ${s.text}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}

function QualCard({ icon, title, body, tag, tagColor }) {
  const tagStyles = {
    red: 'bg-red-50 text-red-600 border-red-100',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 mb-1.5">{title}</div>
          <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
          {tag && (
            <span className={`inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full border ${tagStyles[tagColor] || tagStyles.gray}`}>
              {tag}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
