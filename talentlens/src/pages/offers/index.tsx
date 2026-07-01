import { Table, Space, Button, Typography, Row, Col, Tag, Empty } from 'antd'
import { PlusOutlined, DollarOutlined } from '@ant-design/icons'
import { StatusTag } from '@/components/status-tag'
import { OFFERS, type Offer } from '@/data/mock'

const { Text, Title } = Typography

export const OfferList = () => {
  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_: unknown, r: Offer) => (
        <div>
          <Text strong style={{ display: 'block' }}>{r.candidateName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{r.jobTitle} · {r.department}</Text>
        </div>
      ),
    },
    {
      title: 'Base Salary',
      key: 'salary',
      render: (_: unknown, r: Offer) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Text>₹{(r.baseSalary / 100000).toFixed(1)}L</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, r: Offer) => <StatusTag status={r.status} />,
    },
    { title: 'Sent Date', dataIndex: 'sentDate', key: 'sentDate' },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: 'Joining Date', dataIndex: 'joiningDate', key: 'joiningDate' },
    {
      title: 'Negotiation Round',
      dataIndex: 'negotiationRound',
      key: 'negotiationRound',
      align: 'center' as const,
      render: (v: number) => <Tag color={v > 1 ? 'orange' : 'default'}>Round {v}</Tag>,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Offers</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />}>Generate Offer</Button></Col>
      </Row>
      <Table
        dataSource={OFFERS}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: <Empty description="No offers found" /> }}
        size="middle"
      />
    </div>
  )
}
