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
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';

const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

class LineFig extends React.Component {
  componentDidUpdate() {
    this.componentDidMount();
  }
  componentDidMount() {
    this.updateLine();
  }
  updateLine() {
    var res = this.state.resultfunc().fig;
    var dataseries = [];
    var N = Math.min(4, res.words.length);
    var legenddata = [];
    for (var i = 0; i < N; i++) {
      dataseries.push({
        type: 'line',
        data: res.matrix[i],
        name: res.words[i],
      });
    }

    var chartDom = document.getElementById('echarts_line');
    var myChart = echarts.init(chartDom);
    const Opt = {
      legend: {},
      xAxis: {
        type: 'category',
        data: res.periods,
      },
      yAxis: {
        type: 'value',
      },
      series: dataseries,
    };
    myChart.setOption(Opt);
  }

  constructor(props) {
    super(props);
    this.state = {
      resultfunc: props.resultfunc,
    };
  }

  render() {
    return (
      <div id="echarts_line" style={{ width: '100%', height: '600px' }}></div>
    );
  }
}

export default LineFig;
