import { Alert, Button, Card, Cascader, Form, Table, Tag } from 'antd';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState } from 'react';
import { Pie } from '@ant-design/charts';
import Modal from 'antd/lib/modal/Modal';

function PieChart() {
  const salesPieData = [
    {
      type: '學而時習之',
      value: 10,
    },
    {
      type: '不亦說乎',
      value: 5,
    },
    {
      type: '有朋自遠方來',
      value: 12,
    },
    {
      type: '人不知而不慍',
      value: 8,
    },
    {
      type: '不亦君子乎',
      value: 2,
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: salesPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...pieConfig} />;
}

function SentenceReuse() {
  const [selectedBook, setSelectedBook] = useState<string>('论语');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const options = [
    {
      value: '论语',
      label: '论语',
      children: [
        {
          value: '學而第一',
          label: '學而第一',
        },
        {
          value: '為政第二',
          label: '為政第二',
        },
        {
          value: '八佾第三',
          label: '八佾第三',
        },
      ],
    },
    {
      value: '孟子',
      label: '孟子',
      children: [
        {
          value: '梁惠王上',
          label: '梁惠王上',
        },
        {
          value: '梁惠王下',
          label: '梁惠王下',
        },
      ],
    },
  ];

  const columns = [
    {
      title: '句子',
      dataIndex: 'sentence',
      key: 'sentence',
      width: '70%',
      render: (_: any, records: any) => (
        <a href={`/sentence/${records.key}`}>{records.sentence}</a>
      ),
    },
    {
      title: '复用频次',
      dataIndex: 'frequency',
      key: 'frequency',
      width: '10%',
      render: (_: any, records: any) => (
        <>
          {records.frequency}
          <Sparklines data={[5, 10, 5, 20, 0, 15, 7]}>
            <SparklinesLine color="blue" />
          </Sparklines>
        </>
      ),
    },
    {
      title: '复用书目',
      key: 'tags',
      dataIndex: 'tags',
      width: '15%',
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
    {
      // title: '详细',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => [
        <a
          key="config"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          ＋
        </a>,
      ],
    },
  ];

  const data = [
    {
      key: '1',
      sentence:
        '子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」',
      frequency: 32,
      tags: ['性理大全書', '西山讀書記'],
    },
    {
      key: '2',
      sentence:
        '有子曰：「其為人也孝弟，而好犯上者，鮮矣；不好犯上，而好作亂者，未之有也。君子務本，本立而道生。孝弟也者，其為（仁）〔人〕之本與！」',
      frequency: 42,
      tags: ['晦庵集'],
    },
    {
      key: '3',
      sentence: '子曰：「巧言令色，鮮矣仁！」',
      frequency: 32,
      tags: ['春秋繁露', '說苑'],
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChange(value: any) {
    console.log(value.join('/'));
    setSelectedBook(value.join(' / '));
  }

  return (
    <>
      <Form>
        <Form.Item label="分析书目">
          <Cascader
            defaultValue={['论语']}
            options={options}
            onChange={onChange}
            changeOnSelect
          />
        </Form.Item>
      </Form>
      <div style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Alert
          message={'《' + selectedBook + '》在所选择的书目中共被复用XXX次'}
          type="success"
          showIcon
        />
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="..."
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <PieChart></PieChart>
      </Modal>
    </>
  );
}

export default SentenceReuse;
