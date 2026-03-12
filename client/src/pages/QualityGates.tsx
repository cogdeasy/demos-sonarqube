import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Shield } from 'lucide-react';
import Header from '../components/Header';
import fetchApi from '../utils/api';
import type { QualityGate, ApiResponse } from '../types';

const METRIC_LABELS: Record<string, string> = {
  new_reliability_rating: 'Reliability Rating on New Code',
  new_security_rating: 'Security Rating on New Code',
  new_maintainability_rating: 'Maintainability Rating on New Code',
  new_coverage: 'Coverage on New Code',
  new_duplicated_lines_density: 'Duplicated Lines on New Code',
  new_security_hotspots_reviewed: 'Security Hotspots Reviewed on New Code',
  reliability_rating: 'Reliability Rating',
  security_rating: 'Security Rating',
  sqale_rating: 'Maintainability Rating',
};

const OPERATOR_LABELS: Record<string, string> = {
  GT: 'is greater than',
  LT: 'is less than',
};

export default function QualityGates() {
  const [gates, setGates] = useState<QualityGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<ApiResponse<QualityGate[]>>('/quality-gates').then((res) => {
      setGates(res.data);
      if (res.data.length > 0) {
        setSelectedGate(res.data[0].id);
      }
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

  const activeGate = gates.find((g) => g.id === selectedGate);

  const passedConditions = activeGate?.conditions.filter((c) => c.status === 'OK').length || 0;
  const failedConditions = activeGate?.conditions.filter((c) => c.status === 'ERROR').length || 0;

  return (
    <div>
      <Header title="Quality Gates" subtitle="Define quality requirements for your projects" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Gate list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">Quality Gates</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {gates.map((gate) => (
                  <button
                    key={gate.id}
                    onClick={() => setSelectedGate(gate.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedGate === gate.id ? 'bg-blue-50 border-l-3 border-[#4b9fd5]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={16} className={selectedGate === gate.id ? 'text-[#4b9fd5]' : 'text-gray-400'} />
                      <span className={`text-sm font-medium ${selectedGate === gate.id ? 'text-[#4b9fd5]' : 'text-gray-700'}`}>
                        {gate.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 ml-6">
                      {gate.isDefault && (
                        <span className="flex items-center gap-1 text-[10px] text-[#ff9800]">
                          <Star size={10} /> Default
                        </span>
                      )}
                      {gate.isBuiltIn && (
                        <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                          Built-in
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 ml-6">
                      {gate.conditions.length} conditions
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gate details */}
          <div className="lg:col-span-3">
            {activeGate && (
              <div className="space-y-6">
                {/* Gate header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Shield size={24} className="text-[#4b9fd5]" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{activeGate.name}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          {activeGate.isDefault && (
                            <span className="flex items-center gap-1 text-xs text-[#ff9800] bg-orange-50 px-2 py-0.5 rounded">
                              <Star size={12} /> Default
                            </span>
                          )}
                          {activeGate.isBuiltIn && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Built-in
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{passedConditions}</div>
                        <div className="text-[10px] text-gray-500">Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{failedConditions}</div>
                        <div className="text-[10px] text-gray-500">Failed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Conditions ({activeGate.conditions.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activeGate.conditions.map((condition) => (
                      <div key={condition.id} className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {condition.status === 'OK' ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : condition.status === 'ERROR' ? (
                            <XCircle size={20} className="text-red-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            {METRIC_LABELS[condition.metric] || condition.metric}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {OPERATOR_LABELS[condition.operator] || condition.operator}{' '}
                            <span className="font-mono font-semibold">{condition.error}</span>
                          </div>
                        </div>
                        {condition.actualValue && (
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              condition.status === 'OK' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {condition.actualValue}
                            </div>
                            <div className="text-[10px] text-gray-400">Actual</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
