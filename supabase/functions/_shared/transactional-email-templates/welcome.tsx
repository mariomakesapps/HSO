/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
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

const SITE_URL = 'https://highschoolopportunity.org'

interface WelcomeEmailProps {
  firstName?: string
}

const WelcomeEmail = ({ firstName }: WelcomeEmailProps) => {
  const greetingName = firstName && firstName.trim().length > 0 ? firstName.trim() : 'there'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Welcome to HSO — your opportunity search starts here</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandSection}>
            <Text style={brandMark}>
              <span style={{ color: '#1a2540' }}>H</span>
              <span style={{ color: '#e0613a' }}>S</span>
              <span style={{ color: '#1f5a3d' }}>O</span>
            </Text>
          </Section>

          <Heading style={h1}>Hi {greetingName},</Heading>

          <Text style={text}>Welcome to HSO — High School Opportunity.</Text>

          <Text style={text}>
            You now have access to a growing catalog of internships, research programs,
            scholarships, competitions, volunteer opportunities, and summer programs built
            for high school students.
          </Text>

          <Text style={subhead}>With HSO, you can:</Text>
          <ul style={list}>
            <li style={listItem}>Browse curated opportunities across the U.S.</li>
            <li style={listItem}>Save programs you want to revisit</li>
            <li style={listItem}>Explore collections organized by major, career path, and interest</li>
            <li style={listItem}>Open official application links faster</li>
            <li style={listItem}>Track opportunities that fit your goals</li>
          </ul>

          <Section style={{ textAlign: 'center', margin: '32px 0 8px' }}>
            <Button href={SITE_URL} style={button}>
              Start exploring
            </Button>
          </Section>

          <Text style={muted}>
            Or open this link directly: <a href={SITE_URL} style={link}>{SITE_URL}</a>
          </Text>

          <Hr style={hr} />

          <Text style={text}>We’re glad you’re here.</Text>
          <Text style={signature}>The HSO Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: WelcomeEmail,
  subject: 'Welcome to HSO — your opportunity search starts here',
  displayName: 'Welcome to HSO',
  previewData: { firstName: 'Alex' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  color: '#1a2540',
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 28px 40px',
}
const brandSection = { marginBottom: '24px' }
const brandMark = {
  fontSize: '28px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  margin: 0,
}
const h1 = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#1a2540',
  margin: '0 0 16px',
  lineHeight: '1.25',
}
const text = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#2a3552',
  margin: '0 0 16px',
}
const subhead = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#1a2540',
  margin: '20px 0 8px',
}
const list = {
  paddingLeft: '20px',
  margin: '0 0 16px',
  color: '#2a3552',
}
const listItem = {
  fontSize: '15px',
  lineHeight: '1.6',
  marginBottom: '6px',
}
const button = {
  backgroundColor: '#1a2540',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '12px',
  display: 'inline-block',
}
const link = { color: '#e0613a', textDecoration: 'underline' }
const muted = {
  fontSize: '13px',
  color: '#6b7388',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}
const hr = {
  borderColor: '#eceef3',
  margin: '28px 0 20px',
}
const signature = {
  fontSize: '15px',
  color: '#1a2540',
  fontWeight: 600,
  margin: 0,
}