import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { Bug, ShieldAlert, Wind, Flame, Code2, FolderKanban, Percent, Copy } from 'lucide-react';
import Header from '../components/Header';
import fetchApi from '../utils/api';
import { formatNumber } from '../utils/formatters';
import type { MetricsOverview, ActivityEvent, ApiResponse } from '../types';

const COLORS = ['#00c853', '#ff9800', '#d32f2f'];
const RATING_COLORS = ['#00c853', '#7cb342', '#ff9800', '#ff5722', '#d32f2f'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricsOverview | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<ApiResponse<MetricsOverview>>('/metrics/overview'),
      fetchApi<ApiResponse<ActivityEvent[]>>('/activity'),
    ]).then(([metricsRes, activityRes]) => {
      setMetrics(metricsRes.data);
      setActivity(activityRes.data);
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
      </div>
    );
  }

  const qgData = [
    { name: 'Passed', value: metrics.qualityGateDistribution.OK },
    { name: 'Warning', value: metrics.qualityGateDistribution.WARN },
    { name: 'Failed', value: metrics.qualityGateDistribution.ERROR },
  ];

  const langData = Object.entries(metrics.languageDistribution).map(([lang, data]) => ({
    name: lang,
    projects: data.projects,
    lines: data.lines,
  }));

  const reliabilityData = Object.entries(metrics.ratingDistribution.reliability).map(([rating, count]) => ({
    name: rating,
    value: count,
  }));

  return (
    <div>
      <Header title="Dashboard" subtitle="Portfolio overview across all projects" />

      <div className="p-6 space-y-6">
        {/* Top metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<FolderKanban size={20} className="text-[#4b9fd5]" />}
            label="Projects"
            value={metrics.totalProjects.toString()}
            bgColor="#edf5fb"
          />
          <MetricCard
            icon={<Code2 size={20} className="text-[#7c4dff]" />}
            label="Lines of Code"
            value={formatNumber(metrics.totalLinesOfCode)}
            bgColor="#f3e5f5"
          />
          <MetricCard
            icon={<Percent size={20} className="text-[#00c853]" />}
            label="Avg. Coverage"
            value={`${metrics.avgCoverage}%`}
            bgColor="#e8f5e9"
          />
          <MetricCard
            icon={<Copy size={20} className="text-[#ff9800]" />}
            label="Avg. Duplications"
            value={`${metrics.avgDuplications}%`}
            bgColor="#fff3e0"
          />
        </div>

        {/* Issue metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Bug size={20} className="text-[#d32f2f]" />}
            label="Bugs"
            value={metrics.totalBugs.toString()}
            bgColor="#fde8e8"
          />
          <MetricCard
            icon={<ShieldAlert size={20} className="text-[#e65100]" />}
            label="Vulnerabilities"
            value={metrics.totalVulnerabilities.toString()}
            bgColor="#fff3e0"
          />
          <MetricCard
            icon={<Wind size={20} className="text-[#558b2f]" />}
            label="Code Smells"
            value={metrics.totalCodeSmells.toString()}
            bgColor="#f1f8e9"
          />
          <MetricCard
            icon={<Flame size={20} className="text-[#ff6f00]" />}
            label="Security Hotspots"
            value={metrics.totalSecurityHotspots.toString()}
            bgColor="#fff8e1"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quality Gate distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quality Gate Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={qgData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {qgData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Languages</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={langData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Bar dataKey="lines" fill="#4b9fd5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reliability rating distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Reliability Ratings</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reliabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {reliabilityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={RATING_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Portfolio Activity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bugs" stroke="#d32f2f" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="vulnerabilities" stroke="#ff9800" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="codeSmells" stroke="#558b2f" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="securityHotspots" stroke="#ff6f00" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Coverage & Duplication trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Coverage & Duplication Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="coverage" stroke="#00c853" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="duplications" stroke="#ff9800" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
