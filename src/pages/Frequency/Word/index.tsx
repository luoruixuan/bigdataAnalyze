import { InfoCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Row,
  Col,
  Button,
  Card,
  Form,
  Image,
  Select,
  Tabs,
  Tooltip,
  TreeSelect,
  Table,
} from 'antd';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState } from 'react';
import React from 'react';
import RangeSelectBar from '../RangeSelectBar';
import $ from 'jquery';
import LineFig from '../LineFig';
import BarFig from '../BarFig';

const { Option } = Select;
const { TabPane } = Tabs;
const { SHOW_PARENT } = TreeSelect;

class WordPage extends React.Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.columns = [
      {
        title: '词语',
        dataIndex: 'word',
        key: 'word',
        width: '25%',
      },
      {
        title: '频次',
        dataIndex: 'frequency',
        key: 'frequency',
        width: '25%',
      },
      {
        title: '历时变化',
        dataIndex: 'sample',
        key: 'sample',
        width: '25%',
        render: (_: any, records: any) => (
          <>
            <Sparklines data={records.spark}>
              <SparklinesLine color="blue" />
            </Sparklines>
          </>
        ),
      },
    ];
    this.state = {
      wordSelect: true,
      selected: [],
      result: { count: [], matrix: [], periods: [], words: [] },
      tabledata: [],
    };
  }

  get_topk(value) {
    console.log(value);
    var stateupdate = { selected: [], tabledata: [] };
    if (value === [] || value.length === 0) {
      stateupdate.wordSelect = true;
    } else {
      stateupdate.wordSelect = false;
    }
    if (value.length > 0) {
      var requesturl = 'http://162.105.86.52:12347/frequency/word';
      var data = { range: value };
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
      stateupdate.result = resp;
      console.log(resp);
    } else {
      stateupdate.result = { count: [], matrix: [], periods: [], words: [] };
    }
    this.setState(stateupdate);
  }

  wordSelectChange(value: any) {
    console.log(value);
    var tabledata = [];
    for (var i = 0; i < value.length; i++) {
      var idx = value[i];
      var tmp = {
        key: tabledata.length + 1,
        word: this.state.result.words[idx],
        frequency: this.state.result.count[idx],
        spark: this.state.result.matrix[idx],
      };
      tabledata.push(tmp);
    }
    this.setState({ selected: value, tabledata: tabledata });
  }

  render() {
    var children = [];
    for (var i = 0; i < this.state.result.words.length; i++) {
      children.push(
        <Option key={i} value={i}>
          {this.state.result.words[i]}
        </Option>,
      );
    }

    var selected_fig = {
      words: [],
      matrix: [],
      periods: this.state.result.periods,
    };
    for (var i = 0; i < this.state.selected.length; i++) {
      var idx = this.state.selected[i];
      selected_fig.words.push(this.state.result.words[idx]);
      selected_fig.matrix.push(this.state.result.matrix[idx]);
    }
    this.figresult = { fig: selected_fig };

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
              <Row>
                <Col span={20}>
                  <RangeSelectBar
                    setMethod={(x) => {
                      this.form.range = x;
                    }}
                    fixdyn={true}
                  />
                </Col>
                <Col span={4}>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.get_topk(this.form.range);
                    }}
                  >
                    下一步
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="词汇范围">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="请选择要分析的词语范围"
                // defaultValue={[10, 11]}
                onChange={(x) => {
                  this.wordSelectChange(x);
                }}
                disabled={this.state.wordSelect}
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
              <Table columns={this.columns} dataSource={this.state.tabledata} />
            </TabPane>
            <TabPane tab="折线图" key="2">
              <LineFig
                resultfunc={() => {
                  return this.figresult;
                }}
              />
            </TabPane>
            <TabPane tab="柱状图" key="3">
              <BarFig
                resultfunc={() => {
                  return this.figresult;
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
