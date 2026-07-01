import { useState } from 'react'
import {
  Table, Space, Button, Typography, Row, Col, Tag, Rate,
  Select, Input, Drawer, Descriptions, Divider, Empty,
} from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components/status-tag'
import { INTERVIEWS, type Interview } from '@/data/mock'

const { Text, Title } = Typography

const RECOMMENDATION_COLOR: Record<string, string> = {
  'Strong Yes': 'success', Yes: 'processing', No: 'warning', 'Strong No': 'error',
}

export const InterviewList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [selected, setSelected] = useState<Interview | null>(null)

  const data = INTERVIEWS.filter(i => {
    const matchSearch = i.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_: unknown, r: Interview) => (
        <div>
          <Text strong style={{ display: 'block' }}>{r.candidateName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.jobTitle}</Text>
        </div>
      ),
    },
    { title: 'Interviewer', dataIndex: 'interviewer', key: 'interviewer' },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_: unknown, r: Interview) => `${r.date} · ${r.time}`,
    },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v: string) => <Tag>{v}</Tag> },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, r: Interview) => <StatusTag status={r.status} />,
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: unknown, r: Interview) =>
        r.rating ? <Rate disabled defaultValue={r.rating} style={{ fontSize: 12 }} /> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Recommendation',
      key: 'recommendation',
      render: (_: unknown, r: Interview) =>
        r.recommendation
          ? <Tag color={RECOMMENDATION_COLOR[r.recommendation]}>{r.recommendation}</Tag>
          : <Text type="secondary">—</Text>,
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, r: Interview) =>
        r.status === 'Completed'
          ? <Button type="link" size="small" onClick={() => setSelected(r)}>Feedback</Button>
          : null,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Interviews</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />}>Schedule Interview</Button></Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search candidate or role"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          allowClear
          style={{ width: 180 }}
          onChange={setStatusFilter}
          options={['Scheduled', 'Completed', 'Cancelled', 'No Show'].map(s => ({ label: s, value: s }))}
        />
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: <Empty description="No interviews found" /> }}
        scroll={{ x: 900 }}
        size="middle"
      />

      <Drawer
        title="Interview Feedback"
        open={!!selected}
        onClose={() => setSelected(null)}
        width={440}
      >
        {selected && (
          <div>
            <Title level={5}>{selected.candidateName}</Title>
            <Text type="secondary">{selected.jobTitle}</Text>
            <Divider />
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Interviewer">{selected.interviewer}</Descriptions.Item>
              <Descriptions.Item label="Date">{selected.date} · {selected.time}</Descriptions.Item>
              <Descriptions.Item label="Type">{selected.type}</Descriptions.Item>
              <Descriptions.Item label="Rating">
                <Rate disabled defaultValue={selected.rating ?? 0} style={{ fontSize: 14 }} />
              </Descriptions.Item>
              <Descriptions.Item label="Recommendation">
                {selected.recommendation && (
                  <Tag color={RECOMMENDATION_COLOR[selected.recommendation]}>{selected.recommendation}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Feedback">
                <Text>{selected.feedback}</Text>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  )
}
