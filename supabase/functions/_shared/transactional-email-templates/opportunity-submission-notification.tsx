/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface OpportunitySubmissionProps {
  title?: string
  org?: string
  category?: string
  url?: string
  deadline?: string
  cost?: string
  format?: string
  grades?: string
  description?: string
  submitterEmail?: string
  submittedAt?: string
}

const OpportunitySubmission = (p: OpportunitySubmissionProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New HSO opportunity submission: {p.title || 'untitled'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New HSO Opportunity Submission</Heading>
        <Text style={text}>Someone just submitted an opportunity for review.</Text>

        <Section style={panel}>
          <Row label="Title" value={p.title} />
          <Row label="Organization" value={p.org} />
          <Row label="Category" value={p.category} />
          <Row label="Official URL" value={p.url} />
          <Row label="Deadline" value={p.deadline} />
          <Row label="Cost" value={p.cost} />
          <Row label="Format" value={p.format} />
          <Row label="Eligible grades" value={p.grades} />
          <Row label="Submitter email" value={p.submitterEmail} />
          <Row label="Submitted at" value={p.submittedAt} />
          <Row label="Source" value="Submit opportunity page (highschoolopportunity.org/submit)" />
        </Section>

        <Text style={label}>Description / notes</Text>
        <Text style={messageText}>{p.description || '(empty)'}</Text>

        <Hr style={hr} />
        <Text style={muted}>
          Reply directly to{' '}
          <a href={`mailto:${p.submitterEmail || ''}`} style={link}>
            {p.submitterEmail || 'the submitter'}
          </a>{' '}
          from Gmail.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <Text style={rowText}>
      <span style={rowLabel}>{label}: </span>
      <span style={rowValue}>{value}</span>
    </Text>
  )
}

export const template = {
  component: OpportunitySubmission,
  subject: 'New HSO Opportunity Submission',
  to: 'contact@highschoolopportunity.org',
  displayName: 'Opportunity submission notification',
  previewData: {
    title: 'Example Research Program',
    org: 'Example University',
    category: 'Research',
    url: 'https://example.edu/program',
    submitterEmail: 'student@example.com',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  color: '#1a2540',
}
const container = { maxWidth: '600px', margin: '0 auto', padding: '32px 28px 40px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#1a2540', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#2a3552', margin: '0 0 16px' }
const panel = {
  backgroundColor: '#f6f7fb',
  border: '1px solid #eceef3',
  borderRadius: '12px',
  padding: '16px 18px',
  margin: '0 0 20px',
}
const rowText = { fontSize: '14px', lineHeight: '1.55', color: '#2a3552', margin: '0 0 6px' }
const rowLabel = { color: '#6b7388', fontWeight: 600 }
const rowValue = { color: '#1a2540' }
const label = { fontSize: '13px', fontWeight: 700, color: '#6b7388', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '12px 0 6px' }
const messageText = { fontSize: '15px', lineHeight: '1.65', color: '#1a2540', whiteSpace: 'pre-wrap' as const, margin: '0 0 16px' }
const hr = { borderColor: '#eceef3', margin: '24px 0 16px' }
const muted = { fontSize: '13px', color: '#6b7388', margin: 0 }
const link = { color: '#e0613a', textDecoration: 'underline' }