import { Modal, Divider, Row, Button, Select } from 'antd';
import { DualAxes, Column, Pie, WordCloud } from '@ant-design/charts';
import { ArrowsAltOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';

function VisualPie(props) {
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

const VisualWordCloud = (props) => {
	if (!('wordcloud' in global.SearchResult)) {
		var data = [];
	}
	else {
	  var arr = global.SearchResult['wordcloud'][props.pagekey];
	  if (props.pagekey=='content') arr = arr[props.rangeState];
	  var data = [];
	  for (var i=0;i<arr.length;++i) {
		  data.push({value:arr[i][1], name:arr[i][0]});
	  }
	}
	if (props.size=='small') data = data.slice(0,10);
	else data = data.slice(0, parseInt(props.numState));
  const config = {
    data,
    autoFit: true,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [12, 24],
      rotation: 0,
    },
    // 返回值设置成一个 [0, 1) 区间内的值，
    // 可以让每次渲染的位置相同（前提是每次的宽高一致）。
    random: () => 0.5,
  };

  if (props.size=='small') {
	  return (
		<div style={{ height: props.height }}>
		  <WordCloud {...config} />
		</div>
	  );
  }
  else {
	  return (
		<div style={{ height: props.height }}>
      <Row
        align="middle"
        justify="end"
        style={{ fontSize: '15px', marginTop: '12px' }}
      >
        词汇量选取Top
        <Select
          defaultValue={props.numState}
          style={{ width: 105, fontSize: '15px' }}
          onChange={(value) => {props.setNumState(value)}}
          size="small"
        >
          <Select.Option value="10" style={{ fontSize: '15px' }}>
            10
          </Select.Option>
          <Select.Option value="30" style={{ fontSize: '15px' }}>
			30
          </Select.Option>
          <Select.Option value="50" style={{ fontSize: '15px' }}>
            50
          </Select.Option>
          <Select.Option value="100" style={{ fontSize: '15px' }}>
			100
          </Select.Option>
        </Select>
      </Row>
		  <WordCloud {...config} />
		</div>
		)
  }
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

function WordCloudSelect(props) {
	if (props.pagekey=='book') return (<> </>);
	return (
      <Row
        align="middle"
        justify="end"
        style={{ fontSize: '8px', marginTop: '12px' }}
      >
        在结果所在
        <Select
          defaultValue="sentence"
          style={{ width: 105, fontSize: '8px' }}
          onChange={(value) => {props.setWcRangeState(value)}}
          size="small"
        >
          <Select.Option value="sentence" style={{ fontSize: '8px' }}>
            句子
          </Select.Option>
          <Select.Option value="para" style={{ fontSize: '8px' }}>
            段落
          </Select.Option>
          <Select.Option value="chapter" style={{ fontSize: '8px' }}>
            篇章
          </Select.Option>
          <Select.Option value="book" style={{ fontSize: '8px' }}>
            书目
          </Select.Option>
        </Select>
        中统计
      </Row>);
}

function VisualizedResult(props) {
	const [isPieModalVisible, setIsPieModalVisible] = useState(false);
	const [isDualModalVisible, setIsDualModalVisible] = useState(false);
	const [isWcModalVisible, setIsWcModalVisible] = useState(false);
	const [pieState, setPieState] = useState('');
	const [wcRangeState, setWcRangeState] = useState('sentence');
	const [wcNumState, setWcNumState] = useState('30');
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
	  <WordCloudSelect pagekey={props.pagekey} setWcRangeState={setWcRangeState}/>
      <Row justify="end">
        <Button type="text" icon={<ArrowsAltOutlined />} onClick={()=>{setIsWcModalVisible(true);}} size="small"></Button>
      </Row>
	  <Modal title='TopK词汇' visible={isWcModalVisible} onCancel={()=>{setIsWcModalVisible(false);}} footer={null}>
		<VisualWordCloud pagekey={props.pagekey} height='300px' size="large" rangeState={wcRangeState} numState={wcNumState} setNumState={setWcNumState}/>
	  </Modal>
      <VisualWordCloud pagekey={props.pagekey} height='100px' size="small" rangeState={wcRangeState}/>
    </>
  );
}

export default VisualizedResult;
