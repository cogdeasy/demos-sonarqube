import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getQualityGateColor } from '../utils/formatters';
import type { QualityGateStatus } from '../types';

interface QualityGateBadgeProps {
  status: QualityGateStatus;
  showLabel?: boolean;
}

export default function QualityGateBadge({ status, showLabel = true }: QualityGateBadgeProps) {
  const color = getQualityGateColor(status);
  const labels: Record<string, string> = {
    OK: 'Passed',
    WARN: 'Warning',
    ERROR: 'Failed',
    NONE: 'None',
  };
  const icons: Record<string, typeof CheckCircle> = {
    OK: CheckCircle,
    WARN: AlertTriangle,
    ERROR: XCircle,
    NONE: AlertTriangle,
  };

  const Icon = icons[status] || AlertTriangle;

  return (
    <div className="flex items-center gap-1.5">
      <Icon size={16} style={{ color }} />
      {showLabel && (
        <span className="text-sm font-medium" style={{ color }}>
          {labels[status]}
        </span>
      )}
    </div>
  );
}
