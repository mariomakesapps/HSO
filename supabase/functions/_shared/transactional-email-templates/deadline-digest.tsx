/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface DigestItem {
  title?: string
  org?: string
  summary?: string
  category?: string
  deadlineLabel?: string
  daysLeft?: number
  cost?: string
  format?: string
  gradesLabel?: string
  url?: string
}

interface DeadlineDigestProps {
  monthLabel?: string
  items?: DigestItem[]
  unsubscribeUrl?: string
}

const DeadlineDigest = ({ monthLabel, items = [], unsubscribeUrl }: DeadlineDigestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`${items.length} opportunities on HSO close soon — deadlines, costs and links inside.`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Deadlines closing soon</Heading>
        <Text style={text}>
          {monthLabel ? `${monthLabel} round-up. ` : ''}
          {items.length} program{items.length === 1 ? '' : 's'} in the HSO catalog close
          in the weeks ahead. Each one lists the exact deadline and what it costs.
        </Text>

        {items.map((item, i) => (
          <Section key={i} style={card}>
            <Text style={cardTitle}>
              {item.url ? (
                <Link href={item.url} style={link}>{item.title}</Link>
              ) : (
                item.title
              )}
            </Text>
            {item.org ? <Text style={cardOrg}>{item.org}</Text> : null}
            {item.summary ? <Text style={cardBody}>{item.summary}</Text> : null}
            <Text style={cardMeta}>
              Deadline: {item.deadlineLabel}
              {typeof item.daysLeft === 'number' ? ` (${item.daysLeft} days left)` : ''}
              {item.cost ? ` · ${item.cost}` : ''}
              {item.format ? ` · ${item.format}` : ''}
              {item.gradesLabel ? ` · Grades ${item.gradesLabel}` : ''}
              {item.category ? ` · ${item.category}` : ''}
            </Text>
          </Section>
        ))}

        <Text style={text}>
          Browse everything else at{' '}
          <Link href="https://highschoolopportunity.org" style={link}>
            highschoolopportunity.org
          </Link>
          .
        </Text>

        <Hr style={hr} />
        <Text style={muted}>
          You are receiving this because you signed up at highschoolopportunity.org.
          HSO lists these programs and is not affiliated with or endorsed by any
          organization named above. Always confirm details on the program's own page.
          {unsubscribeUrl ? (
            <>
              {' '}
              <Link href={unsubscribeUrl} style={link}>Unsubscribe</Link>.
            </>
          ) : null}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: DeadlineDigest,
  subject: (data: Record<string, any>) =>
    `${Array.isArray(data?.items) ? data.items.length : 5} HSO deadlines closing soon`,
  displayName: 'Monthly deadline digest',
  previewData: {
    monthLabel: 'September 2026',
    items: [
      {
        title: 'Hinksey Business Essay Competition',
        org: 'Hinksey Labs',
        summary: 'Write a business case study on a company facing major change.',
        category: 'Competition',
        deadlineLabel: 'October 14, 2026',
        daysLeft: 24,
        cost: 'Free',
        format: 'Online',
        gradesLabel: '9-12',
        url: 'https://www.hinkseylabs.com/competition',
      },
    ],
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  color: '#1a2540',
}
const container = { maxWidth: '600px', margin: '0 auto', padding: '32px 28px 40px' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#1a2540', margin: '0 0 16px' }
const text = { fontSize: '15px', lineHeight: '1.6', color: '#2a3552', margin: '0 0 20px' }
const card = {
  backgroundColor: '#f6f7fb',
  border: '1px solid #eceef3',
  borderRadius: '12px',
  padding: '16px 18px',
  margin: '0 0 14px',
}
const cardTitle = { fontSize: '16px', fontWeight: 700, color: '#1a2540', margin: '0 0 2px' }
const cardOrg = { fontSize: '13px', color: '#6b7388', margin: '0 0 8px' }
const cardBody = { fontSize: '14px', lineHeight: '1.6', color: '#2a3552', margin: '0 0 8px' }
const cardMeta = { fontSize: '13px', color: '#6b7388', margin: 0 }
const hr = { borderColor: '#eceef3', margin: '24px 0 16px' }
const muted = { fontSize: '12px', lineHeight: '1.6', color: '#6b7388', margin: 0 }
const link = { color: '#e0613a', textDecoration: 'underline' }
