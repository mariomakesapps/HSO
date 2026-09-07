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

interface VolunteerSignupProps {
  fullName?: string
  email?: string
  grade?: string
  school?: string
  interests?: string
  hoursPerWeek?: string
  portfolioUrl?: string
  motivation?: string
  submittedAt?: string
}

const VolunteerSignup = (p: VolunteerSignupProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New HSO volunteer signup: {p.fullName || 'unnamed'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New HSO Volunteer Signup</Heading>
        <Text style={text}>A student just applied to volunteer with HSO.</Text>

        <Section style={panel}>
          <Row label="Name" value={p.fullName} />
          <Row label="Email" value={p.email} />
          <Row label="Grade" value={p.grade} />
          <Row label="School" value={p.school} />
          <Row label="Role(s)" value={p.interests} />
          <Row label="Time per week" value={p.hoursPerWeek} />
          <Row label="Portfolio / LinkedIn" value={p.portfolioUrl} />
          <Row label="Submitted at" value={p.submittedAt} />
          <Row label="Source" value="Volunteer page (highschoolopportunity.org/volunteer)" />
        </Section>

        <Text style={label}>Why they want to help</Text>
        <Text style={messageText}>{p.motivation || '(empty)'}</Text>

        <Hr style={hr} />
        <Text style={muted}>
          Reply directly to{' '}
          <a href={`mailto:${p.email || ''}`} style={link}>
            {p.email || 'the applicant'}
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
  component: VolunteerSignup,
  subject: 'New HSO Volunteer Signup',
  to: 'highschoolopportunity@gmail.com',
  displayName: 'Volunteer signup notification',
  previewData: {
    fullName: 'Jordan Rivera',
    email: 'student@example.com',
    grade: '11',
    school: 'Example High School',
    interests: 'Opportunity Research Associate, Social Media Manager',
    hoursPerWeek: '3-5 hours',
    motivation: 'I used HSO to find my summer research program and want to help other students find theirs.',
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
