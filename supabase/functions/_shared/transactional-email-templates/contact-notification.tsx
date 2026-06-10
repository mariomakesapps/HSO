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

interface ContactNotificationProps {
  reason?: string
  email?: string
  message?: string
  relatedUrl?: string
  submittedAt?: string
}

const ContactNotification = ({
  reason,
  email,
  message,
  relatedUrl,
  submittedAt,
}: ContactNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New HSO contact form message from {email || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New HSO Contact Form Message</Heading>
        <Text style={text}>A visitor just submitted the HSO contact form.</Text>

        <Section style={panel}>
          <Row label="Reason" value={reason} />
          <Row label="From email" value={email} />
          <Row label="Related URL" value={relatedUrl} />
          <Row label="Submitted at" value={submittedAt} />
          <Row label="Source" value="Contact page (highschoolopportunity.org/contact)" />
        </Section>

        <Text style={label}>Message</Text>
        <Text style={messageText}>{message || '(empty)'}</Text>

        <Hr style={hr} />
        <Text style={muted}>
          Reply directly to <a href={`mailto:${email || ''}`} style={link}>{email || 'the visitor'}</a> from Gmail.
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
  component: ContactNotification,
  subject: 'New HSO Contact Form Message',
  to: 'highschoolopportunity@gmail.com',
  displayName: 'Contact form notification',
  previewData: {
    reason: 'General contact',
    email: 'student@example.com',
    message: 'Hi! I love HSO.',
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