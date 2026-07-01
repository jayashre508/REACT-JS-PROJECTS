import { useState } from 'react'
import {
  Table, Input, Select, Space, Button, Tag, Rate, Typography,
  Drawer, Descriptions, Avatar, Divider, Empty, Row, Col,
} from 'antd'
import { SearchOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components/status-tag'
import { CANDIDATES, PIPELINE_STAGES, type Candidate } from '@/data/mock'

const { Text, Title } = Typography

export const CandidateList = () => {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string | undefined>()
  const [selected, setSelected] = useState<Candidate | null>(null)

  const data = CANDIDATES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
    const matchStage = !stageFilter || c.stage === stageFilter
    return matchSearch && matchStage
  })

  const columns = [
    {
      title: 'Candidate',
      key: 'name',
      render: (_: unknown, r: Candidate) => (
        <Space>
          <Avatar style={{ background: '#1677ff' }}>{r.name[0]}</Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    {
      title: 'Skills',
      key: 'skills',
      render: (_: unknown, r: Candidate) => (
        <Space size={4} wrap>
          {r.skills.map(s => <Tag key={s}>{s}</Tag>)}
        </Space>
      ),
    },
    { title: 'Exp (yrs)', dataIndex: 'experience', key: 'experience', align: 'center' as const },
    { title: 'Notice', dataIndex: 'noticePeriod', key: 'noticePeriod' },
    {
      title: 'Stage',
      key: 'stage',
      render: (_: unknown, r: Candidate) => <StatusTag status={r.stage} />,
    },
    { title: 'Source', dataIndex: 'source', key: 'source' },
    {
      title: 'Rating',
      key: 'rating',
      render: (_: unknown, r: Candidate) =>
        r.rating ? <Rate disabled defaultValue={r.rating} style={{ fontSize: 12 }} /> : <Text type="secondary">—</Text>,
    },
    {
      title: '',
      key: 'action',
      render: (_: unknown, r: Candidate) => (
        <Button type="link" size="small" onClick={() => setSelected(r)}>View</Button>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Candidates</Title></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>Add Candidate</Button>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name or role"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          placeholder="Filter by stage"
          allowClear
          style={{ width: 200 }}
          onChange={setStageFilter}
          options={PIPELINE_STAGES.map(s => ({ label: s, value: s }))}
        />
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: <Empty description="No candidates found" /> }}
        scroll={{ x: 900 }}
        size="middle"
      />

      <Drawer
        title="Candidate Profile"
        open={!!selected}
        onClose={() => setSelected(null)}
        width={480}
      >
        {selected && (
          <div>
            <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 24 }}>
              <Avatar size={72} icon={<UserOutlined />} style={{ background: '#1677ff' }} />
              <Title level={5} style={{ margin: 0 }}>{selected.name}</Title>
              <Text type="secondary">{selected.role}</Text>
              <StatusTag status={selected.stage} />
            </Space>
            <Divider />
            <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
              <Descriptions.Item label="Department">{selected.department}</Descriptions.Item>
              <Descriptions.Item label="Experience">{selected.experience} years</Descriptions.Item>
              <Descriptions.Item label="Notice Period">{selected.noticePeriod}</Descriptions.Item>
              <Descriptions.Item label="Source">{selected.source}</Descriptions.Item>
              <Descriptions.Item label="Recruiter">{selected.recruiter}</Descriptions.Item>
              <Descriptions.Item label="Applied">{selected.appliedDate}</Descriptions.Item>
              <Descriptions.Item label="Skills">
                <Space size={4} wrap>{selected.skills.map(s => <Tag key={s}>{s}</Tag>)}</Space>
              </Descriptions.Item>
              {selected.rating && (
                <Descriptions.Item label="Rating">
                  <Rate disabled defaultValue={selected.rating} style={{ fontSize: 14 }} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  )
}
