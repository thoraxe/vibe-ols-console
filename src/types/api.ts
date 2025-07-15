// API types based on the vibe-ols OpenAPI specification

export interface InvestigationReportSummary {
  id: string;
  question: string;
  parameters: Record<string, any>;
  created_at: string;
  report_length: number;
}

export interface InvestigationReportDetail {
  id: string;
  question: string;
  parameters: Record<string, any>;
  report_text: string;
  created_at: string;
}

export interface InvestigationReportListResponse {
  reports: InvestigationReportSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface InvestigationReportDeleteResponse {
  id: string;
  status: string;
  deleted: boolean;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// API request parameters
export interface ListInvestigationsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

// API error response
export interface APIError {
  message: string;
  status: number;
}
