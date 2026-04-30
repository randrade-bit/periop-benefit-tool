import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

// ── Formatters ───────────────────────────────────────────────────────────────
export const fmt$ = (n) =>
  '$' + Math.round(n).toLocaleString('en-US');

export const fmtPct = (n, decimals = 1) =>
  n.toFixed(decimals) + '%';

export const fmtNum = (n) =>
  Math.round(n).toLocaleString('en-US');

export const fmtMin = (n) =>
  Math.round(n) + ' min';

// ── Tooltip — uses a portal so it is never clipped by overflow containers ────
export function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const show = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left });
    }
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="w-4 h-4 rounded-full border border-gray-300 text-gray-400 text-[10px] leading-none flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors"
        aria-label="More information"
      >
        ?
      </button>
      {open &&
        ReactDOM.createPortal(
          <div
            style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
            className="w-64 bg-gray-900 text-gray-100 text-xs rounded-lg p-3 shadow-2xl leading-relaxed pointer-events-none"
          >
            {text}
          </div>,
          document.body,
        )}
    </span>
  );
}

// ── Collapsible Section ───────────────────────────────────────────────────────
export function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
      >
        <span className="text-sm font-semibold text-gray-700 tracking-wide">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="bg-white p-4 space-y-3">{children}</div>}
    </div>
  );
}

// ── Number Input ─────────────────────────────────────────────────────────────
export function NumberInput({ label, value, onChange, min, max, prefix, suffix, tooltip }) {
  const [localVal, setLocalVal] = useState(String(value));
  const focused = useRef(false);

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-' || raw === '.') {
      setLocalVal(raw);
      return;
    }
    if (!/^-?\d*\.?\d*$/.test(raw)) return;
    setLocalVal(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      const clamped = min !== undefined ? Math.max(min, parsed) : parsed;
      const clampedMax = max !== undefined ? Math.min(max, clamped) : clamped;
      onChange(clampedMax);
    }
  };

  const handleFocus = () => { focused.current = true; };

  const handleBlur = () => {
    focused.current = false;
    setLocalVal(String(value));
  };

  // Only sync from parent when not focused (e.g. external reset)
  React.useEffect(() => {
    if (!focused.current) setLocalVal(String(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 flex items-center font-medium">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-100 transition-all">
        {prefix && (
          <span className="px-2 text-gray-400 text-sm border-r border-gray-200 bg-gray-50 py-1.5">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={localVal}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 bg-transparent text-gray-800 text-sm px-2 py-1.5 outline-none min-w-[4rem]"
        />
        {suffix && (
          <span className="px-2 text-gray-400 text-sm border-l border-gray-200 bg-gray-50 py-1.5">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────
export function MetricCard({ label, current, projected, currentLabel, projectedLabel, delta, deltaLabel, positive = true }) {
  const isUp = projected > current;
  const color = positive ? (isUp ? 'text-green-600' : 'text-red-500') : (isUp ? 'text-red-500' : 'text-green-600');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">{label}</div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">Current</div>
          <div className="text-xl font-bold text-gray-500">{currentLabel}</div>
        </div>
        <div className="flex flex-col items-center pb-1">
          <svg className={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isUp ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
          </svg>
        </div>
        <div className="flex-1 text-right">
          <div className="text-xs text-gray-400 mb-1">Projected</div>
          <div className="text-xl font-bold text-red-600">{projectedLabel}</div>
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{deltaLabel || 'Improvement'}</span>
          <span className="text-sm font-semibold text-green-600">{delta}</span>
        </div>
      )}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ current, projected, max, lowIsBetter = false }) {
  const clamp = (v) => Math.max(0, Math.min(v / max, 1));
  const cPct = clamp(current) * 100;
  const pPct = clamp(projected) * 100;

  return (
    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
      {/* Projected (red brand) */}
      <div
        className="absolute inset-y-0 left-0 bg-red-500 rounded-full transition-all duration-500"
        style={{ width: `${lowIsBetter ? cPct : pPct}%` }}
      />
      {/* Current (gray) layered on top */}
      <div
        className="absolute inset-y-0 left-0 bg-gray-300 rounded-full transition-all duration-500"
        style={{ width: `${lowIsBetter ? pPct : cPct}%` }}
      />
    </div>
  );
}

// ── Semi-circle Gauge ─────────────────────────────────────────────────────────
export function SemiGauge({ current, projected, max, lowIsBetter = false }) {
  const cx = 70, cy = 65, r = 54;

  const getPoint = (pct) => {
    const angle = (180 - pct * 180) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle),
    };
  };

  const makeArc = (pct) => {
    if (pct <= 0.001) return null;
    const p = Math.min(pct, 1);
    if (p >= 0.999) {
      const mid = getPoint(0.5);
      return `M ${(cx - r).toFixed(1)} ${cy} A ${r} ${r} 0 0 0 ${mid.x.toFixed(2)} ${mid.y.toFixed(2)} A ${r} ${r} 0 0 0 ${(cx + r).toFixed(1)} ${cy}`;
    }
    const ep = getPoint(p);
    const large = p > 0.5 ? 1 : 0;
    return `M ${(cx - r).toFixed(1)} ${cy} A ${r} ${r} 0 ${large} 0 ${ep.x.toFixed(2)} ${ep.y.toFixed(2)}`;
  };

  const clampPct = (v) => Math.max(0, Math.min(v / max, 1));
  const cPct = clampPct(current);
  const pPct = clampPct(projected);

  // For higher-is-better: draw projected (red) first, then current (gray) on top → red shows as "gain" band
  // For lower-is-better: draw current (gray) first, then projected (red) → red shows as "freed" portion
  const firstPct = lowIsBetter ? cPct : pPct;
  const secondPct = lowIsBetter ? pPct : cPct;
  const firstColor = lowIsBetter ? '#d1d5db' : '#dc2626'; // gray-300 : red-600
  const secondColor = lowIsBetter ? '#dc2626' : '#d1d5db'; // red-600 : gray-300

  const firstArc = makeArc(firstPct);
  const secondArc = makeArc(secondPct);
  const bgArc = makeArc(1);

  return (
    <svg viewBox="0 0 140 85" className="w-full max-h-24">
      <path d={bgArc} fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" />
      {firstArc && (
        <path d={firstArc} fill="none" stroke={firstColor} strokeWidth="10" strokeLinecap="round" />
      )}
      {secondArc && (
        <path d={secondArc} fill="none" stroke={secondColor} strokeWidth="10" strokeLinecap="round" />
      )}
      <text x={cx - r - 2} y={cy + 18} textAnchor="end" fill="#9ca3af" fontSize="9">
        {lowIsBetter ? max : '0'}
      </text>
      <text x={cx + r + 2} y={cy + 18} textAnchor="start" fill="#9ca3af" fontSize="9">
        {lowIsBetter ? '0' : max}
      </text>
    </svg>
  );
}

// ── Finance Row ───────────────────────────────────────────────────────────────
export function FinanceRow({ label, value, highlight = false }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${highlight ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
      <span className={`text-sm ${highlight ? 'text-gray-800 font-semibold' : 'text-gray-600'}`}>{label}</span>
      <span className={`text-sm font-bold tabular-nums ${highlight ? 'text-red-600 text-base' : 'text-green-600'}`}>{fmt$(value)}</span>
    </div>
  );
}
