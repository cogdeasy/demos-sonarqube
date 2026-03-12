import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Flame, AlertTriangle, CheckCircle, ShieldCheck, Wrench } from 'lucide-react';
import Header from '../components/Header';
import fetchApi from '../utils/api';
import { timeAgo } from '../utils/formatters';
import type { SecurityHotspot, ApiResponse } from '../types';

interface HotspotSummary {
  total: number;
  toReview: number;
  reviewed: number;
  safe: number;
  fixed: number;
  byProbability: { HIGH: number; MEDIUM: number; LOW: number };
  byCategory: Record<string, number>;
}

const PROB_COLORS = { HIGH: '#d32f2f', MEDIUM: '#ff9800', LOW: '#4caf50' };
const STATUS_COLORS = ['#ff9800', '#2196f3', '#4caf50', '#00c853'];

export default function SecurityHotspots() {
  const [hotspots, setHotspots] = useState<SecurityHotspot[]>([]);
  const [summary, setSummary] = useState<HotspotSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [probFilter, setProbFilter] = useState('');

  useEffect(() => {
    const params: Record<string, string> = { pageSize: '50' };
    if (statusFilter) params.status = statusFilter;
    if (probFilter) params.vulnerabilityProbability = probFilter;

    Promise.all([
      fetchApi<ApiResponse<SecurityHotspot[]>>('/security-hotspots', params),
      fetchApi<ApiResponse<HotspotSummary>>('/security-hotspots/summary'),
    ]).then(([hotspotsRes, summaryRes]) => {
      setHotspots(hotspotsRes.data);
      setSummary(summaryRes.data);
      setLoading(false);
    });
  }, [statusFilter, probFilter]);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
      </div>
    );
  }

  const statusData = [
    { name: 'To Review', value: summary.toReview },
    { name: 'Reviewed', value: summary.reviewed },
    { name: 'Safe', value: summary.safe },
    { name: 'Fixed', value: summary.fixed },
  ];

  const probData = [
    { name: 'High', value: summary.byProbability.HIGH },
    { name: 'Medium', value: summary.byProbability.MEDIUM },
    { name: 'Low', value: summary.byProbability.LOW },
  ];

  const reviewProgress = summary.total > 0
    ? Math.round(((summary.reviewed + summary.safe + summary.fixed) / summary.total) * 100)
    : 0;

  return (
    <div>
      <Header title="Security Hotspots" subtitle={`${summary.total} hotspots found`} />

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <SummaryCard icon={<Flame />} label="Total" value={summary.total} color="#ff6f00" />
          <SummaryCard icon={<AlertTriangle />} label="To Review" value={summary.toReview} color="#ff9800" />
          <SummaryCard icon={<CheckCircle />} label="Reviewed" value={summary.reviewed} color="#2196f3" />
          <SummaryCard icon={<ShieldCheck />} label="Safe" value={summary.safe} color="#4caf50" />
          <SummaryCard icon={<Wrench />} label="Fixed" value={summary.fixed} color="#00c853" />
        </div>

        {/* Review progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Security Review Progress</h3>
            <span className="text-sm font-bold" style={{ color: reviewProgress >= 80 ? '#00c853' : reviewProgress >= 50 ? '#ff9800' : '#d32f2f' }}>
              {reviewProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{
                width: `${reviewProgress}%`,
                backgroundColor: reviewProgress >= 80 ? '#00c853' : reviewProgress >= 50 ? '#ff9800' : '#d32f2f',
              }}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By Vulnerability Probability</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={probData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {probData.map((entry) => (
                    <Cell key={entry.name} fill={PROB_COLORS[entry.name.toUpperCase() as keyof typeof PROB_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Statuses</option>
              <option value="TO_REVIEW">To Review</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="SAFE">Safe</option>
              <option value="FIXED">Fixed</option>
            </select>
            <select
              value={probFilter}
              onChange={(e) => setProbFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Probabilities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Hotspot list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
          {hotspots.map((hotspot) => (
            <div key={hotspot.key} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Flame
                    size={16}
                    style={{
                      color: PROB_COLORS[hotspot.vulnerabilityProbability],
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{hotspot.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono">
                      {hotspot.component.split(':').pop()}
                    </span>
                    <span className="text-xs text-gray-400">L{hotspot.line}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor: hotspot.vulnerabilityProbability === 'HIGH' ? '#fde8e8' : hotspot.vulnerabilityProbability === 'MEDIUM' ? '#fff3e0' : '#e8f5e9',
                        color: PROB_COLORS[hotspot.vulnerabilityProbability],
                      }}
                    >
                      {hotspot.vulnerabilityProbability}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      hotspot.status === 'TO_REVIEW' ? 'bg-orange-100 text-orange-700' :
                      hotspot.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                      hotspot.status === 'SAFE' ? 'bg-green-100 text-green-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {hotspot.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                      {hotspot.securityCategory}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(hotspot.creationDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
