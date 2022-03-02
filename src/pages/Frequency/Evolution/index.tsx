import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
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
import { useState } from 'react';

function RangeSelect() {
  const [searchType, setSearchType] = useState<String>('dynasty');

  const categoryData = [
    {
      title: '经部',
      value: '经部',
      key: '经部',
      children: [
        {
          title: '論語',
          value: '論語',
          key: '論語',
          children: [
            {
              title: '論語-學而第一',
              value: '論語-學而第一',
              key: '論語-學而第一',
            },
            {
              title: '論語-為政第二',
              value: '論語-為政第二',
              key: '論語-為政第二',
            },
          ],
        },
        {
          title: '孝經',
          value: '孝經',
          key: '孝經',
          children: [
            {
              title: '孝經-開宗明義章',
              value: '孝經-開宗明義章',
              key: '孝經-開宗明義章',
            },
            {
              title: '孝經-天子章',
              value: '孝經-天子章',
              key: '孝經-天子章',
            },
          ],
        },
      ],
    },
    {
      title: '史部',
      value: '史部',
      key: '史部',
      children: [
        {
          title: '漢書',
          value: '漢書',
          key: '漢書',
        },
        {
          title: '三國志',
          value: '三國志',
          key: '三國志',
        },
      ],
    },
  ];

  const genreData = [
    {
      title: '诗歌',
      value: '诗歌',
      key: '诗歌',
      children: [
        {
          title: '楚辭',
          value: '楚辭',
          key: '楚辭',
        },
      ],
    },
    {
      title: '小说',
      value: '小说',
      key: '小说',
      children: [
        {
          title: '紅樓夢',
          value: '紅樓夢',
          key: '紅樓夢',
        },
        {
          title: '三國演義',
          value: '三國演義',
          key: '三國演義',
        },
      ],
    },
  ];

  const dynastyData = [
    {
      title: '先秦两汉',
      value: '先秦两汉',
      key: '先秦两汉',
      children: [
        {
          title: '春秋繁露',
          value: '春秋繁露',
          key: '春秋繁露',
          children: [
            {
              title: '春秋繁露-卷一',
              value: '春秋繁露-卷一',
              key: '春秋繁露-卷一',
            },
            {
              title: '春秋繁露-卷二',
              value: '春秋繁露-卷二',
              key: '春秋繁露-卷二',
            },
          ],
        },
        {
          title: '韓詩外傳',
          value: '韓詩外傳',
          key: '韓詩外傳',
          children: [
            {
              title: '韓詩外傳-卷一',
              value: '韓詩外傳-卷一',
              key: '韓詩外傳-卷一',
            },
            {
              title: '韓詩外傳-卷二',
              value: '韓詩外傳-卷二',
              key: '韓詩外傳-卷二',
            },
          ],
        },
      ],
    },
    {
      title: '魏晋南北朝',
      value: '魏晋南北朝',
      key: '魏晋南北朝',
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
      value: '宋明',
      key: '宋明',
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

  const typeList = {
    dynasty: dynastyData,
    category: categoryData,
    genre: genreData,
  };

  const { SHOW_PARENT } = TreeSelect;
  const { Option } = Select;

  function rangeSelectChange(value: string) {
    console.log(value);
    setSearchType(value.slice());
  }

  function treeSelectChange(value: any) {
    console.log(value);
  }

  return (
    <Space>
      <Select
        defaultValue="dynasty"
        style={{ width: 120 }}
        onChange={rangeSelectChange}
      >
        <Option value="dynasty">按时代</Option>
        <Option value="genre">按体裁</Option>
        <Option value="category">按类别</Option>
      </Select>
      <TreeSelect
        treeData={typeList[searchType]}
        showSearch={true}
        treeCheckable={true}
        showCheckedStrategy={SHOW_PARENT}
        placeholder={'请选择要检索的书目集合'}
        onChange={treeSelectChange}
        style={{ width: 600 }}
        dropdownMatchSelectWidth={false}
      ></TreeSelect>
    </Space>
  );
}

function WordPage() {
  const [form] = Form.useForm();
  const { TabPane } = Tabs;
  const { Option } = Select;

  const handleFormSubmit = () => {};

  const handleChange = () => {};

  return (
    <PageContainer content="支持输入一个词语或词组，计算不同历史时期检索词所在句子的TopK高频共现词">
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Row style={{ marginBottom: 20 }}>
          分析词汇：
          <Input.Search
            enterButton="搜索"
            // size="large"
            onSearch={handleFormSubmit}
            style={{ maxWidth: 300, width: '100%' }}
          />
        </Row>
        <Row style={{ marginTop: 20 }}>
          书目范围：
          <RangeSelect />
        </Row>
      </Card>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Space>
          词义距离：
          <Select
            defaultValue="按PMI"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="pmi">按PMI</Option>
            <Option value="co-occurence">按共现次数</Option>
          </Select>
          分析时代：
          <Select
            defaultValue="全部"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="all">全部</Option>
            <Option value="qin">先秦</Option>
            <Option value="han">两汉</Option>
          </Select>
          近邻词个数:
          <Slider
            min={1}
            max={100}
            defaultValue={20}
            onChange={() => {}}
            style={{ width: 200 }}
          />
        </Space>
        <Image
          width={'100%'}
          preview={false}
          src={require('/src/assets/sementicEvolutionDemo2.jpg')}
        />
        {/* <Tabs type="card">
          <TabPane tab="统计结果" key="1">
            
            <Image 
              width={'100%'}
              preview={false}
              src={require('/src/assets/EvolutionDemo.jpg')}
            />
          </TabPane>
          <TabPane tab="详细内容" key="2">
            <Image 
              width={'100%'}
              preview={false}
              src={require('/src/assets/EvolutionDemo2.png')}
            />
          </TabPane>
        </Tabs> */}
      </Card>
    </PageContainer>
  );
}

export default WordPage;
