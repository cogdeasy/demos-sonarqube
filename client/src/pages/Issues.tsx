import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import IssueTypeBadge from '../components/IssueTypeBadge';
import SeverityBadge from '../components/SeverityBadge';
import fetchApi from '../utils/api';
import { timeAgo } from '../utils/formatters';
import type { Issue, ApiResponse } from '../types';

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (search) params.search = search;
    if (typeFilter) params.type = typeFilter;
    if (severityFilter) params.severity = severityFilter;
    if (statusFilter) params.status = statusFilter;
    if (languageFilter) params.language = languageFilter;

    fetchApi<ApiResponse<Issue[]>>('/issues', params).then((res) => {
      setIssues(res.data);
      setTotal(res.total || 0);
      setLoading(false);
    });
  }, [search, typeFilter, severityFilter, statusFilter, languageFilter, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Header title="Issues" subtitle={`${total} issues found`} />

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Types</option>
              <option value="BUG">Bug</option>
              <option value="VULNERABILITY">Vulnerability</option>
              <option value="CODE_SMELL">Code Smell</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Severities</option>
              <option value="BLOCKER">Blocker</option>
              <option value="CRITICAL">Critical</option>
              <option value="MAJOR">Major</option>
              <option value="MINOR">Minor</option>
              <option value="INFO">Info</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select
              value={languageFilter}
              onChange={(e) => { setLanguageFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#4b9fd5]"
            >
              <option value="">All Languages</option>
              <option value="Java">Java</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Go">Go</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Kotlin">Kotlin</option>
              <option value="Scala">Scala</option>
              <option value="C#">C#</option>
            </select>
          </div>
        </div>

        {/* Issues list */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b9fd5]" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
              {issues.map((issue) => (
                <div key={issue.key} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <IssueTypeBadge type={issue.type} showLabel={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{issue.message}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs text-gray-500 font-mono">
                          {issue.component.split(':').pop()}
                        </span>
                        <span className="text-xs text-gray-400">L{issue.line}</span>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-[#4b9fd5] font-mono">{issue.rule}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <SeverityBadge severity={issue.severity} />
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          issue.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                          issue.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' :
                          issue.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                          issue.status === 'CLOSED' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {issue.status}
                        </span>
                        {issue.resolution && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                            {issue.resolution}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{issue.effort}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-gray-400">{issue.author}</span>
                        <span className="text-[11px] text-gray-300">|</span>
                        <span className="text-[11px] text-gray-400">{timeAgo(issue.creationDate)}</span>
                        <span className="text-[11px] text-gray-300">|</span>
                        <span className="text-[11px] text-gray-400">{issue.language}</span>
                        <div className="flex gap-1 ml-auto">
                          {issue.tags.map((tag) => (
                            <span key={tag} className="px-1 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-500">
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded text-sm ${
                        p === page
                          ? 'bg-[#4b9fd5] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
