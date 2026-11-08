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
import { APPLICATION_RECIPIENT } from '../form-notification-routing.ts'

interface VolunteerSignupProps {
  fullName?: string
  email?: string
  grade?: string
  school?: string
  interests?: string
  hoursPerWeek?: string
  portfolioUrl?: string
  motivation?: string
  age?: string
  city?: string
  country?: string
  timeZone?: string
  contribution?: string
  about?: string
  experience?: string
  referralSource?: string
  resumeName?: string
  resumeUrl?: string
  resumeNote?: string
  submittedAt?: string
}

const VolunteerSignup = (p: VolunteerSignupProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New HSO internship application: {p.fullName || 'unnamed'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New HSO Internship Application</Heading>
        <Text style={text}>A student just applied for an HSO internship.</Text>

        <Section style={panel}>
          <Row label="Name" value={p.fullName} />
          <Row label="Email" value={p.email} />
          <Row label="Age" value={p.age} />
          <Row label="School" value={p.school} />
          <Row label="Grade" value={p.grade} />
          <Row label="Location" value={[p.city, p.country].filter(Boolean).join(', ') || undefined} />
          <Row label="Time zone" value={p.timeZone} />
          <Row label="Role(s)" value={p.interests} />
          <Row label="Time per week" value={p.hoursPerWeek} />
          <Row label="Portfolio / LinkedIn" value={p.portfolioUrl} />
          <Row label="Heard about HSO from" value={p.referralSource} />
          <Row label="Submitted at" value={p.submittedAt} />
          <Row label="Source" value="Internship page (highschoolopportunity.org/volunteer)" />
        </Section>

        <Text style={label}>Resume</Text>
        {p.resumeUrl ? (
          <Text style={messageText}>
            <a href={p.resumeUrl} style={link}>
              Download {p.resumeName || 'resume'}
            </a>{' '}
            (link works for 60 days)
          </Text>
        ) : (
          <Text style={messageText}>{p.resumeNote || 'No resume attached.'}</Text>
        )}

        <Text style={label}>Why they want to join</Text>
        <Text style={messageText}>{p.motivation || '(empty)'}</Text>

        {p.contribution ? (
          <>
            <Text style={label}>What they'd bring to the team</Text>
            <Text style={messageText}>{p.contribution}</Text>
          </>
        ) : null}

        {p.about ? (
          <>
            <Text style={label}>About them</Text>
            <Text style={messageText}>{p.about}</Text>
          </>
        ) : null}

        {p.experience ? (
          <>
            <Text style={label}>Something they built, led or are proud of</Text>
            <Text style={messageText}>{p.experience}</Text>
          </>
        ) : null}

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
  subject: 'New HSO Internship Application',
  to: APPLICATION_RECIPIENT,
  displayName: 'Volunteer signup notification',
  previewData: {
    fullName: 'Jordan Rivera',
    email: 'student@example.com',
    grade: '11',
    school: 'Example High School',
    interests: 'Opportunity Research Associate, Social Media Manager',
    hoursPerWeek: '3-5 hours',
    motivation: 'I used HSO to find my summer research program and want to help other students find theirs.',
    age: '16',
    city: 'Austin',
    country: 'United States',
    timeZone: 'America/Chicago',
    contribution: 'I run my school newsletter and like checking details, so I can keep a category accurate.',
    about: 'I play cello, tutor middle schoolers in math, and like working through a checklist.',
    experience: 'Started a peer tutoring club that now has 30 members.',
    referralSource: 'School counselor',
    resumeName: 'Jordan-Rivera-Resume.pdf',
    resumeUrl: 'https://example.com/resume.pdf',
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
