import { Modal, Divider, Row, Button, Select } from 'antd';
import { DualAxes, Column, Pie, WordCloud } from '@ant-design/charts';
import { ArrowsAltOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';

function VisualPie(props) {
	console.log(222, props.state);
  const resdata = global.SearchResult[props.pagekey];
  var mp = {};
  for (var i=0;i<resdata.length;i++) {
	  var tmp = resdata[i];
	  var cat = tmp.category[global.langid];
	  if (!(cat in mp)) mp[cat] = 0;
	  mp[cat] += 1;
  }
  var arr = global.catalogues;
  var data = [];
  if (props.state=='') {
	  for (var i=0;i<arr.length;++i) {
		  var tmp = arr[i];
		  var catname = tmp.name[global.langid];
		  var count = 0;
		  if ('children' in tmp) {
			  for (var j=0;j<tmp.children.length;j++) {
				  var subname = tmp.children[j].name[global.langid];
				  if (subname in mp) count += mp[subname];
			  }
		  }
		  if ((catname in mp)&&(count==0)) count = mp[catname];
		  if (count>0) data.push({
			  type: catname,
			  value: count,
			});
	  }
  }
  else {
	  for (var i=0;i<arr.length;++i) {
		  var tmp = arr[i];
		  var catname = tmp.name[global.langid];
		  if (catname!=props.state) continue;
		  for (var j=0;j<tmp.children.length;j++) {
			  var subname = tmp.children[j].name[global.langid];
			  if (subname in mp) {
				data.push({
				  type: subname,
				  value: mp[subname],
				});
			  }
		  }
	  }
  }
  const config = {
    autoFit: true,
    appendPadding: 0,
    data,
    angleField: 'value',
    colorField: 'type',
    // radius: 0.9,
    // legend: false,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 8,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
	onReady: (plot) => {
		plot.chart.on('element:click', (...args) => {
			var clkname = args[0].data.data.type;
			var arr=global.catalogues;
			for (var i=0;i<arr.length;++i) {
				var tmp = arr[i];
				var catname = tmp.name[global.langid];
				if (catname==clkname) {
					if (('children' in tmp)&&(tmp.children.length>0)) props.setState(catname);
					break;
				}
			}
		})
	},
  };
  if (props.state!=''){
	  return (
		<div style={{ height: props.height }}>
			<Button type="text" icon={<ArrowLeftOutlined />} onClick={()=>{props.setState('');}} size="small"></Button>
		  <Pie {...config} />
		</div>
	  );
  }
  else {
	  return (
		<div style={{ height: props.height }}>
		  <Pie {...config} />
		</div>
	  );
  }
};

const DemoWordCloud = () => {
  const data = [
    { value: 9, name: '君子' },
    { value: 2, name: '學而' },
    { value: 9, name: '小人' },
    { value: 9, name: '聖人' },
    { value: 15, name: '仁政' },
    { value: 10, name: '顔淵' },
    { value: 10, name: '天' },
    { value: 10, name: '禮' },
    { value: 10, name: '道' },
    { value: 10, name: '信' },
  ];
  const config = {
    data,
    autoFit: true,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [6, 12],
      rotation: 0,
    },
    // 返回值设置成一个 [0, 1) 区间内的值，
    // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
    random: () => 0.5,
  };

  return (
    <div style={{ height: '100px' }}>
      <WordCloud {...config} />
    </div>
  );
};

