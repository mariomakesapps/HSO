export const APPLICATION_RECIPIENT = 'highschoolopportunityhr@gmail.com'
const GENERAL_RECIPIENT = 'highschoolopportunity@gmail.com'

export function formNotificationRecipient(type: 'volunteer' | 'contact' | 'opportunity'): string {
  return type === 'volunteer' ? APPLICATION_RECIPIENT : GENERAL_RECIPIENT
}