import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Image,
  Row,
  Select,
  Space,
  Steps,
  Tooltip,
  TreeSelect,
} from 'antd';
import { useState } from 'react';
import { Divider } from 'antd';
import BookReuse from './Components/Book';
import PhraseReuse from './Components/Phrase';
import ChapterReuse from './Components/Chapter';
import SentenceReuse from './Components/Sentence';

const { Step } = Steps;

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

function RangeSetting() {
  return (
    <Card
      style={{ marginTop: 24 }}
      bordered={false}
      bodyStyle={{ padding: '32px 32px 32px 32px' }}
    >
      <Row style={{ marginBottom: 15 }}>选择复用分析书目集合：</Row>
      <Row>
        <RangeSelect></RangeSelect>
      </Row>
      <Divider />
      <Row style={{ marginBottom: 15 }}>选择复用检索书目集合：</Row>
      <Row>
        <RangeSelect></RangeSelect>
      </Row>
    </Card>
  );
}

function ReuseResult() {
  const tabList = [
    {
      key: 'book',
      tab: '书本粒度',
    },
    {
      key: 'chapter',
      tab: '篇章粒度',
    },
    {
      key: 'sentence',
      tab: '句子粒度',
    },
    // {
    //   key:'phrase',
    //   tab:'短语粒度',
    // }
  ];

  const [activeTabKey, setActiveTabKey] = useState('book');

  const contentList = {
    book: <BookReuse></BookReuse>,
    chapter: <ChapterReuse></ChapterReuse>,
    sentence: <SentenceReuse></SentenceReuse>,
    // 'phrase': <PhraseReuse></PhraseReuse>
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <Card
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(key: string) => {
        onTabChange(key);
      }}
      style={{ marginTop: 24 }}
      bordered={false}
      bodyStyle={{ padding: '32px 32px 32px 32px' }}
    >
      {contentList[activeTabKey]}
    </Card>
  );
}

function ReusePage() {
  const [current, setCurrent] = useState(0);

  return (
    <PageContainer>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Steps current={current}>
          <Step title="分析范围设置" />
          <Step title="复用分析结果" />
        </Steps>
      </Card>
      <div className="steps-content">
        {current === 0 && <RangeSetting></RangeSetting>}
        {current === 1 && <ReuseResult></ReuseResult>}
      </div>
      <Card>
        <div className="steps-action" style={{ float: 'right' }}>
          {current === 0 && (
            <Button type="primary" onClick={() => setCurrent(current + 1)}>
              下一步
            </Button>
          )}
          {current === 1 && (
            <Button type="primary" onClick={() => setCurrent(0)}>
              重新选择
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}

export default ReusePage;
