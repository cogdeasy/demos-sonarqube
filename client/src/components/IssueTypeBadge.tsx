import { Bug, ShieldAlert, Wind } from 'lucide-react';
import type { IssueType } from '../types';

interface IssueTypeBadgeProps {
  type: IssueType;
  showLabel?: boolean;
}

export default function IssueTypeBadge({ type, showLabel = true }: IssueTypeBadgeProps) {
  const config: Record<string, { icon: typeof Bug; label: string; color: string; bg: string }> = {
    BUG: { icon: Bug, label: 'Bug', color: '#d32f2f', bg: '#fde8e8' },
    VULNERABILITY: { icon: ShieldAlert, label: 'Vulnerability', color: '#e65100', bg: '#fff3e0' },
    CODE_SMELL: { icon: Wind, label: 'Code Smell', color: '#558b2f', bg: '#f1f8e9' },
    SECURITY_HOTSPOT: { icon: ShieldAlert, label: 'Hotspot', color: '#f57f17', bg: '#fffde7' },
  };

  const { icon: Icon, label, color, bg } = config[type] || config.CODE_SMELL;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      <Icon size={12} />
      {showLabel && label}
    </span>
  );
}
