import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  BarChart,
  UserCheck
} from 'lucide-react';
import { Employee, CompanyOKR, Competencies } from '../types';
import { formatDate } from '../utils/formatters';

interface PerformanceSuiteProps {
  employees: Employee[];
  okrs: CompanyOKR[];
  onUpdateEmployeeRating: (employeeId: string, newRating: number) => void;
  onUpdateOkrProgress: (okrId: string, newProgress: number) => void;
}

export const PerformanceSuite: React.FC<PerformanceSuiteProps> = ({
  employees,
  okrs,
  onUpdateEmployeeRating,
  onUpdateOkrProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'radar' | 'okrs' | 'flightrisk'>('matrix');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Org Benchmark Competencies
  const benchmarkCompetencies: Competencies = {
    execution: 88,
    leadership: 82,
    impact: 85,
    collaboration: 90,
    velocity: 86,
  };

  // Helper to render SVG Radar Chart
  const renderRadarChart = (empComp: Competencies, benchComp: Competencies) => {
    const size = 300;
    const center = size / 2;
    const radius = 105;
    const axes = [
      { key: 'execution', label: 'Execution', angle: 0 },
      { key: 'leadership', label: 'Leadership', angle: 72 },
      { key: 'impact', label: 'Strategic Impact', angle: 144 },
      { key: 'collaboration', label: 'Collaboration', angle: 216 },
      { key: 'velocity', label: 'Velocity', angle: 288 },
    ];

    const getCoordinates = (value: number, angleDeg: number) => {
      const angleRad = ((angleDeg - 90) * Math.PI) / 180;
      const r = (value / 100) * radius;
      return {
        x: center + r * Math.cos(angleRad),
        y: center + r * Math.sin(angleRad),
      };
    };

    // Calculate polygons
    const empPoints = axes
      .map((a) => {
        const pt = getCoordinates(empComp[a.key as keyof Competencies], a.angle);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    const benchPoints = axes
      .map((a) => {
        const pt = getCoordinates(benchComp[a.key as keyof Competencies], a.angle);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    return (
      <svg width={size} height={size} className="mx-auto overflow-visible">
        {/* Background Web Rings */}
        {[0.25, 0.5, 0.75, 1.0].map((ringLevel, i) => {
          const r = radius * ringLevel;
          const ringPoints = axes
            .map((a) => {
              const angleRad = ((a.angle - 90) * Math.PI) / 180;
              return `${center + r * Math.cos(angleRad)},${center + r * Math.sin(angleRad)}`;
            })
            .join(' ');
          return (
            <polygon
              key={i}
              points={ringPoints}
              fill="none"
              stroke="#262626"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines & Labels */}
        {axes.map((a) => {
          const outer = getCoordinates(100, a.angle);
          const labelPt = getCoordinates(118, a.angle);
          return (
            <g key={a.key}>
              <line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#333333"
                strokeWidth="1"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-neutral-400 text-[10px] font-sans font-medium"
              >
                {a.label}
              </text>
            </g>
          );
        })}

        {/* Benchmark Polygon */}
        <polygon
          points={benchPoints}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Employee Polygon */}
        <polygon
          points={empPoints}
          fill="rgba(34, 211, 238, 0.25)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Data points */}
        {axes.map((a) => {
          const pt = getCoordinates(empComp[a.key as keyof Competencies], a.angle);
          return (
            <circle
              key={a.key}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#22d3ee"
              stroke="#09090b"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    );
  };

  // 9-Box Matrix Quadrants
  const matrixBoxes = [
    { id: 'b1', name: 'Future Leaders', perf: 'Achieving', pot: 'High' },
    { id: 'b2', name: 'Star Performers', perf: 'Exceeding', pot: 'High' },
    { id: 'b3', name: 'High Potentials', perf: 'Developing', pot: 'High' },
    { id: 'b4', name: 'Core Contributors', perf: 'Achieving', pot: 'Medium' },
    { id: 'b5', name: 'High Professionals', perf: 'Exceeding', pot: 'Medium' },
    { id: 'b6', name: 'Growth Needed', perf: 'Developing', pot: 'Medium' },
    { id: 'b7', name: 'Solid Contributors', perf: 'Achieving', pot: 'Growth' },
    { id: 'b8', name: 'Effective Specialists', perf: 'Exceeding', pot: 'Growth' },
    { id: 'b9', name: 'Action Required', perf: 'Developing', pot: 'Growth' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Section */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>People & Organization Strategy</span>
            <span aria-hidden="true">·</span>
            <span>Talent Calibration</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">Q3 Review Cycle Complete</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Performance Analytics & Talent Matrix
          </h1>
          <p className="mt-1 text-sm text-neutral-400 max-w-2xl">
            Quantitative talent calibration using 9-box performance vs potential mapping, multi-axis competency radars, and company OKR progress.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900 p-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'matrix' ? 'bg-neutral-800 text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            9-Box Matrix
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'radar' ? 'bg-neutral-800 text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Competency Radar
          </button>
          <button
            onClick={() => setActiveTab('okrs')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'okrs' ? 'bg-neutral-800 text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Company OKRs
          </button>
          <button
            onClick={() => setActiveTab('flightrisk')}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === 'flightrisk' ? 'bg-neutral-800 text-cyan-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Retention & Flight Risk
          </button>
        </div>
      </div>

      {/* VIEW 1: 9-BOX TALENT MATRIX */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* The 3x3 Matrix Grid (Col Span 2) */}
          <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                  Talent Distribution Grid (Performance vs Potential)
                </h2>
                <p className="text-xs text-neutral-400">
                  Select an employee badge to inspect compensation alignment and competency profile.
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                12 Calibrated Team Members
              </span>
            </div>

            {/* Matrix Visual Frame */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {matrixBoxes.map((box) => {
                const boxEmployees = employees.filter(
                  (e) => e.performance.performanceLevel === box.perf && e.performance.potentialLevel === box.pot
                );

                const isStarBox = box.name === 'Star Performers';
                const isUnderperform = box.name === 'Action Required';

                return (
                  <div
                    key={box.id}
                    className={`min-h-[140px] rounded border p-3 flex flex-col justify-between transition-colors ${
                      isStarBox 
                        ? 'border-cyan-500/40 bg-cyan-950/20' 
                        : isUnderperform 
                        ? 'border-rose-900/40 bg-rose-950/10' 
                        : 'border-neutral-800/80 bg-neutral-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-medium">
                        <span className={isStarBox ? 'text-cyan-400 font-semibold' : 'text-neutral-300'}>
                          {box.name}
                        </span>
                        <span className="font-mono text-neutral-500">
                          {boxEmployees.length}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                        {box.pot} Pot / {box.perf}
                      </div>
                    </div>

                    {/* Employee Badges */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {boxEmployees.map((emp) => {
                        const isSelected = emp.id === selectedEmployeeId;
                        return (
                          <button
                            key={emp.id}
                            onClick={() => setSelectedEmployeeId(emp.id)}
                            className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-all ${
                              isSelected
                                ? 'bg-cyan-500 text-neutral-950 font-semibold ring-1 ring-cyan-300'
                                : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                            }`}
                          >
                            {emp.avatar ? (
                              <img 
                                src={emp.avatar} 
                                alt={emp.name}
                                referrerPolicy="no-referrer"
                                className="h-4 w-4 rounded-full object-cover" 
                              />
                            ) : (
                              <span className="text-[10px] font-bold">
                                {emp.name.slice(0, 1)}
                              </span>
                            )}
                            <span className="text-[11px] truncate max-w-[85px]">{emp.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                      {boxEmployees.length === 0 && (
                        <span className="text-[10px] text-neutral-600 font-mono py-2">
                          — No personnel —
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee Talent Dossier Drawer (Col Span 1) */}
          <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 space-y-5">
            <div className="border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-3">
                {selectedEmployee.avatar ? (
                  <img 
                    src={selectedEmployee.avatar} 
                    alt={selectedEmployee.name} 
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover border border-neutral-700 shrink-0" 
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-neutral-200 font-semibold shrink-0">
                    {selectedEmployee.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-neutral-100">{selectedEmployee.name}</h3>
                  <div className="text-xs text-neutral-400">{selectedEmployee.role}</div>
                  <div className="text-[11px] font-mono text-cyan-400">{selectedEmployee.department}</div>
                </div>
              </div>
            </div>

            {/* Performance Scores Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-2.5">
                <span className="text-[10px] text-neutral-500 uppercase">Review Rating</span>
                <div className="text-base font-semibold text-neutral-100 mt-0.5">
                  {selectedEmployee.performance.currentRating} / 5.0
                </div>
              </div>
              <div className="rounded border border-neutral-800 bg-neutral-950/60 p-2.5">
                <span className="text-[10px] text-neutral-500 uppercase">Sprint Velocity</span>
                <div className="text-base font-semibold text-cyan-400 mt-0.5">
                  {selectedEmployee.performance.velocityScore}%
                </div>
              </div>
            </div>

            {/* Calibration & Flight Risk */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-800/80 py-1.5">
                <span className="text-neutral-400">Potential Level:</span>
                <span className="font-semibold text-neutral-200 font-mono">
                  {selectedEmployee.performance.potentialLevel}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 py-1.5">
                <span className="text-neutral-400">Performance Bracket:</span>
                <span className="font-semibold text-neutral-200 font-mono">
                  {selectedEmployee.performance.performanceLevel}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 py-1.5">
                <span className="text-neutral-400">Flight Risk:</span>
                <span className={`font-mono font-semibold ${
                  selectedEmployee.performance.flightRisk === 'Low'
                    ? 'text-emerald-400'
                    : selectedEmployee.performance.flightRisk === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {selectedEmployee.performance.flightRisk}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 py-1.5">
                <span className="text-neutral-400">Cycle Status:</span>
                <span className="font-mono text-cyan-400">
                  {selectedEmployee.performance.reviewCycleStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Manager Qualitative Review */}
            <div className="rounded border border-neutral-800 bg-neutral-950/60 p-3 text-xs">
              <div className="text-[11px] font-semibold text-neutral-300">Executive Notes:</div>
              <p className="mt-1 text-neutral-400 leading-relaxed">
                "{selectedEmployee.performance.managerNotes}"
              </p>
            </div>

            {/* Interactive Rating Tuner */}
            <div className="border-t border-neutral-800 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Adjust Calibrated Score:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {selectedEmployee.performance.currentRating}
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.1"
                value={selectedEmployee.performance.currentRating}
                onChange={(e) => onUpdateEmployeeRating(selectedEmployee.id, parseFloat(e.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: COMPETENCY RADAR SPIDER CHART */}
      {activeTab === 'radar' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Radar Visualization */}
          <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5 lg:col-span-2">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                  5-Axis Talent Competency Profile
                </h2>
                <p className="text-xs text-neutral-400">
                  Comparing {selectedEmployee.name} against the Vanguard Org Engineering & Leadership Benchmark.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                  <span>{selectedEmployee.name.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span>Org Benchmark</span>
                </div>
              </div>
            </div>

            {/* SVG Spider Chart Container */}
            <div className="mt-8 flex items-center justify-center p-4">
              {renderRadarChart(selectedEmployee.performance.competencies, benchmarkCompetencies)}
            </div>

            {/* Numeric Axis Comparison Table */}
            <div className="mt-6 grid grid-cols-5 gap-2 border-t border-neutral-800/80 pt-4 text-center font-mono text-xs">
              {Object.entries(selectedEmployee.performance.competencies).map(([axis, val]) => {
                const bench = benchmarkCompetencies[axis as keyof Competencies];
                const delta = val - bench;
                return (
                  <div key={axis} className="rounded border border-neutral-800/60 bg-neutral-950/40 p-2">
                    <div className="text-[10px] text-neutral-400 uppercase">{axis}</div>
                    <div className="mt-0.5 text-sm font-semibold text-cyan-400">{val}%</div>
                    <div className={`text-[10px] ${delta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {delta >= 0 ? `+${delta}` : delta}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Select Employee to compare */}
          <div className="rounded border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Select Colleague
            </h3>
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {employees.map((emp) => {
                const isSelected = emp.id === selectedEmployeeId;
                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className={`flex w-full items-center justify-between rounded p-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-neutral-800 text-cyan-400 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-800/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {emp.avatar ? (
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          referrerPolicy="no-referrer"
                          className="h-6 w-6 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-300 font-medium">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div>{emp.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{emp.department}</div>
                      </div>
                    </div>
                    <span className="font-mono text-neutral-400">{emp.performance.currentRating}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: COMPANY & SQUAD OKRS */}
      {activeTab === 'okrs' && (
        <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
                Q4 2026 Corporate & Divisional Objectives
              </h2>
              <p className="text-xs text-neutral-400">
                Strategic execution tracked with measurable key results and target metrics.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              5 Primary Strategic OKRs
            </span>
          </div>

          <div className="mt-4 divide-y divide-neutral-800/80">
            {okrs.map((okr) => (
              <div key={okr.id} className="py-4 hover:bg-neutral-800/20 transition-colors">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[11px] text-cyan-400">{okr.department}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-400 font-sans">Owner: {okr.ownerName}</span>
                    </div>
                    <div className="text-sm font-medium text-neutral-200">
                      {okr.objective}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right text-xs font-mono">
                      <div className="text-neutral-300">
                        {okr.currentMetric} <span className="text-neutral-500">/ {okr.targetMetric}</span>
                      </div>
                      <div className={`text-[11px] ${
                        okr.status === 'On_Track' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {okr.status === 'On_Track' ? 'On Track' : 'Needs Attention'}
                      </div>
                    </div>

                    <div className="w-28">
                      <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                        <span>{okr.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-xs bg-neutral-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-xs ${
                            okr.progress >= 85 ? 'bg-cyan-400' : 'bg-amber-500'
                          }`}
                          style={{ width: `${okr.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: RETENTION & FLIGHT RISK MONITOR */}
      {activeTab === 'flightrisk' && (
        <div className="rounded border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-sm font-semibold tracking-tight text-neutral-100">
              Retention & Flight Risk Early Warning System
            </h2>
            <p className="text-xs text-neutral-400">
              Proactive flight risk monitoring cross-referencing compensation market benchmarks, sprint velocity spikes, and review feedback.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {employees.filter(e => e.performance.flightRisk !== 'Low').map((emp) => (
              <div key={emp.id} className="rounded border border-amber-900/40 bg-neutral-900/80 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {emp.avatar ? (
                      <img 
                        src={emp.avatar} 
                        alt={emp.name} 
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-full object-cover border border-neutral-700" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-300 font-medium">
                        {emp.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-neutral-200 text-xs">{emp.name}</div>
                      <div className="text-[11px] text-neutral-400">{emp.role}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-medium">
                    Moderate Risk
                  </span>
                </div>

                <div className="mt-3 text-xs text-neutral-400 bg-neutral-950/60 p-2.5 rounded border border-neutral-800/80">
                  <div className="font-medium text-neutral-300 text-[11px]">Primary Signal:</div>
                  <p className="mt-0.5 text-neutral-400">
                    High industry recruitment targeting specialized distributed systems skills. Base salary ({emp.compensation.baseSalaryAnnual.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}) is slightly below 75th percentile market band.
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-1">
                  <span className="text-cyan-400 font-mono text-[11px]">Recommended: Equity Refresh + 8% Comp Adjustment</span>
                  <button 
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className="text-neutral-300 hover:text-white"
                  >
                    View Dossier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
