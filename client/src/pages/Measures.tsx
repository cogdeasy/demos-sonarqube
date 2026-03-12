import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { Code2, Percent, Copy, Brain, Gauge } from 'lucide-react';
import Header from '../components/Header';
import RatingBadge from '../components/RatingBadge';
import fetchApi from '../utils/api';
import { formatNumber } from '../utils/formatters';
import type { Project, ApiResponse } from '../types';

export default function Measures() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<ApiResponse<Project[]>>('/projects', { pageSize: '50' }).then((res) => {
      setProjects(res.data);
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

  const coverageData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    coverage: p.metrics.coverage,
    newCoverage: p.metrics.newCoverage,
  }));

  const duplicationData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    duplications: p.metrics.duplications,
  }));

  const complexityData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    complexity: p.metrics.complexity,
    cognitive: p.metrics.cognitiveComplexity,
  }));

  const ratingToNum = (r: string) => {
    const map: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    return map[r] || 0;
  };

  const radarData = projects.slice(0, 5).map((p) => ({
    project: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    reliability: ratingToNum(p.metrics.reliabilityRating),
    security: ratingToNum(p.metrics.securityRating),
    maintainability: ratingToNum(p.metrics.maintainabilityRating),
    coverage: Math.round(p.metrics.coverage / 20),
    duplications: Math.round((100 - p.metrics.duplications) / 20),
  }));

  const totalLines = projects.reduce((sum, p) => sum + p.metrics.linesOfCode, 0);
  const avgCoverage = Math.round(projects.reduce((sum, p) => sum + p.metrics.coverage, 0) / projects.length * 10) / 10;
  const avgDuplications = Math.round(projects.reduce((sum, p) => sum + p.metrics.duplications, 0) / projects.length * 10) / 10;
  const totalComplexity = projects.reduce((sum, p) => sum + p.metrics.complexity, 0);

  return (
    <div>
      <Header title="Measures" subtitle="Code quality measures across all projects" />

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MeasureCard icon={<Code2 size={20} />} label="Total Lines" value={formatNumber(totalLines)} color="#4b9fd5" />
          <MeasureCard icon={<Percent size={20} />} label="Avg Coverage" value={`${avgCoverage}%`} color="#00c853" />
          <MeasureCard icon={<Copy size={20} />} label="Avg Duplications" value={`${avgDuplications}%`} color="#ff9800" />
          <MeasureCard icon={<Gauge size={20} />} label="Total Complexity" value={formatNumber(totalComplexity)} color="#7c4dff" />
        </div>

        {/* Coverage chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Test Coverage by Project</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={coverageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="coverage" name="Overall Coverage" radius={[0, 4, 4, 0]}>
                {coverageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.coverage >= 80 ? '#00c853' : entry.coverage >= 50 ? '#ff9800' : '#d32f2f'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Duplications chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Duplications by Project</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={duplicationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="duplications" fill="#ff9800" radius={[0, 4, 4, 0]}>
                  {duplicationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.duplications <= 3 ? '#00c853' : entry.duplications <= 10 ? '#ff9800' : '#d32f2f'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Complexity chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Complexity by Project</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complexityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="complexity" name="Cyclomatic" fill="#4b9fd5" radius={[0, 4, 4, 0]} />
                <Bar dataKey="cognitive" name="Cognitive" fill="#7c4dff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            <Brain size={16} className="inline mr-2" />
            Quality Radar (Top 5 Projects)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="project" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar name="Reliability" dataKey="reliability" stroke="#d32f2f" fill="#d32f2f" fillOpacity={0.1} />
              <Radar name="Security" dataKey="security" stroke="#ff9800" fill="#ff9800" fillOpacity={0.1} />
              <Radar name="Maintainability" dataKey="maintainability" stroke="#4b9fd5" fill="#4b9fd5" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Project measures table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">All Project Measures</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Reliability</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Security</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Maintainability</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Coverage</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Duplications</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Lines</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Tech Debt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((p) => (
                  <tr key={p.key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#236a97]">{p.name}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <RatingBadge rating={p.metrics.reliabilityRating} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <RatingBadge rating={p.metrics.securityRating} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <RatingBadge rating={p.metrics.maintainabilityRating} size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">{p.metrics.coverage}%</td>
                    <td className="px-4 py-3 text-sm text-right">{p.metrics.duplications}%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatNumber(p.metrics.linesOfCode)}</td>
                    <td className="px-4 py-3 text-sm text-right">{p.metrics.technicalDebt}</td>
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

function MeasureCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
