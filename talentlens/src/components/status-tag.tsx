import { Tag } from 'antd'

const PIPELINE_COLORS: Record<string, string> = {
  Applied: 'default',
  Screening: 'processing',
  'Technical Interview': 'blue',
  'Manager Round': 'purple',
  'HR Round': 'geekblue',
  Offer: 'gold',
  Hired: 'success',
  Rejected: 'error',
  // offer statuses
  Pending: 'warning',
  Accepted: 'success',
  Declined: 'error',
  Negotiating: 'processing',
  // job statuses
  Open: 'success',
  Closed: 'default',
  'On Hold': 'warning',
  // interview statuses
  Scheduled: 'processing',
  Completed: 'success',
  Cancelled: 'error',
  'No Show': 'warning',
}

type Props = { status: string }

export const StatusTag = ({ status }: Props) => (
  <Tag color={PIPELINE_COLORS[status] ?? 'default'}>{status}</Tag>
)
