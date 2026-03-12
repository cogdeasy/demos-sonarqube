import { getSeverityColor } from '../utils/formatters';
import type { IssueSeverity } from '../types';

interface SeverityBadgeProps {
  severity: IssueSeverity;
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const color = getSeverityColor(severity);
  const labels: Record<string, string> = {
    BLOCKER: 'Blocker',
    CRITICAL: 'Critical',
    MAJOR: 'Major',
    MINOR: 'Minor',
    INFO: 'Info',
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
      />
      {labels[severity]}
    </span>
  );
}
