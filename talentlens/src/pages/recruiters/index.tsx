import { Table, Space, Button, Typography, Row, Col, Avatar, Tag, Statistic } from 'antd'
import { PlusOutlined, TrophyOutlined } from '@ant-design/icons'
import { RECRUITERS, type Recruiter } from '@/data/mock'

const { Text, Title } = Typography

export const RecruiterList = () => {
  const columns = [
    {
      title: 'Recruiter',
      key: 'name',
      render: (_: unknown, r: Recruiter) => (
        <Space>
          <Avatar style={{ background: '#722ed1' }}>{r.name[0]}</Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{r.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: 'Department Focus', dataIndex: 'department', key: 'department' },
    {
      title: 'Active Roles',
      dataIndex: 'activeRoles',
      key: 'activeRoles',
      align: 'center' as const,
      render: (v: number) => <Tag color="processing">{v}</Tag>,
    },
    {
      title: 'Hired This Month',
      dataIndex: 'hiredThisMonth',
      key: 'hiredThisMonth',
      align: 'center' as const,
      render: (v: number) => <Tag color="success">{v}</Tag>,
    },
    {
      title: 'Avg Time-to-Hire',
      dataIndex: 'avgTimeToHire',
      key: 'avgTimeToHire',
      align: 'center' as const,
      render: (v: number) => `${v} days`,
    },
    { title: 'Joined', dataIndex: 'joinedDate', key: 'joinedDate' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Recruiters</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />}>Add Recruiter</Button></Col>
      </Row>
      <Table
        dataSource={RECRUITERS}
        columns={columns}
        rowKey="id"
        size="middle"
      />
    </div>
  )
}
