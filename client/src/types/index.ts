export interface Project {
  key: string;
  name: string;
  qualifier: string;
  visibility: 'public' | 'private';
  lastAnalysis: string;
  revision: string;
  managed: boolean;
  qualityGate: QualityGateStatus;
  metrics: ProjectMetrics;
  tags: string[];
  language: string;
}

export interface ProjectMetrics {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  securityHotspots: number;
  coverage: number;
  duplications: number;
  linesOfCode: number;
  reliabilityRating: Rating;
  securityRating: Rating;
  maintainabilityRating: Rating;
  securityReviewRating: Rating;
  complexity: number;
  cognitiveComplexity: number;
  technicalDebt: string;
  newBugs: number;
  newVulnerabilities: number;
  newCodeSmells: number;
  newCoverage: number;
  newDuplications: number;
  newLines: number;
}

export type Rating = 'A' | 'B' | 'C' | 'D' | 'E';
export type QualityGateStatus = 'OK' | 'WARN' | 'ERROR' | 'NONE';
export type IssueSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
export type IssueType = 'BUG' | 'VULNERABILITY' | 'CODE_SMELL' | 'SECURITY_HOTSPOT';
export type IssueStatus = 'OPEN' | 'CONFIRMED' | 'REOPENED' | 'RESOLVED' | 'CLOSED';

export interface Issue {
  key: string;
  rule: string;
  severity: IssueSeverity;
  component: string;
  project: string;
  line: number;
  message: string;
  type: IssueType;
  status: IssueStatus;
  resolution: string | null;
  effort: string;
  debt: string;
  author: string;
  tags: string[];
  creationDate: string;
  updateDate: string;
  language: string;
}

export interface SecurityHotspot {
  key: string;
  component: string;
  project: string;
  securityCategory: string;
  vulnerabilityProbability: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TO_REVIEW' | 'REVIEWED' | 'SAFE' | 'FIXED';
  line: number;
  message: string;
  author: string;
  creationDate: string;
  updateDate: string;
  rule: string;
}

export interface Rule {
  key: string;
  name: string;
  type: IssueType;
  severity: IssueSeverity;
  language: string;
  languageName: string;
  status: string;
  tags: string[];
  description: string;
}

export interface QualityGate {
  id: string;
  name: string;
  isDefault: boolean;
  isBuiltIn: boolean;
  conditions: QualityGateCondition[];
}

export interface QualityGateCondition {
  id: string;
  metric: string;
  operator: 'GT' | 'LT';
  error: string;
  actualValue?: string;
  status?: 'OK' | 'ERROR';
}

export interface ActivityEvent {
  date: string;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplications: number;
  linesOfCode: number;
  securityHotspots: number;
  technicalDebtMinutes: number;
}

export interface MetricsOverview {
  totalProjects: number;
  totalLinesOfCode: number;
  totalBugs: number;
  totalVulnerabilities: number;
  totalCodeSmells: number;
  totalSecurityHotspots: number;
  avgCoverage: number;
  avgDuplications: number;
  openIssues: number;
  qualityGateDistribution: { OK: number; WARN: number; ERROR: number };
  languageDistribution: Record<string, { projects: number; lines: number }>;
  ratingDistribution: {
    reliability: Record<string, number>;
    security: Record<string, number>;
    maintainability: Record<string, number>;
  };
  hotspotsByStatus: { toReview: number; reviewed: number; safe: number; fixed: number };
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}
