import * as React from 'react';
import Helmet from 'react-helmet';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Alert,
  AlertVariant,
  Spinner,
  EmptyState,
  EmptyStateBody,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { SearchIcon, SyncAltIcon } from '@patternfly/react-icons';
import { apiService } from '../services/api';
import { InvestigationReportSummary } from '../types/api';
import './vibe-ols.css';

export default function VibeOLS() {
  const [investigations, setInvestigations] = React.useState<InvestigationReportSummary[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  const formatReportLength = (length: number): string => {
    if (typeof length !== 'number' || isNaN(length)) {
      return 'Unknown';
    }
    if (length < 1024) {
      return `${length} chars`;
    }
    return `${(length / 1024).toFixed(1)}K chars`;
  };

  const formatParameters = (parameters: Record<string, any>): string => {
    if (!parameters || typeof parameters !== 'object') {
      return 'None';
    }
    const entries = Object.entries(parameters);
    if (entries.length === 0) {
      return 'None';
    }
    return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
  };

  const fetchInvestigations = React.useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);

      const response = await apiService.listInvestigations({ limit: 50 });
      setInvestigations(response.reports || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? `Failed to load investigations: ${err.message}`
          : 'An unexpected error occurred while loading investigations';
      setError(errorMessage);
      console.error('Error fetching investigations:', err);
      setInvestigations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleInvestigationClick = (investigation: InvestigationReportSummary) => {
    // Navigate to the investigation details page
    const detailsUrl = `/vibe-ols-console/investigation/${investigation.id}`;
    window.location.href = detailsUrl;
  };

  React.useEffect(() => {
    fetchInvestigations(true);
  }, [fetchInvestigations]);

  const handleRefresh = () => {
    fetchInvestigations(false);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
        </Helmet>
        <PageSection>
          <div className="vibe-ols__loading">
            <Spinner />
            <div>Loading investigations...</div>
          </div>
        </PageSection>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
        </Helmet>
        <PageSection>
          <Title headingLevel="h1">Investigations Inbox</Title>
          <Alert variant={AlertVariant.danger} title="Error loading investigations">
            <p>{error}</p>
            <Button variant="link" onClick={handleRefresh}>
              Try again
            </Button>
          </Alert>
        </PageSection>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title data-test="vibe-ols-title">Vibe OLS - Investigations</title>
      </Helmet>
      <PageSection>
        <Title headingLevel="h1">Investigations Inbox</Title>
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
                    onClick={handleRefresh}
                    isDisabled={refreshing}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </ToolbarItem>
                <ToolbarItem>
                  <span className="vibe-ols__investigation-count">
                    {investigations.length} investigation{investigations.length !== 1 ? 's' : ''}
                  </span>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            {investigations.length === 0 ? (
              <EmptyState>
                <div className="pf-c-empty-state__icon">
                  <SearchIcon />
                </div>
                <Title headingLevel="h2" size="lg">
                  No investigations found
                </Title>
                <EmptyStateBody>
                  Your investigation inbox is currently empty. New investigations will appear here
                  when they are completed.
                </EmptyStateBody>
                <Button variant="primary" onClick={handleRefresh}>
                  Refresh
                </Button>
              </EmptyState>
            ) : (
              <Table aria-label="Investigations table" variant="compact">
                <Thead>
                  <Tr>
                    <Th>Investigation Subject</Th>
                    <Th>Parameters</Th>
                    <Th>Created</Th>
                    <Th>Report Size</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {investigations.map((investigation) => (
                    <Tr
                      key={investigation.id}
                      isClickable
                      onRowClick={() => handleInvestigationClick(investigation)}
                    >
                      <Td dataLabel="Investigation Subject">
                        <div className="vibe-ols__question">
                          {investigation.question || 'No subject available'}
                        </div>
                      </Td>
                      <Td dataLabel="Parameters">
                        <div className="vibe-ols__parameters">
                          {formatParameters(investigation.parameters)}
                        </div>
                      </Td>
                      <Td dataLabel="Created">{formatDate(investigation.created_at || '')}</Td>
                      <Td dataLabel="Report Size">
                        {formatReportLength(investigation.report_length)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
}
