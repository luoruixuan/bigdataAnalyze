import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Select,
  Slider,
  Space,
  Tabs,
  TreeSelect,
} from 'antd';

// const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

// const { Option } = Select;

function WordPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <PageContainer content="支持同时输入多个词语或词组，比较不同检索语在特定时间范围内的出现频率。">
      <Card
        title="分析条件设置"
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="sights">
            {(fields, { add, remove }) => (
              <Row>
                {fields.map((field) => (
                  <Col span={8}>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="词汇"
                        name={[field.name, 'ngram']}
                        fieldKey={[field.fieldKey, 'ngram']}
                        rules={[
                          {
                            required: true,
                            message: '请填写需要分析的ngram词汇',
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  </Col>
                ))}

                <Form.Item>
                  <Space size="small">
                    <Button onClick={() => add()} icon={<PlusOutlined />}>
                      添加分析词汇
                    </Button>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </Space>
                </Form.Item>
              </Row>
            )}
          </Form.List>
        </Form>
      </Card>
      <Card
        title="检索结果-历时折线图"
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Row>
          <Col span={8}>
            <Form.Item label="时间范围">
              <Slider
                range={{ draggableTrack: true }}
                defaultValue={[100, 1500]}
                marks={{ 0: '公元100年', 100: '公元1500年' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Image
          width={'100%'}
          preview={false}
          src={require('/src/assets/lineChartDemo2.jpg')}
        />
      </Card>
    </PageContainer>
  );
}

export default WordPage;
