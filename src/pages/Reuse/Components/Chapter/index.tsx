import { useState } from 'react';
import { Image, Select, Alert, Button, Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/treemap';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import React from 'react';
import ReuseList from './ReuseList';

function getLevelOption() {
  return [
    {
      itemStyle: {
        borderWidth: 0,
        gapWidth: 5,
      },
    },
    {
      colorSaturation: [0.35, 0.5],
      itemStyle: {
        gapWidth: 1,
        borderColorSaturation: 0.6,
      },
    },
  ];
}

const formatUtil = echarts.format;

class ChapterReuse extends React.Component {
  componentDidUpdate() {
    this.componentDidMount();
  }
  componentDidMount() {
    var chartDom = document.getElementById('echartsfig');
    var myChart = echarts.init(chartDom);
    const Opt = {
      title: {
        text: '篇章粒度',
        left: 'center',
      },
      tooltip: {
        formatter: function (info) {
          var value = info.value;
          var treePathInfo = info.treePathInfo;
          var treePath = [];
          for (var i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }
          return [
            '<div class="tooltip-title">' +
              formatUtil.encodeHTML(treePath.join('-')) +
              '</div>',
            '复用频次' + formatUtil.addCommas(value),
          ].join('');
        },
      },
      series: [
        {
          name: this.state.selectedBook,
          type: 'treemap',
          visibleMin: 1,
          label: {
            show: true,
            formatter: '{b}',
          },
          itemStyle: {
            borderColor: '#fff',
          },
          levels: getLevelOption(),
          data: this.props.local.result.page.treemap[this.state.selectedBook],
        },
      ],
    };
    myChart.setOption(Opt);
    var setfunc = this.local.setReuseList;
    myChart.on('click', function (params) {
      var treePathInfo = params.treePathInfo;
      if (treePathInfo.length != 3) return;
      var Aname = treePathInfo[0].name;
      var Apagename = treePathInfo[1].name;
      var Bname = treePathInfo[2].name;
      setfunc(Aname, Apagename, Bname);
    });
  }
  constructor(props) {
    super(props);
    var dft = '';
    for (var Aname in props.local.result.page.reuse) {
      dft = Aname;
      break;
    }
    this.local = {};
    this.state = {
      selectedBook: dft,
    };
  }
  render() {
    const { Option } = Select;

    var props = this.props;
    var local = props.local;
    var reuse = local.result.page.reuse;
    var treemap = local.result.page.treemap;
    var selectedA = this.state.selectedBook;
    var options = [];
    for (var Aname in reuse) {
      options.push(<Option value={Aname}>{Aname}</Option>);
    }
    var total = 0;
    if (selectedA != '') {
      for (var i = 0; i < treemap[selectedA].length; i++) {
        total += treemap[selectedA][i].value;
      }
    }

    return (
      <>
        <Form>
          <Form.Item label="分析书目">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择分析书目"
              optionFilterProp="children"
              onChange={(value: string) => {
                this.setState({
                  selectedBook: value,
                });
              }}
              defaultValue={this.state.selectedBook}
            >
              {options}
            </Select>
          </Form.Item>
        </Form>

        <div style={{ paddingTop: 10 }}>
          <Alert
            message={
              this.state.selectedBook +
              '在所选取的文本集合中复用' +
              total.toString() +
              '次'
            }
            type="success"
            showIcon
          />
        </div>
        <div style={{ float: 'right' }}>
          <DownloadOutlined />
        </div>
        <div id="echartsfig" style={{ width: '100%', height: '600px' }}></div>
        <div id="reuseresult">
          <ReuseList
            getSetMethod={(f) => {
              this.local.setReuseList = f;
            }}
            local={local}
          />
        </div>
      </>
    );
  }
}

export default ChapterReuse;
