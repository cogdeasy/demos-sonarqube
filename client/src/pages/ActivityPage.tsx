import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import Header from '../components/Header';
import fetchApi from '../utils/api';
import { formatNumber } from '../utils/formatters';
import type { ActivityEvent, ApiResponse } from '../types';

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<ApiResponse<ActivityEvent[]>>('/activity').then((res) => {
      setActivity(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
      </div>
    );
  }

  const latest = activity[activity.length - 1];
  const previous = activity.length > 1 ? activity[activity.length - 2] : latest;

  const trendData = [
    {
      label: 'Bugs',
      current: latest.bugs,
      previous: previous.bugs,
      color: '#d32f2f',
    },
    {
      label: 'Vulnerabilities',
      current: latest.vulnerabilities,
      previous: previous.vulnerabilities,
      color: '#ff9800',
    },
    {
      label: 'Code Smells',
      current: latest.codeSmells,
      previous: previous.codeSmells,
      color: '#558b2f',
    },
    {
      label: 'Security Hotspots',
      current: latest.securityHotspots,
      previous: previous.securityHotspots,
      color: '#ff6f00',
    },
    {
      label: 'Coverage',
      current: latest.coverage,
      previous: previous.coverage,
      color: '#00c853',
      unit: '%',
      invertTrend: true,
    },
    {
      label: 'Lines of Code',
      current: latest.linesOfCode,
      previous: previous.linesOfCode,
      color: '#4b9fd5',
      format: true,
    },
  ];

  const debtData = activity.map((a) => ({
    date: a.date,
    debtDays: Math.round(a.technicalDebtMinutes / 480),
  }));

  return (
    <div>
      <Header title="Activity" subtitle="Portfolio trends and history" />

      <div className="p-6 space-y-6">
        {/* Trend cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendData.map((item) => {
            const diff = item.current - item.previous;
            const isPositive = item.invertTrend ? diff > 0 : diff < 0;
            const isNeutral = diff === 0;

            return (
              <div key={item.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="text-xl font-bold" style={{ color: item.color }}>
                  {item.format ? formatNumber(item.current) : item.current}
                  {item.unit || ''}
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs ${
                  isNeutral ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isNeutral ? (
                    <Minus size={12} />
                  ) : isPositive ? (
                    <TrendingDown size={12} />
                  ) : (
                    <TrendingUp size={12} />
                  )}
                  <span>
                    {isNeutral ? 'No change' : `${Number(Math.abs(diff).toFixed(1))}${item.unit || ''} ${isPositive ? 'improvement' : 'increase'}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Issues trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Issues Over Time</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bugs" stroke="#d32f2f" strokeWidth={2} dot={{ r: 4 }} name="Bugs" />
              <Line type="monotone" dataKey="vulnerabilities" stroke="#ff9800" strokeWidth={2} dot={{ r: 4 }} name="Vulnerabilities" />
              <Line type="monotone" dataKey="codeSmells" stroke="#558b2f" strokeWidth={2} dot={{ r: 4 }} name="Code Smells" />
              <Line type="monotone" dataKey="securityHotspots" stroke="#ff6f00" strokeWidth={2} dot={{ r: 4 }} name="Security Hotspots" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coverage trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Coverage Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Area type="monotone" dataKey="coverage" stroke="#00c853" fill="#00c853" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Duplications trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Duplications Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Area type="monotone" dataKey="duplications" stroke="#ff9800" fill="#ff9800" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technical debt trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Technical Debt (Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={debtData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis unit="d" />
              <Tooltip formatter={(value: number) => `${value} days`} />
              <Area type="monotone" dataKey="debtDays" stroke="#7c4dff" fill="#7c4dff" fillOpacity={0.15} strokeWidth={2} name="Technical Debt" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lines of code trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Lines of Code Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value: number) => formatNumber(value)} />
              <Tooltip formatter={(value: number) => formatNumber(value)} />
              <Area type="monotone" dataKey="linesOfCode" stroke="#4b9fd5" fill="#4b9fd5" fillOpacity={0.15} strokeWidth={2} name="Lines of Code" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* History table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">Analysis History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Bugs</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Vulnerabilities</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Code Smells</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Hotspots</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Coverage</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Duplications</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Lines</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...activity].reverse().map((event) => (
                  <tr key={event.date} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{event.date}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{event.bugs}</td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">{event.vulnerabilities}</td>
                    <td className="px-4 py-3 text-sm text-right text-green-700">{event.codeSmells}</td>
                    <td className="px-4 py-3 text-sm text-right text-amber-600">{event.securityHotspots}</td>
                    <td className="px-4 py-3 text-sm text-right">{event.coverage}%</td>
                    <td className="px-4 py-3 text-sm text-right">{event.duplications}%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatNumber(event.linesOfCode)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
