export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    BLOCKER: '#d32f2f',
    CRITICAL: '#d32f2f',
    MAJOR: '#ff9800',
    MINOR: '#4caf50',
    INFO: '#2196f3',
  };
  return colors[severity] || '#999';
}

export function getRatingColor(rating: string): string {
  const colors: Record<string, string> = {
    A: '#00c853',
    B: '#7cb342',
    C: '#ff9800',
    D: '#ff5722',
    E: '#d32f2f',
  };
  return colors[rating] || '#999';
}

export function getQualityGateColor(status: string): string {
  const colors: Record<string, string> = {
    OK: '#00c853',
    WARN: '#ff9800',
    ERROR: '#d32f2f',
    NONE: '#999',
  };
  return colors[status] || '#999';
}

export function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    BUG: 'Bug',
    VULNERABILITY: 'Shield',
    CODE_SMELL: 'Wind',
    SECURITY_HOTSPOT: 'Flame',
  };
  return icons[type] || 'Circle';
}
