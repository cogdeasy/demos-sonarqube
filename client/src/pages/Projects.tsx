import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Lock } from 'lucide-react';
import Header from '../components/Header';
import RatingBadge from '../components/RatingBadge';
import QualityGateBadge from '../components/QualityGateBadge';
import fetchApi from '../utils/api';
import { formatNumber, timeAgo } from '../utils/formatters';
import type { Project, ApiResponse } from '../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [qgFilter, setQgFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => {
    const params: Record<string, string> = { pageSize: '50' };
    if (search) params.search = search;
    if (qgFilter) params.qualityGate = qgFilter;
    if (langFilter) params.language = langFilter;

    fetchApi<ApiResponse<Project[]>>('/projects', params).then((res) => {
      setProjects(res.data);
      setLoading(false);
    });
  }, [search, qgFilter, langFilter]);

  const languages = [...new Set(projects.map((p) => p.language))].sort();

  return (
    <div>
      <Header title="Projects" subtitle={`${projects.length} projects analyzed`} />

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
              />
            </div>
            <select
              value={qgFilter}
              onChange={(e) => setQgFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Quality Gates</option>
              <option value="OK">Passed</option>
              <option value="WARN">Warning</option>
              <option value="ERROR">Failed</option>
            </select>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project list */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.key}
                to={`/projects/${encodeURIComponent(project.key)}`}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#236a97] hover:underline">
                          {project.name}
                        </h3>
                        {project.visibility === 'public' ? (
                          <Eye size={14} className="text-gray-400" />
                        ) : (
                          <Lock size={14} className="text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{project.key}</p>
                    </div>
                  </div>
                  <QualityGateBadge status={project.qualityGate} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <RatingBadge rating={project.metrics.reliabilityRating} size="sm" />
                    <div>
                      <div className="text-sm font-semibold">{project.metrics.bugs}</div>
                      <div className="text-[10px] text-gray-500">Bugs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingBadge rating={project.metrics.securityRating} size="sm" />
                    <div>
                      <div className="text-sm font-semibold">{project.metrics.vulnerabilities}</div>
                      <div className="text-[10px] text-gray-500">Vulnerabilities</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingBadge rating={project.metrics.maintainabilityRating} size="sm" />
                    <div>
                      <div className="text-sm font-semibold">{project.metrics.codeSmells}</div>
                      <div className="text-[10px] text-gray-500">Code Smells</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{project.metrics.coverage}%</div>
                    <div className="text-[10px] text-gray-500">Coverage</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${project.metrics.coverage}%`,
                          backgroundColor: project.metrics.coverage >= 80 ? '#00c853' : project.metrics.coverage >= 50 ? '#ff9800' : '#d32f2f',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{project.metrics.duplications}%</div>
                    <div className="text-[10px] text-gray-500">Duplications</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{formatNumber(project.metrics.linesOfCode)}</div>
                    <div className="text-[10px] text-gray-500">Lines</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {project.language}
                  </span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs text-gray-400">
                    Last analysis: {timeAgo(project.lastAnalysis)}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
