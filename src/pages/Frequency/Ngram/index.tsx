import { EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tabs,
  TreeSelect,
  Typography,
  Table,
  Col,
} from 'antd';
import { useState } from 'react';
import RangeSelectBar from '../RangeSelectBar';
import React from 'react';
import $ from 'jquery';
import LineFig from '../LineFig';
import BarFig from '../BarFig';

const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

function CountTable(props) {
  var data = props.data;
  var nres = data.length;
  var width = 1 / (4 * nres - 1);
  var columns = [];
  var newdata = [];
  for (var i = 0; i < 10; i++) newdata.push({});
  for (var i in data) {
    var gramdata = data[i];
    columns.push({
      title: '单词',
      dataIndex: 'word' + i,
      key: 'word' + i,
      width: width,
    });
    columns.push({
      title: '计数',
      dataIndex: 'count' + i,
      key: 'count' + i,
      width: width,
    });
    columns.push({
      title: '占比',
      dataIndex: 'ratio' + i,
      key: 'ratio' + i,
      width: width,
      render: (text: string, record: any) => {
        var x = parseFloat(text) * 1e8;
        x = parseInt(x) / 1e6;
        return x + '%';
      },
    });
    columns.push({
      title: '',
      dataIndex: 'blank' + i,
      key: 'blank' + i,
      width: width,
    });
    for (var j = 0; j < gramdata.length; j++) {
      newdata[j]['word' + i] = gramdata[j][0];
      newdata[j]['count' + i] = gramdata[j][1];
      newdata[j]['ratio' + i] = gramdata[j][2];
      newdata[j]['blank' + i] = '';
    }
  }
  columns.pop();
  return (
    <Table
      columns={columns}
      dataSource={newdata}
      size="small"
      pagination={false}
    />
  );
}

class WordPage extends React.Component {
  constructor(props) {
    super(props);
    var requesturl = 'http://162.105.86.52:12347/frequency/getstopwords';
    var stop;
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        stop = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    this.plainOptions = stop;
    this.state = {
      isModalVisible: false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      result: { gram: {}, fig: { words: [], periods: [], matrix: [] } },
    };
    this.form = {
      dict: [],
      gram: [],
      range: [],
      userStopWords: '',
    };
  }

  get_result() {
    var stop =
      this.state.checkedList.join('\n') + '\n' + this.form.userStopWords;
    console.log(this.form);
    console.log(stop);
    var data = {
      stopwords: stop,
      dict: this.form.dict,
      gram: this.form.gram,
      range: this.form.range,
    };
    console.log(data);
    var requesturl = 'http://162.105.86.52:12347/frequency/ngram';
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
    console.log(resp);
    this.setState({
      result: resp,
    });
  }

  render() {
    const onChange = (list: any) => {
      this.setState({
        checkedList: list,
        indeterminate: !!list.length && list.length < this.plainOptions.length,
        checkAll: list.length === this.plainOptions.length,
      });
    };

    const onCheckAllChange = (e: any) => {
      this.setState({
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    };

    const showModal = () => {
      this.setState({ isModalVisible: true });
    };

    const handleOk = () => {
      this.setState({ isModalVisible: false });
    };

    const handleCancel = () => {
      this.setState({ isModalVisible: false });
    };

    const onFinish = (values: any) => {
      console.log('Received values of form:', values);
    };

    return (
      <PageContainer>
        <Card
          title="分析条件设置"
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '32px 32px 32px 32px' }}
        >
          <Form>
            <Form.Item label="统计范围">
              {/* <BookTreeSelect /> */}
              <RangeSelectBar
                setMethod={(x) => {
                  this.form.range = x;
                }}
                fixdyn={true}
              />
            </Form.Item>
            <Form.Item label="分析粒度">
              <Space>
                <Checkbox.Group
                  onChange={(x) => {
                    this.form.gram = x;
                  }}
                >
                  <Checkbox value="unigram" style={{ lineHeight: '32px' }}>
                    unigram
                  </Checkbox>
                  <Checkbox value="bigram" style={{ lineHeight: '32px' }}>
                    bigram
                  </Checkbox>
                  <Checkbox value="trigram" style={{ lineHeight: '32px' }}>
                    trigram
                  </Checkbox>
                  <Checkbox value="4-gram" style={{ lineHeight: '32px' }}>
                    4-gram
                  </Checkbox>
                </Checkbox.Group>
              </Space>
            </Form.Item>
            <Form.Item
              label="匹配词典"
              tooltip="【note】允许用户自定义/选择已有词表对N-gram结果进行过滤"
            >
              <Space>
                <Checkbox.Group
                  onChange={(x) => {
                    this.form.dict = x;
                  }}
                >
                  <Checkbox value="dict1" style={{ lineHeight: '32px' }}>
                    汉语大词典
                  </Checkbox>
                </Checkbox.Group>
                {/* <Upload
                action=""
                listType="picture"
                maxCount={1}
                accept='.txt'
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload> */}
              </Space>
            </Form.Item>
            <Form.Item
              label="停用词表"
              tooltip="【note】允许用户自定义停用词表对N-gram结果进行过滤"
            >
              <Button icon={<EditOutlined />} onClick={showModal}>
                修改词表
              </Button>
              <Modal
                title="停用词设置"
                visible={this.state.isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div style={{ width: '100%', marginBottom: 10 }}>
                  <Typography.Text strong>预设词表选择：</Typography.Text>
                </div>
                <Checkbox
                  style={{ marginBottom: 10 }}
                  indeterminate={this.state.indeterminate}
                  onChange={onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全选
                </Checkbox>
                {/* <Button type='text' icon={<PlusCircleOutlined />}>添加</Button> */}

                <Space>
                  <Checkbox.Group
                    style={{ width: '20%' }}
                    options={this.plainOptions}
                    value={this.state.checkedList}
                    onChange={onChange}
                  />
                </Space>
                <Divider />

                <div style={{ width: '100%' }}>
                  <Typography.Text strong>自定义停用词：</Typography.Text>
                </div>
                <div style={{ width: '100%', marginBottom: 10 }}>
                  以<Typography.Text code>换行符\n</Typography.Text>
                  分割可自动分词
                </div>
                <Input.TextArea
                  rows={4}
                  bordered={true}
                  onChange={(x) => {
                    this.form.userStopWords = x.target.value;
                  }}
                />
              </Modal>
            </Form.Item>
            <Form.Item style={{ float: 'right' }}>
              <Button
                onClick={() => {
                  this.get_result();
                }}
              >
                提交
              </Button>
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
              <CountTable data={this.state.result.gram} />
            </TabPane>
            <TabPane tab="折线图" key="2">
              <LineFig
                resultfunc={() => {
                  return this.state.result;
                }}
              />
            </TabPane>
            <TabPane tab="柱状图" key="3">
              <BarFig
                resultfunc={() => {
                  return this.state.result;
                }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageContainer>
    );
  }
}

export default WordPage;
