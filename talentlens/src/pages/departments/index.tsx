import { Table, Space, Button, Typography, Row, Col, Tag, Progress } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { DEPARTMENTS, type Department } from '@/data/mock'

const { Text, Title } = Typography

export const DepartmentList = () => {
  const columns = [
    { title: 'Department', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Head', dataIndex: 'head', key: 'head' },
    {
      title: 'Open Roles',
      dataIndex: 'openRoles',
      key: 'openRoles',
      align: 'center' as const,
      render: (v: number) => <Tag color={v > 0 ? 'processing' : 'default'}>{v}</Tag>,
    },
    { title: 'Headcount', dataIndex: 'totalHeadcount', key: 'totalHeadcount', align: 'center' as const },
    {
      title: 'Hired This Quarter',
      dataIndex: 'hiredThisQuarter',
      key: 'hiredThisQuarter',
      align: 'center' as const,
      render: (v: number) => <Tag color="success">{v}</Tag>,
    },
    {
      title: 'Avg Time-to-Hire',
      dataIndex: 'avgTimeToHire',
      key: 'avgTimeToHire',
      render: (v: number) => {
        const color = v <= 25 ? '#52c41a' : v <= 35 ? '#fa8c16' : '#ff4d4f'
        return (
          <Space>
            <Text style={{ color }}>{v} days</Text>
            <Progress percent={Math.min(100, Math.round((v / 45) * 100))} showInfo={false} size="small" style={{ width: 80 }} strokeColor={color} />
          </Space>
        )
      },
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><Title level={4} style={{ margin: 0 }}>Departments</Title></Col>
        <Col><Button type="primary" icon={<PlusOutlined />}>Add Department</Button></Col>
      </Row>
      <Table
        dataSource={DEPARTMENTS}
        columns={columns}
        rowKey="id"
        size="middle"
      />
    </div>
  )
}
