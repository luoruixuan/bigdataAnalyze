import { SwapOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Typography, Switch } from 'antd';
import { useState } from 'react';
const { TabPane } = Tabs;
const { Title } = Typography;
import React from 'react';
import $ from 'jquery';
import '../../lang';

const CheckboxGroup = Checkbox.Group;

class bookBrowse extends React.Component {
	constructor(props) {
		super(props);
		var data = this.getdata(props.match.params.bookName);
		this.state = {
			props:props,
			data:data,
			reuseSwitch:false,
		}
	}

	getdata(bookName) {
		const requesturl = 'http://162.105.86.52:12347/browse/book';
		const data = {name: bookName};
		var resp;
		$.ajax({
			type: 'GET',
			url: requesturl,
			data: data,
			async: false,
			success: function(response) {
				resp = JSON.parse(response);
			},
			error: function(error) {
				console.log(error);
			}
		});
		return resp;
	}

	gettabpanes() {
	  var tabpanes = [];
	  for (var i=0;i<this.state.data.children.length;i++) {
		  var page = this.state.data.children[i];
		  var tmp = [];
		  tmp.push(
				<div style={{ margin: 20 }}>
				  <Row>
					<Col span={4} offset={20}>
					  复用分析：
					  <Switch
						checkedChildren="开"
						unCheckedChildren="关"
						checked={this.state.reuseSwitch}
						onChange={(value)=>{this.setState({reuseSwitch:value});}}
					  />
					</Col>
				  </Row>
				</div>
				);
		  for (var j=0;j<page.children.length;j++) {
			  var href =  '/sentence/'+String(this.state.data.id)+'_'+String(i)+'_'+String(j);
			  // 必须这样写，否则如果直接写会直接找href这个局部变量，所有句子跳转到同一个地方
			  function jump(href) {
				  return () => {window.location.href = href;}
			  }
			  tmp.push(
				<>
				  {String(i+1)+'.'+String(j+1)}
				  <span
					style={{ backgroundColor: '#F5A9A9' }}
					onClick={jump(href)}
				  >
					{page.children[j]}
				  </span>
				  <br />		
				  </>
			  );
		  }
		  tabpanes.push(
			  <TabPane tab={page.name[global.langid]} key={i}>
				{tmp}
			  </TabPane>
		  );
	  }
	  return tabpanes;
	}

	render() {
	  var props = this.state.props;
	  const routes: never[] = [];

	  var stime = this.state.data.start_time[global.langid];
	  var etime = this.state.data.end_time[global.langid];
	  var ctime_str;
	  if (stime==etime) ctime_str=stime;
	  else ctime_str=stime+'~'+etime;
	  var stime = this.state.data.log_start_time[global.langid];
	  var etime = this.state.data.log_end_time[global.langid];
	  var ltime_str;
	  if (stime==etime) ltime_str=stime;
	  else ltime_str=stime+'~'+etime;

	  const gridStyle = {
		    width: '25%',
			textAlign: 'center',
	  };

	  var tabpanes = this.gettabpanes();

	  return (
		<PageContainer breadcrumb={{ routes }} title={false}>
		  <Card
			style={{ marginTop: 24 }}
			bordered={false}
			bodyStyle={{ padding: '32px 32px 32px 32px' }}
		  >
			<Title level={2}>{this.state.data.name[global.langid]}</Title>
			<Card.Grid hoverable={false} style={gridStyle}>作者：{this.state.data.author[global.langid]}</Card.Grid>
			<Card.Grid hoverable={false} style={gridStyle}>编者：xxx</Card.Grid>
			<Card.Grid hoverable={false} style={gridStyle}>创作时代：{ctime_str}</Card.Grid>
			<Card.Grid hoverable={false} style={gridStyle}>记录时代：{ltime_str}</Card.Grid>
			<Card.Grid hoverable={false} style={gridStyle}>类别：{this.state.data.catalogue[global.langid]}</Card.Grid>
		  </Card>
		  <Card
			style={{ marginTop: 24 }}
			bordered={false}
			bodyStyle={{ padding: '32px 32px 32px 32px' }}
		  >
			<Tabs defaultActiveKey="0" tabPosition='left' style={{ height: 220 }}>
				{tabpanes}
			</Tabs>
		  </Card>
		</PageContainer>
	  );
	}
}

export default bookBrowse;
