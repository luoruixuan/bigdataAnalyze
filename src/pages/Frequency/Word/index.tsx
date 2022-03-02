import { InfoCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Image, Select, Tabs, Tooltip, TreeSelect } from 'antd';
import { useState } from 'react';

const { Option } = Select;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

const children: any[] = [];
for (let i = 1; i < 40; i++) {
  children.push(
    <Option key={i} value={i}>
      {'词语' + i}
    </Option>,
  );
}

const treeData = [
  {
    title: '先秦两汉',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '春秋繁露',
        value: '春秋繁露',
        key: '春秋繁露',
      },
      {
        title: '韓詩外傳',
        value: '韓詩外傳',
        key: '韓詩外傳',
      },
    ],
  },
  {
    title: '魏晋南北朝',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '顏氏家訓',
        value: '顏氏家訓',
        key: '顏氏家訓',
      },
      {
        title: '劉子新論',
        value: '劉子新論',
        key: '劉子新論',
      },
    ],
  },
  {
    title: '宋明',
    value: '0-3',
    key: '0-3',
    children: [
      {
        title: '榕壇問業',
        value: '榕壇問業',
        key: '榕壇問業',
      },
      {
        title: '二程外書',
        value: '二程外書',
        key: '二程外書',
      },
      {
        title: '困學紀聞',
        value: '困學紀聞',
        key: '困學紀聞',
      },
    ],
  },
];

function WordPage() {
  const [wordSelect, setWordSelect] = useState<boolean>(true);

  function bookSelectChange(value: any) {
    console.log('onChange ', value);
    if (value === [] || value.length === 0) {
      setWordSelect(true);
    } else {
      setWordSelect(false);
    }
  }

  function wordSelectChange(value: any) {
    console.log(`selected ${value}`);
  }

  return (
    <PageContainer>
      <Card
        title="分析范围选择"
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Form>
          <Form.Item label="统计范围">
            <TreeSelect
              treeData={treeData}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder={'请选择要检索的书目集合'}
              onChange={bookSelectChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="词汇范围">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择要分析的词语范围"
              // defaultValue={[10, 11]}
              onChange={wordSelectChange}
              disabled={wordSelect}
            >
              {children}
            </Select>
          </Form.Item>
        </Form>
      </Card>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Tabs type="card">
          <TabPane tab="统计列表" key="1">
            <Tooltip title="【note】呈现词汇的使用频次和历时变化趋势">
              <InfoCircleOutlined />
            </Tooltip>
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/trendListDemo.png')}
            />
          </TabPane>
          <TabPane tab="折线图" key="2">
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/lineChartDemo.jpg')}
            />
          </TabPane>
          <TabPane tab="柱状图" key="3">
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/barChartDemo.jpg')}
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
}

export default WordPage;
