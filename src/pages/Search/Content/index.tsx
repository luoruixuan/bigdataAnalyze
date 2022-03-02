import { Card, Checkbox, Col, Pagination, Row, Select, Typography } from 'antd';

import VisualizedResult from '../VisualizedResult';
import ContentResult from './ContentResult';
import { useState } from 'react';
import QuadraticSearch from '../QuadraticSearch';

function SearchdPage() {
  const [quadraticSearchSwitch, setQuadraticSearchSwitch] =
    useState<Boolean>(false);

  const handleChange = (e: any) => {
    setQuadraticSearchSwitch(e.target.checked);
    console.log(e.target.checked);
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>二次检索：</Typography.Title>
          <QuadraticSearch pagekey="content" />
        </Card>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>结果可视化：</Typography.Title>
          <VisualizedResult pagekey="content"></VisualizedResult>
        </Card>
      </Col>
      <Col span={18}>
        <Card
          style={{ marginBottom: 24 }}
          bordered={false}
          bodyStyle={{ padding: '16px 16px 16px 16px' }}
        >
          <Typography.Title level={5}>内容检索结果：</Typography.Title>
          <ContentResult></ContentResult>
        </Card>
      </Col>
    </Row>
  );
}

export default SearchdPage;
