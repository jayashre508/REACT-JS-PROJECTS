import { useState } from 'react'
import {
  Table, Input, Select, Space, Button, Tag, Typography,
  Row, Col, Empty, Progress,
} from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components/status-tag'
import { JOB_OPENINGS, type JobOpening } from '@/data/mock'

const { Text, Title } = Typography

const PRIORITY_COLOR: Record<string, string> = { High: 'red', Medium: 'orange', Low: 'green' }

export const JobOpeningList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const data = JOB_OPENINGS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || j.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    {
      title: 'Job Title',
      key: 'title',
      render: (_: unknown, r: JobOpening) => (
        <div>
          <Text strong style={{ display: 'block' }}>{r.title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.department} · {r.location}</Text>
        </div>
      ),
    },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, r: JobOpening) => <StatusTag status={r.status} />,
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (_: unknown, r: JobOpening) => <Tag color={PRIORITY_COLOR[r.priority]}>{r.priority}</Tag>,
    },
    { title: 'Applicants', dataIndex: 'applicants', key: 'applicants', align: 'center' as const },
    {
      title: 'Salary Range',
      key: 'salary',
      render: (_: unknown, r: JobOpening) =>
        `₹${(r.salaryMin / 100000).toFixed(1)}L – ₹${(r.salaryMax / 100000).toFixed(1)}L`,
    },
    { title: 'Recruiter', dataIndex: 'recruiter', key: 'recruiter' },
    { title: 'Opened', dataIndex: 'openedDate', key: 'openedDate' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Job Openings</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />}>Post Job</Button></Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by title or department"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          allowClear
          style={{ width: 160 }}
          onChange={setStatusFilter}
          options={['Open', 'Closed', 'On Hold'].map(s => ({ label: s, value: s }))}
        />
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: <Empty description="No job openings found" /> }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </div>
  )
}
