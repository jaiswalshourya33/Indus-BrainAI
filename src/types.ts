export type ViewType = 'dashboard' | 'copilot' | 'graph' | 'compliance' | 'rca';

export interface Incident {
  id: string;
  title: string;
  location: string;
  time: string;
  level: 'CRITICAL' | 'WARNING' | 'NOTICE';
  status: 'active' | 'resolved' | 'monitoring';
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: string;
  sourceCitation?: string;
  maintenanceRef?: string;
  recommendedAction?: {
    action: string;
    workOrder?: string;
  };
}

export interface ComplianceAsset {
  id: string;
  name: string;
  assetId: string;
  status: 'NON-COMPLIANT' | 'PENDING' | 'COMPLIANT';
  lastAudit: string;
  nextDue: string;
  riskScore: 'CRITICAL' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
}
