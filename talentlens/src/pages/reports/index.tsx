import { Col, Row, Card, Progress, List, Typography, Space, Tag, Table, Divider } from 'antd'
import { StatCard } from '@/components/stat-card'
import {
  CANDIDATES, OFFERS, DEPARTMENTS, RECRUITERS,
  PIPELINE_STAGES, type PipelineStage,
} from '@/data/mock'
import {
  UserOutlined, ClockCircleOutlined, RiseOutlined,
  GiftOutlined, TeamOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// ── Derived analytics ─────────────────────────────────────────────────────────
const totalCandidates = CANDIDATES.length
const hired = CANDIDATES.filter(c => c.stage === 'Hired').length
const rejected = CANDIDATES.filter(c => c.stage === 'Rejected').length
const conversionRate = totalCandidates ? Math.round((hired / totalCandidates) * 100) : 0

const offerAccepted = OFFERS.filter(o => o.status === 'Accepted').length
const offerTotal = OFFERS.length
const acceptanceRate = offerTotal ? Math.round((offerAccepted / offerTotal) * 100) : 0

const avgTimeToHire = Math.round(
  RECRUITERS.reduce((sum, r) => sum + r.avgTimeToHire, 0) / RECRUITERS.length
)

const sourceMap = CANDIDATES.reduce<Record<string, number>>((acc, c) => {
  acc[c.source] = (acc[c.source] ?? 0) + 1
  return acc
}, {})
const sourceData = Object.entries(sourceMap)
  .sort((a, b) => b[1] - a[1])
  .map(([source, count]) => ({ source, count, pct: Math.round((count / totalCandidates) * 100) }))

const funnelData = PIPELINE_STAGES.map(stage => ({
  stage,
  count: CANDIDATES.filter(c => c.stage === stage).length,
}))

const recruiterColumns = [
  { title: 'Recruiter', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Active Roles', dataIndex: 'activeRoles', key: 'activeRoles', align: 'center' as const },
  { title: 'Hired / Month', dataIndex: 'hiredThisMonth', key: 'hiredThisMonth', align: 'center' as const, render: (v: number) => <Tag color="success">{v}</Tag> },
  { title: 'Avg Time-to-Hire', dataIndex: 'avgTimeToHire', key: 'avgTimeToHire', render: (v: number) => `${v} days` },
]

const deptColumns = [
  { title: 'Department', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Open Roles', dataIndex: 'openRoles', key: 'openRoles', align: 'center' as const, render: (v: number) => <Tag color={v > 0 ? 'processing' : 'default'}>{v}</Tag> },
  { title: 'Hired Q4', dataIndex: 'hiredThisQuarter', key: 'hiredThisQuarter', align: 'center' as const, render: (v: number) => <Tag color="success">{v}</Tag> },
  { title: 'Avg TTH', dataIndex: 'avgTimeToHire', key: 'avgTimeToHire', render: (v: number) => `${v} days` },
]

export const Reports = () => (
  <div style={{ padding: 24 }}>
    <Title level={4} style={{ marginBottom: 24 }}>Hiring Reports & Analytics</Title>

    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} md={6}>
        <StatCard title="Total Candidates" value={totalCandidates} prefix={<UserOutlined />} valueStyle={{ color: '#1677ff' }} />
      </Col>
      <Col xs={12} md={6}>
        <StatCard title="Conversion Rate" value={conversionRate} suffix="%" prefix={<RiseOutlined />} valueStyle={{ color: '#52c41a' }} />
      </Col>
      <Col xs={12} md={6}>
        <StatCard title="Avg Time-to-Hire" value={avgTimeToHire} suffix=" days" prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} />
      </Col>
      <Col xs={12} md={6}>
        <StatCard title="Offer Acceptance" value={acceptanceRate} suffix="%" prefix={<GiftOutlined />} valueStyle={{ color: '#722ed1' }} />
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      {/* Hiring Funnel */}
      <Col xs={24} lg={12}>
        <Card title="Hiring Funnel" style={{ borderRadius: 12 }}>
          {funnelData.map(({ stage, count }) => (
            <div key={stage} style={{ marginBottom: 12 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13 }}>{stage}</Text>
                <Text strong>{count}</Text>
              </Space>
              <Progress
                percent={totalCandidates ? Math.round((count / totalCandidates) * 100) : 0}
                showInfo={false}
                size="small"
                strokeColor={stage === 'Hired' ? '#52c41a' : stage === 'Rejected' ? '#ff4d4f' : '#1677ff'}
              />
            </div>
          ))}
        </Card>
      </Col>

      {/* Source of Hire */}
      <Col xs={24} lg={12}>
        <Card title="Source of Hire" style={{ borderRadius: 12 }}>
          {sourceData.map(({ source, count, pct }) => (
            <div key={source} style={{ marginBottom: 12 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13 }}>{source}</Text>
                <Space>
                  <Text strong>{count}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>({pct}%)</Text>
                </Space>
              </Space>
              <Progress percent={pct} showInfo={false} size="small" strokeColor="#722ed1" />
            </div>
          ))}
        </Card>
      </Col>

      {/* Recruiter Productivity */}
      <Col xs={24} lg={12}>
        <Card title={<Space><TeamOutlined /><span>Recruiter Productivity</span></Space>} style={{ borderRadius: 12 }}>
          <Table dataSource={RECRUITERS} columns={recruiterColumns} rowKey="id" pagination={false} size="small" />
        </Card>
      </Col>

      {/* Department Hiring Trends */}
      <Col xs={24} lg={12}>
        <Card title="Department Hiring Trends" style={{ borderRadius: 12 }}>
          <Table dataSource={DEPARTMENTS} columns={deptColumns} rowKey="id" pagination={false} size="small" />
        </Card>
      </Col>
    </Row>
  </div>
)
