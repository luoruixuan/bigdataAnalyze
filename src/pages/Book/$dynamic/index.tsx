import { SwapOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Typography, Switch, Breadcrumb } from 'antd';
import { useState } from 'react';
const { TabPane } = Tabs;
const { Title } = Typography;
import React from 'react';
import $ from 'jquery';
import '../../lang';
import CatMenu from '../CatMenu';

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
		  for (var j=0;j<page.children.length;j++) {
			  var para = page.children[j];
			  var tmp_para = [];
			  for (var k=0;k<para.length;k++) {
				  var [txt, subid, reused] = para[k];
				  var href =  '/sentence/'+String(subid[0])+'_'+String(subid[1])+'_'+String(subid[2])+'_'+String(subid[3]);
				  // 必须这样写，否则如果直接写会直接找href这个局部变量，所有句子跳转到同一个地方
				  function jump(href) {
					  return () => {window.location.href = href;}
				  }
				  if (reused) {
					  var sty = {backgroundColor:this.state.reuseSwitch?'#F5A9A9':'#FFFFFF'}
				  }
				  else {
					  var sty = {backgroundColor:'#FFFFFF'};
				  }
				  tmp_para.push(
					<>
					  <span
						style={sty}
						onClick={jump(href)}
					  >
						{txt}
					  </span>
					  </>
				  );
			  }
			  tmp.push(
				<>
				  {String(i+1)+'.'+String(j+1)}
				  {tmp_para}
				  <br />		
				  </>
			  );
		  }
		  tabpanes.push(
			  <TabPane tab={page.name[global.langid]} key={i}>
				<div style={{ margin: 20, height: 40}}>
				  <Row justify="end">
					<Col>
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
				<div style={{height: 400, overflow: "scroll"}}>
					{tmp}
				</div>
			  </TabPane>
		  );
	  }
	  return tabpanes;
	}

	render() {
	  var props = this.state.props;

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
	  var dft = "0";
	  if ('page' in this.state.props.location.query) {
		  dft = this.state.props.location.query.page;
	  }

	  var routes = [];
	  const cat_route = this.state.data.cat_route;
	  const cat_id = String(this.state.data.cat_id);
	  for (var i=0;i<cat_route.length;i++) {
		   routes.push(
		    <Breadcrumb.Item href={'/book?catid='+cat_id.slice(0, i+1)}>
				<span> {cat_route[i][global.langid]}</span>
			</Breadcrumb.Item>
			);
	  }
	  routes.push(
		    <Breadcrumb.Item href={'/book/'+this.state.data.name[global.langid]}>
				<span> {this.state.data.name[global.langid]}</span>
			</Breadcrumb.Item>
	  );

	  return (
		<Row gutter={64}>
		<Col span={4}>
			<CatMenu/>
		</Col>
		<Col span={18} gutter={16}>
			<Row>
				<Breadcrumb>
					{routes}
				</Breadcrumb>
			</Row>	
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
				<Tabs defaultActiveKey={dft} tabPosition='left' style={{ height: 440 }}>
					{tabpanes}
				</Tabs>
			  </Card>
		  </Col>
		</Row>
	  );
	}
}

export default bookBrowse;
