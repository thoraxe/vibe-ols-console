import * as React from 'react';
import Helmet from 'react-helmet';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { SyncAltIcon } from '@patternfly/react-icons';
import { apiService } from '../services/api';
// import { InvestigationReportSummary } from '../types/api';
import './vibe-ols.css';

export default function VibeOLS() {
  // Temporarily commented out API-related state and logic
  // const [investigations, setInvestigations] = React.useState<InvestigationReportSummary[]>([]);
  // const [loading, setLoading] = React.useState<boolean>(true);
  // const [error, setError] = React.useState<string | null>(null);
  // const [refreshing, setRefreshing] = React.useState<boolean>(false);

  // Background API call - doesn't affect UI
  React.useEffect(() => {
    const testApiCall = async () => {
      try {
        console.log('Making background API call...');
        const response = await apiService.listInvestigations({ limit: 10 });
        console.log('API call successful:', response);
      } catch (err) {
        console.log('API call failed:', err);
      }
    };

    testApiCall();
  }, []);

  // const formatDate = (dateString: string): string => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  //   } catch {
  //     return dateString;
  //   }
  // };

  // const formatReportLength = (length: number): string => {
  //   if (typeof length !== 'number' || isNaN(length)) {
  //     return 'Unknown';
  //   }
  //   if (length < 1024) {
  //     return `${length} chars`;
  //   }
  //   return `${(length / 1024).toFixed(1)}K chars`;
  // };

  // const formatParameters = (parameters: Record<string, any>): string => {
  //   if (!parameters || typeof parameters !== 'object') {
  //     return 'None';
  //   }
  //   const entries = Object.entries(parameters);
  //   if (entries.length === 0) {
  //     return 'None';
  //   }
  //   return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
  // };

  // const fetchInvestigations = React.useCallback(async (showSpinner = true) => {
  //   try {
  //     if (showSpinner) {
  //       setLoading(true);
  //     } else {
  //       setRefreshing(true);
  //     }
  //     setError(null);

  //     const response = await apiService.listInvestigations({ limit: 50 });
  //     setInvestigations(response.reports || []);
  //   } catch (err) {
  //     const errorMessage =
  //       err instanceof APIError
  //         ? `Failed to load investigations: ${err.message}`
  //         : 'An unexpected error occurred while loading investigations';
  //     setError(errorMessage);
  //     console.error('Error fetching investigations:', err);
  //     setInvestigations([]);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // }, []);

  // React.useEffect(() => {
  //   fetchInvestigations(true);
  // }, [fetchInvestigations]);

  // const handleRefresh = () => {
  //   fetchInvestigations(false);
  // };

  // Placeholder data for testing
  const sampleInvestigations = [
    {
      id: 'sample-1',
      question: 'Why are pods failing in production namespace?',
      parameters: { namespace: 'production', severity: 'high' },
      created_at: '2024-01-15T10:30:00Z',
      report_length: 4567,
    },
    {
      id: 'sample-2',
      question: 'Network connectivity issues between services',
      parameters: { cluster: 'main', region: 'us-east-1' },
      created_at: '2024-01-14T15:45:00Z',
      report_length: 2345,
    },
  ];

  // if (loading) {
  //   return (
  //     <>
  //       <Helmet>
  //         <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
  //       </Helmet>
  //       <PageSection>
  //         <div className="vibe-ols__loading">
  //           <Spinner />
  //           <div>Loading investigations...</div>
  //         </div>
  //       </PageSection>
  //     </>
  //   );
  // }

  // if (error) {
  //   return (
  //     <>
  //       <Helmet>
  //         <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
  //       </Helmet>
  //       <PageSection>
  //         <Title headingLevel="h1">Investigations Inbox</Title>
  //         <Alert variant={AlertVariant.danger} title="Error loading investigations">
  //           <p>{error}</p>
  //           <Button variant="link" onClick={handleRefresh}>
  //             Try again
  //           </Button>
  //         </Alert>
  //       </PageSection>
  //     </>
  //   );
  // }

  return (
    <>
      <Helmet>
        <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
      </Helmet>
      <PageSection>
        <Title headingLevel="h1">Investigations Inbox</Title>
        <p>
          This is a placeholder for the Vibe OLS investigations inbox. API calls are being tested in
          the background.
        </p>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <Button
                    variant="secondary"
                    icon={<SyncAltIcon />}
                    onClick={() => console.log('Refresh clicked (placeholder)')}
                  >
                    Refresh
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <span className="vibe-ols__investigation-count">
                    {sampleInvestigations.length} sample investigations
                  </span>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            <Table aria-label="Sample investigations table" variant="compact">
              <Thead>
                <Tr>
                  <Th>Question</Th>
                  <Th>Parameters</Th>
                  <Th>Created</Th>
                  <Th>Report Size</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sampleInvestigations.map((investigation) => (
                  <Tr key={investigation.id}>
                    <Td dataLabel="Question">
                      <div className="vibe-ols__question">{investigation.question}</div>
                      <div className="vibe-ols__question-id">ID: {investigation.id}</div>
                    </Td>
                    <Td dataLabel="Parameters">
                      <div className="vibe-ols__parameters">
                        {Object.entries(investigation.parameters)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </div>
                    </Td>
                    <Td dataLabel="Created">
                      {new Date(investigation.created_at).toLocaleDateString()}
                    </Td>
                    <Td dataLabel="Report Size">{investigation.report_length} chars</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
}
