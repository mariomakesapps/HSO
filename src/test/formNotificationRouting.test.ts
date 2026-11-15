import { describe, expect, it } from 'vitest';
import { APPLICATION_RECIPIENT, formNotificationRecipient } from '../../supabase/functions/_shared/form-notification-routing';

describe('form notification destinations', () => {
  it('sends every volunteer/internship notification to the HR inbox', () => {
    expect(formNotificationRecipient('volunteer')).toBe('highschoolopportunityhr@gmail.com');
    expect(APPLICATION_RECIPIENT).toBe('highschoolopportunityhr@gmail.com');
  });
  it('keeps contact notifications in the general inbox', () => {
    expect(formNotificationRecipient('contact')).toBe('contact@highschoolopportunity.org');
  });
  it('keeps opportunity submissions in the general inbox', () => {
    expect(formNotificationRecipient('opportunity')).toBe('contact@highschoolopportunity.org');
  });
});