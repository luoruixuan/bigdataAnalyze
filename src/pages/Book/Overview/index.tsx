import { BookOutlined, FilterOutlined, SwapOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Typography, Switch, Pagination, Breadcrumb } from 'antd';
import { useState } from 'react';
const { TabPane } = Tabs;
const { Title } = Typography;
import React from 'react';
import $ from 'jquery';
import '../../lang';
import CatMenu from '../CatMenu';

const CheckboxGroup = Checkbox.Group;

function MyCard(props: {
  title: string;
  author: string;
  dynasty: string;
  category: string;
}) {
  const handleOnclick = () => {
    window.location.href = '/book/'+props.title;
  };

  return (
    <Col span={4}>
      <Card
        hoverable
        style={{ marginTop: '10px' }}
        // bordered={false}
        bodyStyle={{ padding: '6px 6px 6px 6px' }}
        onClick={handleOnclick}
      >
        <Typography.Text strong>
          <BookOutlined />
          {props.title}
        </Typography.Text>
        <br />
        {/* <div
          dangerouslySetInnerHTML={{
            __html: warpTag(props.author, "朱", 'span'),
          }}
        ></div> */}
        <span style={{ fontSize: '10px' }}>
          作者：{props.author}
          <br />
          时代：{props.dynasty}
          <br />
          类目：{props.category}
          <br />
        </span>
      </Card>
    </Col>
  );
}

class bookBrowseOverview extends React.Component {
	constructor(props) {
		super(props);
		var catid='0';
		if ('catid' in props.location.query) catid = props.location.query.catid;
		var requesturl = 'http://162.105.86.52:12347/browse/bookoverview';
		var data = {
			'catid': catid,
		};
		var allbooks;
		var routes;
		$.ajax({
			type: 'GET',
			url: requesturl,
			data: data,
			async: false,
			success: function(response) {
				var tmp = JSON.parse(response);
				allbooks = tmp.books;
				routes = tmp.route;
			},
			error: function(error) {
				console.log(error);
			},
		});
		this.allbooks = allbooks;
		this.routes = routes;
		this.catid = catid;
		this.updateData = this.updateData.bind(this);
		this.getshowdata = this.getshowdata.bind(this);
		this.state = {
			props:props,
			pageSize: 18,
			currentPage: 1,
			total: allbooks.length,
			showdata: this.getshowdata(),
		}
	}

	getshowdata(page=1, pageSize=18) {
		var lst = [];
		const valid = this.allbooks;
		var s = (page-1)*pageSize;
		var e = Math.min(s+pageSize, valid.length);
		for (var i=s;i<e;i++) {
			var val = valid[i];
			var period_start = val['start_time'][global.langid];
			var period_end = val['end_time'][global.langid];
			var period_str;
			if (period_start==period_end) {
				period_str = period_start;
			}
			else {
				period_str = period_start + '~' + period_end;
			}
			lst.push(<MyCard
				title={val['name'][global.langid]}
				author={val['author'][global.langid]}
				dynasty={period_str}
				category={val['catalogue'][global.langid]}
			/>);
		}
		return lst;
	}

	updateData(page, pageSize) {
		var lst = this.getshowdata(page, pageSize);
		this.setState({
			currentPage: page,
			pageSize: pageSize,
			showdata: lst,
		});
	}


	render() {
	  var props = this.state.props;
	  var routes = [];
	  for (var i=0;i<this.routes.length;i++) {
		  routes.push(
			<Breadcrumb.Item href={'/book?catid='+this.catid.slice(0, i+1)}>
				<span> {this.routes[i][global.langid]}</span>
			</Breadcrumb.Item>
		  );
	  }

	  return (<Row gutter={64}>
		<Col span={4}>
			<CatMenu/>
		</Col>
		<Col span={18} gutter={16}>
			<Row>
				<Breadcrumb>
					{routes}
				</Breadcrumb>
			</Row>
			<Row gutter={16}>{this.state.showdata}</Row>
			<Row justify="end" style={{ marginTop: '10px' }}>
				<Pagination
					defaultCurrent={this.state.currentPage}
					current={this.state.currentPage}
					total={this.state.total}
					pageSize={this.state.pageSize}
					onChange={this.updateData}
					showSizeChanger={false}
				/>
			</Row>
		</Col>
	  </Row>);

	}
}

export default bookBrowseOverview;
