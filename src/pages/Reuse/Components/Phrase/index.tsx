import { Select, Tabs, Image, Tag, Table, Steps } from 'antd';
import * as echarts from 'echarts';
import React from 'react';

const { Option } = Select;
const { TabPane } = Tabs;

class Test extends React.Component {
  componentDidMount() {
    // 初始化
    var myChart = echarts.init(document.getElementById('main')!);
    // 绘制图表
    myChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [
          '一以贯之',
          '千乘之国',
          '巧言令色',
          '无所不至',
          '洒扫应对',
          '各得其所',
          '己所不欲勿施于人',
          '短语XX',
          '短语XX',
          '短语XX',
        ],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [565, 224, 216, 196, 170, 140, 130, 130, 130, 130],
          type: 'bar',
          barWidth: '60%',
        },
      ],
    });
  }
  render() {
    return <div id="main" style={{ width: 900, height: 300 }}></div>;
  }
}

const columns = [
  {
    title: '复用短语',
    dataIndex: 'phrase',
    key: 'phrase',
    width: '15%',
    render: (phrase: string) => (
      <a href={`/reuse/phrase/${phrase}`}>{phrase}</a>
    ),
  },
  {
    title: '复用频次',
    dataIndex: 'frequency',
    key: 'frequency',
    width: '10%',
    render: (_: any, records: any) => <>{records.frequency}</>,
  },
  {
    title: '复用书目',
    key: 'tags',
    dataIndex: 'tags',
    width: '75%',
    render: (tags: any[]) => (
      <>
        {tags.map((tag) => {
          return (
            <Tag key={tag}>
              <a href={`/book/${tag}`}>{tag}</a>
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data = [
  {
    key: '11',
    phrase: '一以贯之',
    frequency: 32,
    tags: ['性理大全書', '西山讀書記'],
  },
  {
    key: '12',
    phrase: '千乘之国',
    frequency: 42,
    tags: ['晦庵集'],
  },
  {
    key: '13',
    phrase: '巧言令色',
    frequency: 32,
    tags: ['春秋繁露', '說苑'],
  },
];

function PhraseReuse() {
  const children: any[] = [];

  for (let i = 1; i < 40; i++) {
    children.push(
      <Option key={i} value={i}>
        {'短语' + i}
      </Option>,
    );
  }

  function handleChange(value: any) {
    console.log(`selected ${value}`);
  }

  return (
    <>
      <Test />
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%', marginBottom: 20 }}
        placeholder="请选择要分析的词语"
        defaultValue={[10, 11]}
        onChange={handleChange}
      >
        {children}
      </Select>
      <Tabs type="card">
        <TabPane tab="复用统计表" key="1">
          <Table columns={columns} dataSource={data} />
        </TabPane>
        <TabPane tab="热力图" key="2">
          <Image
            width={'100%'}
            preview={false}
            src={require('/src/assets/heatMapDemo.jpg')}
          />
        </TabPane>
        <TabPane tab="折线图" key="3">
          <Image
            width={'100%'}
            preview={false}
            src={require('/src/assets/lineChartDemo.jpg')}
          />
        </TabPane>
        <TabPane tab="柱状图" key="44">
          <Image
            width={'100%'}
            preview={false}
            src={require('/src/assets/barChartDemo.jpg')}
          />
        </TabPane>
      </Tabs>
    </>
  );
}

export default PhraseReuse;
