import type { AutomationAction } from '../types';

export const automationActions: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
  },
  {
    id: 'send_slack',
    label: 'Send Slack Message',
    params: ['channel', 'message'],
  },
  {
    id: 'update_hris',
    label: 'Update HRIS Record',
    params: ['employeeId', 'field', 'value'],
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    params: ['attendees', 'duration', 'title'],
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    params: ['type', 'priority', 'description'],
  },
  {
    id: 'provision_access',
    label: 'Provision System Access',
    params: ['systems', 'accessLevel'],
  },
  {
    id: 'background_check',
    label: 'Initiate Background Check',
    params: ['checkType', 'provider'],
  },
];
