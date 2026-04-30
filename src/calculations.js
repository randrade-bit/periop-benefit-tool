/**
 * Pure calculation function — takes all inputs, returns all outputs.
 * No side effects. Safe to call on every render.
 */

// Round to 2 decimal places — applied to every intermediate value so that
// displayed numbers and downstream calculations are always in sync.
const r2 = (n) => Math.round(n * 100) / 100;

export function calculate(inputs) {
  const {
    staffedORs,
    operatingDays,
    annualCases,
    scheduledCases = null,
    cancellationRate,
    cancellationScenario = 'conservative',
    costPerMinute,
    revenuePerCase,
    currentFCOTS,
    fcotsScenario = 'A',
    avgFCOTSDelayMin = 12,
    currentTOT,
    totScenario = 'A',
    currentBlockUtil,
    blockUtilTarget = inputs.blockUtilTarget ?? 75,
    avgCaseDuration = 90,
    currentPrimeTimeUtil,
    primeTimeUtilTarget = inputs.primeTimeUtilTarget ?? 80,
    primeTimeHoursPerDay = inputs.primeTimeHoursPerDay ?? 10,
    blockHoursPerDay = inputs.blockHoursPerDay ?? 8,
    backfillRate = 15,
    weeklyReportingHours = 5,
    reportingHourlyCost,
    burnoutReductionPct,
    nursingFTEs = 40,
    avgNurseReplacementCost = 52000,
    contractLength,
    benefitRetention,
    implementationCost,
    complianceDocPerCase,
    insightsPerOR,
    orDashboardPerOR,
    dayOfBoardsPerOR,
  } = inputs;

  // ── Derived base values ──────────────────────────────────────────────────
  const hasScheduledCases = scheduledCases != null && scheduledCases > 0;
  const annualCancellationsTotal = hasScheduledCases
    ? Math.max(0, scheduledCases - annualCases)
    : Math.round(annualCases * (cancellationRate / 100));
  const effectiveScheduledCases = hasScheduledCases
    ? scheduledCases
    : annualCases + annualCancellationsTotal;
  const performedCases = annualCases;
  const computedCancellationRate = cancellationRate;
  const casesPerORPerDay = r2(performedCases / (staffedORs * operatingDays));

  // ── FCOTS ────────────────────────────────────────────────────────────────
  // Scenario A — Conservative: +10.7 pp absolute improvement (QI literature)
  // Scenario B — Aspirational: target 90% (high-performing facility benchmark)
  const projectedFCOTS = r2(fcotsScenario === 'B'
    ? Math.min(90, Math.max(currentFCOTS, 90))
    : Math.min(90, currentFCOTS + 10.7));
  const FCOTSImprovementPP = r2(Math.max(0, projectedFCOTS - currentFCOTS));
  const FCOTSAdditionalCasesPerYear = r2((FCOTSImprovementPP / 100) * staffedORs * operatingDays);
  const FCOTSMinutesRecoveredPerYear = r2(FCOTSAdditionalCasesPerYear * avgFCOTSDelayMin);

  // ── Turnover Time (TOT) ──────────────────────────────────────────────────
  const TOTReductionMin = r2(totScenario === 'B'
    ? Math.max(0, currentTOT - 25)
    : Math.min(currentTOT * 0.20, Math.max(0, currentTOT - 25)));
  const projectedTOT = r2(currentTOT - TOTReductionMin);
  const casesPerDay = r2(annualCases / operatingDays);
  const TOTMinutesRecoveredPerYear = r2(TOTReductionMin * (casesPerDay - 1) * operatingDays);

  // ── Combined Time Recovery (display only) ────────────────────────────────
  const totalMinutesRecoveredPerYear = r2(FCOTSMinutesRecoveredPerYear + TOTMinutesRecoveredPerYear);
  const timeSavingsCostValue = r2(totalMinutesRecoveredPerYear * costPerMinute);

  // ── Block Utilization ─────────────────────────────────────────────────────
  const blockUtilGap = r2(Math.max(0, blockUtilTarget - currentBlockUtil));
  const projectedBlockUtil = r2(Math.min(currentBlockUtil + blockUtilGap, blockUtilTarget));

  // ── Prime Time Utilization ────────────────────────────────────────────────
  const primeTimeUtilGap = r2(Math.max(0, primeTimeUtilTarget - currentPrimeTimeUtil));
  const projectedPrimeTimeUtil = r2(Math.min(currentPrimeTimeUtil + primeTimeUtilGap, primeTimeUtilTarget));

  // ── Cancellations ─────────────────────────────────────────────────────────
  const addressableShare = cancellationScenario === 'optimistic' ? 0.592 : 0.202;
  const avoidableCancellations = Math.floor(annualCancellationsTotal * addressableShare);
  const cancellationRevenue = r2(avoidableCancellations * revenuePerCase);
  const projectedCancellationRate = r2(Math.max(
    2,
    computedCancellationRate - (avoidableCancellations / Math.max(effectiveScheduledCases, 1)) * 100,
  ));

  // ── Reporting Efficiency ─────────────────────────────────────────────────
  // Formula: Weekly Reporting Hours × 52 weeks × Hourly Cost × 50%
  const annualReportingHoursSaved = r2(weeklyReportingHours * 52 * 0.5);
  const annualReportingCostSaved = r2(weeklyReportingHours * 52 * reportingHourlyCost * 0.5);

  // ── Staff Retention ───────────────────────────────────────────────────────
  const turnoverImprovementPP = r2(burnoutReductionPct * 0.12);
  const turnoverRateImprovement = r2(turnoverImprovementPP / 100);
  const annualStaffSavings = r2(turnoverRateImprovement * nursingFTEs * avgNurseReplacementCost);

  // ── Compliance Documentation Value ───────────────────────────────────────
  const complianceDocAnnualValue = r2(complianceDocPerCase * performedCases);

  // ── Platform Costs (for ROI) ──────────────────────────────────────────────
  const annualPlatformCost = r2((insightsPerOR + orDashboardPerOR + dayOfBoardsPerOR) * staffedORs);
  const totalContractCost = r2(implementationCost + annualPlatformCost * contractLength);

  // ── Operational Impact ───────────────────────────────────────────────────
  const idleORFCOTSCost = r2(FCOTSMinutesRecoveredPerYear * costPerMinute);
  const idleORTOTCost = r2(TOTMinutesRecoveredPerYear * costPerMinute);
  const idleORCostAvoided = r2(idleORFCOTSCost + idleORTOTCost);
  const overtimeCostAvoided = r2(FCOTSMinutesRecoveredPerYear * costPerMinute * 1.5);

  // Block utilization case-recovery model
  // 1. Annual block time capacity in minutes (across all ORs)
  const annualBlockMinutes = r2(blockHoursPerDay * staffedORs * operatingDays * 60);
  // Prime time minutes kept as a reference for other displays
  const annualPrimeTimeMinutes = r2(primeTimeHoursPerDay * staffedORs * operatingDays * 60);

  // 2. Turnover as % of block time (informational)
  // Annual turnovers = cases − (OR days × ORs): one fewer turnover than cases per OR-day
  const annualTurnovers = Math.max(0, annualCases - operatingDays * staffedORs);
  const turnoverAsPercentOfPrimeTime = annualBlockMinutes > 0
    ? r2((annualTurnovers * currentTOT) / annualBlockMinutes * 100)
    : 0;

  // 3. Backfill rate (%) — share of released time that actually gets used for cases.
  const effectiveBackfillRate = r2(backfillRate ?? 15);

  // 4. Realized additional cases, driven by block utilization improvement
  const additionalRecoverableMinutes = r2((blockUtilGap / 100) * annualBlockMinutes);
  const caseSlotMinutes = avgCaseDuration + currentTOT;
  const primeTimeCasesRecovered = caseSlotMinutes > 0
    ? Math.floor((additionalRecoverableMinutes / caseSlotMinutes) * (effectiveBackfillRate / 100))
    : 0;
  const totalAdditionalCases = avoidableCancellations + primeTimeCasesRecovered;
  const primeTimeRevenue = r2(primeTimeCasesRecovered * revenuePerCase);

  // ── Financial Totals ─────────────────────────────────────────────────────
  const totalAnnualBenefit = r2(
    cancellationRevenue +
    annualReportingCostSaved +
    primeTimeRevenue,
  );

  const totalContractBenefit = r2(totalAnnualBenefit * contractLength * (benefitRetention / 100));

  const roiMultiple = totalContractCost > 0
    ? r2(totalContractBenefit / totalContractCost)
    : null;
  const roiPct = totalContractCost > 0
    ? r2(((totalContractBenefit - totalContractCost) / totalContractCost) * 100)
    : null;

  return {
    // Derived
    annualCases,
    effectiveScheduledCases,
    performedCases,
    annualCancellationsTotal,
    computedCancellationRate,
    casesPerORPerDay,

    // FCOTS
    fcotsScenario,
    FCOTSImprovementPP,
    projectedFCOTS,
    FCOTSAdditionalCasesPerYear,
    FCOTSMinutesRecoveredPerYear,

    // TOT
    totScenario,
    TOTReductionMin,
    projectedTOT,
    TOTMinutesRecoveredPerYear,

    // Combined time recovery (display only)
    totalMinutesRecoveredPerYear,
    timeSavingsCostValue,

    // Block utilization (display only)
    blockUtilTarget,
    blockUtilGap,
    projectedBlockUtil,

    // Prime time utilization (display only)
    primeTimeUtilTarget,
    primeTimeUtilGap,
    projectedPrimeTimeUtil,

    // Cancellations
    cancellationScenario,
    addressableShare,
    avoidableCancellations,
    cancellationRevenue,
    projectedCancellationRate,

    // Reporting
    annualReportingHoursSaved,
    annualReportingCostSaved,

    // Staff retention
    turnoverImprovementPP,
    turnoverRateImprovement,
    nursingFTEs,
    avgNurseReplacementCost,
    annualStaffSavings,

    // Compliance
    complianceDocAnnualValue,

    // Platform costs
    annualPlatformCost,
    totalContractCost,

    // Operational impact
    primeTimeRevenue,
    idleORFCOTSCost,
    idleORTOTCost,
    idleORCostAvoided,
    overtimeCostAvoided,
    primeTimeCasesRecovered,
    totalAdditionalCases,
    annualPrimeTimeMinutes,
    turnoverAsPercentOfPrimeTime,
    effectiveBackfillRate,
    additionalRecoverableMinutes,

    // Totals
    totalAnnualBenefit,
    totalContractBenefit,
    roiMultiple,
    roiPct,
  };
}
