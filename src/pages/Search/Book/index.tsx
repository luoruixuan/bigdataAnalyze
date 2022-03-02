import { Card, Col, Row, Typography } from 'antd';

import VisualizedResult from '../VisualizedResult';
import BookResult from './BookResult';
import QuadraticSearch from '../QuadraticSearch';

function SearchdPage() {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>二次检索：</Typography.Title>
          <QuadraticSearch pagekey="book" />
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>结果可视化：</Typography.Title>
          <VisualizedResult pagekey="book"></VisualizedResult>
        </Card>
      </Col>
      <Col span={18}>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>书目检索结果：</Typography.Title>
          <BookResult></BookResult>
        </Card>
      </Col>
    </Row>
  );
}

export default SearchdPage;
