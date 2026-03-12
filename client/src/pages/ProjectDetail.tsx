import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ArrowLeft, Bug, ShieldAlert, Wind, Flame, Code2, Copy } from 'lucide-react';
import Header from '../components/Header';
import RatingBadge from '../components/RatingBadge';
import QualityGateBadge from '../components/QualityGateBadge';
import IssueTypeBadge from '../components/IssueTypeBadge';
import SeverityBadge from '../components/SeverityBadge';
import fetchApi from '../utils/api';
import { formatNumber, formatDateTime } from '../utils/formatters';
import type { Project, Issue, ActivityEvent, ApiResponse } from '../types';

export default function ProjectDetail() {
  const { key } = useParams<{ key: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) return;
    const decodedKey = decodeURIComponent(key);
    Promise.all([
      fetchApi<ApiResponse<Project>>(`/projects/${decodedKey}`),
      fetchApi<ApiResponse<Issue[]>>(`/projects/${decodedKey}/issues`),
      fetchApi<ApiResponse<ActivityEvent[]>>(`/projects/${decodedKey}/activity`),
    ]).then(([projRes, issuesRes, activityRes]) => {
      setProject(projRes.data);
      setIssues(issuesRes.data);
      setActivity(activityRes.data);
      setLoading(false);
    });
  }, [key]);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
      </div>
    );
  }

  const m = project.metrics;

  return (
    <div>
      <Header title={project.name} subtitle={project.key} />

      <div className="p-6 space-y-6">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-[#4b9fd5] hover:underline">
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        {/* Quality gate + overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <QualityGateBadge status={project.qualityGate} />
              <span className="text-sm text-gray-500">
                Last analysis: {formatDateTime(project.lastAnalysis)}
              </span>
            </div>
            <div className="flex gap-1">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Main metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricBox icon={<Bug size={20} className="text-[#d32f2f]" />} label="Bugs" value={m.bugs} rating={m.reliabilityRating} />
            <MetricBox icon={<ShieldAlert size={20} className="text-[#e65100]" />} label="Vulnerabilities" value={m.vulnerabilities} rating={m.securityRating} />
            <MetricBox icon={<Wind size={20} className="text-[#558b2f]" />} label="Code Smells" value={m.codeSmells} rating={m.maintainabilityRating} />
            <MetricBox icon={<Flame size={20} className="text-[#ff6f00]" />} label="Security Hotspots" value={m.securityHotspots} rating={m.securityReviewRating} />
          </div>
        </div>

        {/* Measures row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">Lines of Code</span>
            </div>
            <div className="text-2xl font-bold">{formatNumber(m.linesOfCode)}</div>
            <div className="text-xs text-gray-400 mt-1">+{formatNumber(m.newLines)} new lines</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">Coverage</span>
            </div>
            <div className="text-2xl font-bold">{m.coverage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${m.coverage}%`,
                  backgroundColor: m.coverage >= 80 ? '#00c853' : m.coverage >= 50 ? '#ff9800' : '#d32f2f',
                }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{m.newCoverage}% on new code</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Copy size={16} className="text-gray-400" />
              <span className="text-xs text-gray-500">Duplications</span>
            </div>
            <div className="text-2xl font-bold">{m.duplications}%</div>
            <div className="text-xs text-gray-400 mt-1">{m.newDuplications}% on new code</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">Technical Debt</span>
            </div>
            <div className="text-2xl font-bold">{m.technicalDebt}</div>
            <div className="text-xs text-gray-400 mt-1">Complexity: {m.complexity}</div>
          </div>
        </div>

        {/* New code metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New Code Period</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold text-[#d32f2f]">{m.newBugs}</div>
              <div className="text-xs text-gray-500">New Bugs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold text-[#e65100]">{m.newVulnerabilities}</div>
              <div className="text-xs text-gray-500">New Vulnerabilities</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold text-[#558b2f]">{m.newCodeSmells}</div>
              <div className="text-xs text-gray-500">New Code Smells</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold">{m.newCoverage}%</div>
              <div className="text-xs text-gray-500">Coverage on New</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold">{m.newDuplications}%</div>
              <div className="text-xs text-gray-500">Duplication on New</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold">{formatNumber(m.newLines)}</div>
              <div className="text-xs text-gray-500">New Lines</div>
            </div>
          </div>
        </div>

        {/* Activity chart */}
        {activity.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Project Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bugs" stroke="#d32f2f" strokeWidth={2} />
                <Line type="monotone" dataKey="vulnerabilities" stroke="#ff9800" strokeWidth={2} />
                <Line type="monotone" dataKey="codeSmells" stroke="#558b2f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent issues */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Recent Issues ({issues.length})
          </h3>
          <div className="space-y-2">
            {issues.slice(0, 10).map((issue) => (
              <div key={issue.key} className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100">
                <IssueTypeBadge type={issue.type} showLabel={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{issue.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{issue.component.split(':').pop()}</p>
                </div>
                <SeverityBadge severity={issue.severity} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  icon,
  label,
  value,
  rating,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
}) {
  return (
    <div className="flex items-center gap-3">
      <RatingBadge rating={rating} size="lg" />
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xl font-bold">{value}</span>
        </div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
