import { Col, Row, Card, Progress, List, Badge, Typography, Space, Tag } from 'antd'
import {
  UserOutlined, FileTextOutlined, CalendarOutlined,
  GiftOutlined, RiseOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import { StatCard } from '@/components/stat-card'
import { StatusTag } from '@/components/status-tag'
import { CANDIDATES, INTERVIEWS, OFFERS, JOB_OPENINGS, PIPELINE_STAGES } from '@/data/mock'

const { Text, Title } = Typography

const pipelineCounts = PIPELINE_STAGES.reduce<Record<string, number>>((acc, stage) => {
  acc[stage] = CANDIDATES.filter(c => c.stage === stage).length
  return acc
}, {})

const totalActive = CANDIDATES.filter(c => c.stage !== 'Hired' && c.stage !== 'Rejected').length
const hired = pipelineCounts['Hired'] ?? 0
const offerAccepted = OFFERS.filter(o => o.status === 'Accepted').length
const offerTotal = OFFERS.length
const acceptanceRate = offerTotal ? Math.round((offerAccepted / offerTotal) * 100) : 0
const openJobs = JOB_OPENINGS.filter(j => j.status === 'Open').length
const upcomingInterviews = INTERVIEWS.filter(i => i.status === 'Scheduled')

const sourceMap = CANDIDATES.reduce<Record<string, number>>((acc, c) => {
  acc[c.source] = (acc[c.source] ?? 0) + 1
  return acc
}, {})
const topSources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
const maxSource = topSources[0]?.[1] ?? 1

export const Home = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={4} style={{ marginBottom: 24 }}>Hiring Operations Overview</Title>

      {/* KPI Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Active Candidates" value={totalActive} prefix={<UserOutlined />} valueStyle={{ color: '#1677ff' }} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Open Roles" value={openJobs} prefix={<FileTextOutlined />} valueStyle={{ color: '#52c41a' }} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Hired This Quarter" value={hired} prefix={<RiseOutlined />} valueStyle={{ color: '#722ed1' }} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Offer Acceptance Rate" value={acceptanceRate} suffix="%" prefix={<GiftOutlined />} valueStyle={{ color: '#fa8c16' }} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Hiring Pipeline Funnel */}
        <Col xs={24} lg={12}>
          <Card title="Hiring Pipeline" style={{ borderRadius: 12, height: '100%' }}>
            {PIPELINE_STAGES.filter(s => s !== 'Rejected').map(stage => {
              const count = pipelineCounts[stage] ?? 0
              const pct = totalActive + hired > 0 ? Math.round((count / (totalActive + hired)) * 100) : 0
              return (
                <div key={stage} style={{ marginBottom: 12 }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13 }}>{stage}</Text>
                    <Text strong>{count}</Text>
                  </Space>
                  <Progress percent={pct} showInfo={false} strokeColor={stage === 'Hired' ? '#52c41a' : '#1677ff'} size="small" />
                </div>
              )
            })}
          </Card>
        </Col>

        {/* Upcoming Interviews */}
        <Col xs={24} lg={12}>
          <Card
            title={<Space><CalendarOutlined /><span>Upcoming Interviews</span></Space>}
            style={{ borderRadius: 12, height: '100%' }}
            extra={<Tag color="processing">{upcomingInterviews.length} scheduled</Tag>}
          >
            {upcomingInterviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>
                No interviews scheduled
              </div>
            ) : (
              <List
                dataSource={upcomingInterviews}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Badge color="#1677ff" />}
                      title={<Text strong>{item.candidateName}</Text>}
                      description={
                        <Space size={4} wrap>
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.jobTitle}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.date} {item.time}</Text>
                        </Space>
                      }
                    />
                    <Tag>{item.type}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Source of Hire */}
        <Col xs={24} lg={12}>
          <Card title="Source of Hire" style={{ borderRadius: 12 }}>
            {topSources.map(([source, count]) => (
              <div key={source} style={{ marginBottom: 12 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13 }}>{source}</Text>
                  <Text strong>{count}</Text>
                </Space>
                <Progress percent={Math.round((count / maxSource) * 100)} showInfo={false} size="small" strokeColor="#722ed1" />
              </div>
            ))}
          </Card>
        </Col>

        {/* Recent Offers */}
        <Col xs={24} lg={12}>
          <Card
            title={<Space><GiftOutlined /><span>Recent Offers</span></Space>}
            style={{ borderRadius: 12 }}
          >
            <List
              dataSource={OFFERS}
              renderItem={offer => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{offer.candidateName}</Text>}
                    description={
                      <Space size={4} wrap>
                        <Text type="secondary" style={{ fontSize: 12 }}>{offer.jobTitle}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>·</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> Joining {offer.joiningDate}
                        </Text>
                      </Space>
                    }
                  />
                  <StatusTag status={offer.status} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