const VisualDualAxes = (props) => {
  const resdata = global.SearchResult[props.pagekey];
  var mp = {};
  for (var i=0;i<resdata.length;i++) {
	  var tmp = resdata[i];
	  var per = tmp.start_time[global.langid];
	  if (!(per in mp)) mp[per] = 0;
	  mp[per] += 1;
  }
  var arr = global.periods;
  var data = [];
  for (var i=0;i<arr.length;++i) {
	  var tmp = arr[i];
	  var pername = tmp.name[global.langid];
	  var count = 0;
	  var tot = tmp.char_count;
	  if ('children' in tmp) {
		  for (var j=0;j<tmp.children.length;j++) {
			  var subname = tmp.children[j].name[global.langid];
			  if (subname in mp) count += mp[subname];
		  }
	  }
	  if ((pername in mp)&&(count==0)) count = mp[pername];
	  if (count>0) data.push({
		  time: pername,
		  value: count,
		  ratio: count/tot,
		});
  }
  var config = {
    data: [data, data],
    padding: 'auto',
    autoFit: true,
    xField: 'time',
    yField: ['value', 'ratio'],
    geometryOptions: [
      {
        geometry: 'column',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
    meta: {
      value: {
        alias: '出現頻次',
      },
      ratio: {
        alias: '出現頻率',
        formatter: (v: number) => {
          return `${Number(v * 100).toFixed(5)}% `;
        },
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
        autoEllipsis: false,
      },
    },
    legend: {
      itemName: {
        formatter: (text: any, item: any) => {
          return item.value === 'value' ? '出現頻次' : '出現頻率(%)';
        },
      },
    },
  };
  if (props.pagekey=='book') {
	  config = {
		  data, 
		  padding: 'auto',
		  autofit: true,
		  xField: 'time',
		  yField: 'value',
		  xAxis: {
			  label: {
				  autoRotate: true,
				  autoHide: false,
				  autoEllipsis: false,
			  },
		  },
		  meta: {
			  value: {
				  alias: '出現頻次',
			  },
		  },
	  };
	  return (
		<div style={{ height: props.height }}>
		  <Column {...config} />
		</div>
		);
  }
  return (
    <div style={{ height: props.height }}>
      <DualAxes {...config} />
    </div>
  );
};

function VisualizedResult(props) {
	const [isPieModalVisible, setIsPieModalVisible] = useState(false);
	const [isDualModalVisible, setIsDualModalVisible] = useState(false);
	const [pieState, setPieState] = useState('');
	console.log(1);
  return (
    <>
      <Divider
        orientation="center"
        style={{ fontSize: '14px', marginTop: '12px', marginBottom: '6px' }}
      >
        时代分布
      </Divider>
      <Row justify="end">
        <Button type="text" icon={<ArrowsAltOutlined />} onClick={()=>{setIsDualModalVisible(true);}} size="small"></Button>
      </Row>
	  <Modal title='时代分布' visible={isDualModalVisible} onCancel={()=>{setIsDualModalVisible(false);}} footer={null}>
		<VisualDualAxes pagekey={props.pagekey} height='300px'/>
	  </Modal>
      <VisualDualAxes pagekey={props.pagekey} height='150px'/>
      <Divider
        orientation="center"
        style={{ fontSize: '14px', marginTop: '12px', marginBottom: '6px' }}
      >
        类目分布
      </Divider>
      <Row justify="end">
        <Button type="text" icon={<ArrowsAltOutlined />} onClick={()=>{setIsPieModalVisible(true);}} size="small"></Button>
      </Row>
	  <Modal title='类目分布' visible={isPieModalVisible} onCancel={()=>{setIsPieModalVisible(false);}} footer={null}>
		<VisualPie pagekey={props.pagekey} height='300px' state={pieState} setState={setPieState}/>
	  </Modal>
      <VisualPie pagekey={props.pagekey} height='150px' state={pieState} setState={setPieState}/>
      <Divider
        orientation="center"
        style={{ fontSize: '14px', marginTop: '12px', marginBottom: '6px' }}
      >
        TopK词汇
      </Divider>
      <Row
        align="middle"
        justify="end"
        style={{ fontSize: '6px', marginTop: '12px' }}
      >
        在结果所在
        <Select
          defaultValue="sentence"
          style={{ width: 65, fontSize: '4px' }}
          onChange={() => {}}
          size="small"
        >
          <Select.Option value="sentence" style={{ fontSize: '4px' }}>
            句子
          </Select.Option>
          <Select.Option value="para" style={{ fontSize: '4px' }}>
            段落
          </Select.Option>
          <Select.Option value="chapter" style={{ fontSize: '4px' }}>
            篇章
          </Select.Option>
          <Select.Option value="book" style={{ fontSize: '4px' }}>
            书目
          </Select.Option>
        </Select>
        中统计
      </Row>
      <Row justify="end">
        <Button type="text" icon={<ArrowsAltOutlined />} size="small"></Button>
      </Row>
      <DemoWordCloud />
    </>
  );
}

export default VisualizedResult;
