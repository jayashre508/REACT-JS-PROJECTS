import { Card, Statistic } from 'antd'
import type { StatisticProps } from 'antd'

type Props = StatisticProps & { style?: React.CSSProperties }

export const StatCard = ({ style, ...props }: Props) => (
  <Card style={{ borderRadius: 12, ...style }} bodyStyle={{ padding: '20px 24px' }}>
    <Statistic {...props} />
  </Card>
)
