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
import React from 'react';
import $ from 'jquery';
import '../lang';

const { Step } = Steps;

function RangeSelect(props) {
  const [searchType, setSearchType] = useState<String>('dynasty');

  const typeList = props.local.range;

  const { SHOW_PARENT } = TreeSelect;
  const { Option } = Select;

  function rangeSelectChange(value: string) {
    setSearchType(value.slice());
  }

  function treeSelectChange(value: any) {
    props.setMethod(value);
  }

  return (
    <Space>
      <Select
        defaultValue="dynasty"
        style={{ width: 120 }}
        onChange={rangeSelectChange}
      >
        <Option value="dynasty">按时代</Option>
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

function RangeSetting(props) {
  return (
    <Card
      style={{ marginTop: 24 }}
      bordered={false}
      bodyStyle={{ padding: '32px 32px 32px 32px' }}
    >
      <Row style={{ marginBottom: 15 }}>选择复用分析书目集合：</Row>
      <Row>
        <RangeSelect
          local={props.local}
          setMethod={(x) => {
            props.local.Aset = x;
          }}
        ></RangeSelect>
      </Row>
      <Divider />
      <Row style={{ marginBottom: 15 }}>选择复用检索书目集合：</Row>
      <Row>
        <RangeSelect
          local={props.local}
          setMethod={(x) => {
            props.local.Bset = x;
          }}
        ></RangeSelect>
      </Row>
    </Card>
  );
}

function ReuseResult(props) {
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
    book: <BookReuse local={props.local}></BookReuse>,
    chapter: <ChapterReuse local={props.local}></ChapterReuse>,
    sentence: <SentenceReuse local={props.local}></SentenceReuse>,
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

function todata(x) {
  var ret = {};
  ret.title = x.name[global.langid];
  ret.value = ret.key = x.value;
  ret.children = [];
  for (var i = 0; i < x.children.length; i++) {
    //if (x.children[i].value.startsWith('@@@')) continue;
    ret.children.push(todata(x.children[i]));
  }
  return ret;
}

class ReusePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
    const requesturl = 'http://162.105.86.52:12347/reuse/getrange';
    var resp;
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        resp = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    console.log(resp);
    var rangemp = {};
    for (var i in resp) {
      var lst = [];
      for (var j = 0; j < resp[i].length; j++) lst.push(todata(resp[i][j]));
      rangemp[i] = lst;
    }
    this.local = {
      range: rangemp,
      Aset: [],
      Bset: [],
    };
  }

  getres() {
    const requesturl = 'http://162.105.86.52:12347/reuse/getreuse';
    var data = { Aset: this.local.Aset, Bset: this.local.Bset };
    var resp;
    $.ajax({
      type: 'GET',
      url: requesturl,
      data: data,
      async: false,
      success: function (response) {
        resp = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    this.local.result = resp;
  }

  render() {
    return (
      <PageContainer>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '32px 32px 32px 32px' }}
        >
          <Steps current={this.state.current}>
            <Step title="分析范围设置" />
            <Step title="复用分析结果" />
          </Steps>
        </Card>
        <div className="steps-content">
          {this.state.current === 0 && (
            <RangeSetting local={this.local}></RangeSetting>
          )}
          {this.state.current === 1 && (
            <ReuseResult local={this.local}></ReuseResult>
          )}
        </div>
        <Card>
          <div className="steps-action" style={{ float: 'right' }}>
            {this.state.current === 0 && (
              <Button
                type="primary"
                onClick={() => {
                  this.getres();
                  this.setState({ current: 1 });
                }}
              >
                下一步
              </Button>
            )}
            {this.state.current === 1 && (
              <Button
                type="primary"
                onClick={() => this.setState({ current: 0 })}
              >
                重新选择
              </Button>
            )}
          </div>
        </Card>
      </PageContainer>
    );
  }
}

export default ReusePage;
