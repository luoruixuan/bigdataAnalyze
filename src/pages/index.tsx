import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Input, Row } from 'antd';

export default function IndexPage() {
  const handleFormSubmit = () => {};

  return (
    <PageContainer
      content={
        <Row
          justify="center"
          style={{ marginTop: '20px', marginBottom: '40px' }}
        >
          <Input.Search
            enterButton="搜索"
            placeholder="输入想要了解的著作"
            size="large"
            onSearch={handleFormSubmit}
            style={{ maxWidth: '500px', width: '100%' }}
          />
        </Row>
      }
    >
      <Row gutter={16}>
        <Col span={24}>
          <Card
            style={{ marginBottom: 24 }}
            bordered={false}
            bodyStyle={{ padding: '32px 32px 32px 32px' }}
          >
            111
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
