import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom-v5-compat';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Alert,
  AlertVariant,
  Spinner,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { ArrowLeftIcon } from '@patternfly/react-icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { apiService } from '../services/api';
import { InvestigationReportDetail } from '../types/api';
import './vibe-ols.css';

export default function InvestigationDetails() {
  const { t } = useTranslation('plugin__console-plugin-template');
  const { id: investigationId } = useParams<{ id: string }>();

  const [investigation, setInvestigation] = React.useState<InvestigationReportDetail | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
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

  // Custom code component for ReactMarkdown with syntax highlighting
  const CodeComponent = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';

    return !inline ? (
      <SyntaxHighlighter style={oneDark} language={language} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const fetchInvestigationDetails = React.useCallback(async () => {
    if (!investigationId) {
      setError('No investigation ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const details = await apiService.getInvestigationDetail(investigationId);
      setInvestigation(details);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? `Failed to load investigation details: ${err.message}`
          : 'An unexpected error occurred while loading investigation details';
      setError(errorMessage);
      console.error('Error fetching investigation details:', err);
    } finally {
      setLoading(false);
    }
  }, [investigationId]);

  React.useEffect(() => {
    fetchInvestigationDetails();
  }, [fetchInvestigationDetails]);

  const handleBackToList = () => {
    // Navigate back to the main investigations list
    window.location.href = '/vibe-ols-console';
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title data-test="investigation-details-title">{t('Investigation Details')}</title>
        </Helmet>
        <PageSection>
          <div className="vibe-ols__loading">
            <Spinner />
            <div>Loading investigation details...</div>
          </div>
        </PageSection>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title data-test="investigation-details-title">{t('Investigation Details')}</title>
        </Helmet>
        <PageSection>
          <Breadcrumb>
            <BreadcrumbItem>
              <Button variant="link" icon={<ArrowLeftIcon />} onClick={handleBackToList}>
                Investigations
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Details</BreadcrumbItem>
          </Breadcrumb>
          <Title headingLevel="h1">Investigation Details</Title>
          <Alert variant={AlertVariant.danger} title="Error loading investigation details">
            <p>{error}</p>
            <Button variant="link" onClick={fetchInvestigationDetails}>
              Try again
            </Button>
          </Alert>
        </PageSection>
      </>
    );
  }

  if (!investigation) {
    return (
      <>
        <Helmet>
          <title data-test="investigation-details-title">{t('Investigation Details')}</title>
        </Helmet>
        <PageSection>
          <Breadcrumb>
            <BreadcrumbItem>
              <Button variant="link" icon={<ArrowLeftIcon />} onClick={handleBackToList}>
                Investigations
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Details</BreadcrumbItem>
          </Breadcrumb>
          <Title headingLevel="h1">Investigation Details</Title>
          <Alert variant={AlertVariant.warning} title="Investigation not found">
            <p>The requested investigation could not be found.</p>
            <Button variant="link" onClick={handleBackToList}>
              Back to investigations
            </Button>
          </Alert>
        </PageSection>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title data-test="investigation-details-title">
          {investigation.question} - {t('Investigation Details')}
        </title>
      </Helmet>
      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" icon={<ArrowLeftIcon />} onClick={handleBackToList}>
              Investigations
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Details</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1">{investigation.question}</Title>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <div className="vibe-ols__investigation-details">
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Investigation Subject</DescriptionListTerm>
                  <DescriptionListDescription>{investigation.question}</DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Investigation ID</DescriptionListTerm>
                  <DescriptionListDescription>
                    <code>{investigation.id}</code>
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Created</DescriptionListTerm>
                  <DescriptionListDescription>
                    {formatDate(investigation.created_at)}
                  </DescriptionListDescription>
                </DescriptionListGroup>

                <DescriptionListGroup>
                  <DescriptionListTerm>Parameters</DescriptionListTerm>
                  <DescriptionListDescription>
                    {formatParameters(investigation.parameters)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </div>
          </CardBody>
        </Card>

        <Card style={{ marginTop: 'var(--pf-global--spacer--lg)' }}>
          <CardBody>
            <Title
              headingLevel="h2"
              size="lg"
              style={{ marginBottom: 'var(--pf-global--spacer--md)' }}
            >
              Investigation Report
            </Title>
            <div className="vibe-ols__markdown-content">
              <ReactMarkdown
                components={{
                  code: CodeComponent,
                }}
              >
                {investigation.report_text || 'No report content available'}
              </ReactMarkdown>
            </div>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
}
