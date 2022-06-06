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
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';

const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

class BarFig extends React.Component {
  componentDidUpdate() {
    this.componentDidMount();
  }
  componentDidMount() {
    this.updateBar();
  }
  updateBar() {
    var res = this.state.resultfunc().fig;
    var dataseries = [];
    var N = Math.min(5, res.words.length);
    var legenddata = [];
    for (var i = 0; i < N; i++) {
      dataseries.push({
        type: 'bar',
        data: res.matrix[i],
        name: res.words[i],
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
      });
    }

    var chartDom = document.getElementById('echarts_bar');
    var myChart = echarts.init(chartDom);
    const Opt = {
      legend: {},
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
      yAxis: {
        type: 'category',
        data: res.periods,
      },
      xAxis: {
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
      <div id="echarts_bar" style={{ width: '100%', height: '600px' }}></div>
    );
  }
}

export default BarFig;
