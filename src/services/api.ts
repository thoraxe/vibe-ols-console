import {
  InvestigationReportListResponse,
  InvestigationReportDetail,
  InvestigationReportDeleteResponse,
  ListInvestigationsParams,
} from '../types/api';

// Base API URL - hardcoded for now since process.env isn't available in console plugins
const API_BASE_URL = 'http://localhost:8000';

class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

class APIService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new APIError(`HTTP ${response.status}: ${errorData}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Network error: ${error.message}`, 0);
    }
  }

  /**
   * Fetch list of investigation reports from the inbox
   */
  async listInvestigations(
    params: ListInvestigationsParams = {},
  ): Promise<InvestigationReportListResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params.offset !== undefined) {
      searchParams.append('offset', params.offset.toString());
    }
    if (params.search) {
      searchParams.append('search', params.search);
    }

    const queryString = searchParams.toString();
    const endpoint = `/inbox/reports${queryString ? `?${queryString}` : ''}`;

    return this.request<InvestigationReportListResponse>(endpoint);
  }

  /**
   * Fetch detailed information about a specific investigation report
   */
  async getInvestigationDetail(reportId: string): Promise<InvestigationReportDetail> {
    return this.request<InvestigationReportDetail>(`/inbox/reports/${reportId}`);
  }

  /**
   * Delete a specific investigation report
   */
  async deleteInvestigation(reportId: string): Promise<InvestigationReportDeleteResponse> {
    return this.request<InvestigationReportDeleteResponse>(`/inbox/reports/${reportId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiService = new APIService();

// Export the class for testing purposes
export { APIService, APIError };
