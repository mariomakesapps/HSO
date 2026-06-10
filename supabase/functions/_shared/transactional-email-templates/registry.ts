/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as welcome } from './welcome.tsx'
import { template as contactNotification } from './contact-notification.tsx'
import { template as opportunitySubmissionNotification } from './opportunity-submission-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'welcome': welcome,
  'contact-notification': contactNotification,
  'opportunity-submission-notification': opportunitySubmissionNotification,
}